import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "./route.ts";

const sources = [
  {
    title: "Primary report A",
    url: "https://reuters.com/story-a",
    content: "Coverage from source A supports the claim.",
    score: 0.9,
    published_date: "2026-10-10",
  },
  {
    title: "Primary report B",
    url: "https://apnews.com/story-b",
    content: "Independent coverage from source B supports the claim.",
    score: 0.8,
    published_date: "2026-10-11",
  },
];

const corroboratingAnalysis = {
  claim: "The headline's central claim",
  verdict: "Likely true",
  disposition: "corroborated",
  assessment: "Two independent reports corroborate the claim.",
  wordingBias: "The wording is measured.",
  missingContext: "Check the original documents.",
  sourceAssessments: sources.map((source) => ({
    url: source.url,
    summary: "This report directly supports the central claim.",
    position: "Supports",
  })),
};

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function modelText(analysis) {
  return {
    candidates: [{ content: { parts: [{ text: JSON.stringify(analysis) }] } }],
  };
}

async function runAnalysis(fetchMock, headline = "A current news headline") {
  const previousFetch = globalThis.fetch;
  const envNames = [
    "TAVILY_API_KEY",
    "GEMINI_API_KEY",
    "GROQ_API_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "TURNSTILE_SECRET_KEY",
    "RATE_LIMIT_SECRET",
  ];
  const previousKeys = Object.fromEntries(
    envNames.map((name) => [name, process.env[name]]),
  );
  process.env.TAVILY_API_KEY = "test-tavily-key";
  process.env.GEMINI_API_KEY = "test-gemini-key";
  process.env.GROQ_API_KEY = "test-groq-key";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";
  process.env.RATE_LIMIT_SECRET = "test-rate-limit-secret";
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (
      url ===
      "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    ) {
      return jsonResponse({
        success: true,
        hostname: "localhost",
        action: "analysis",
      });
    }
    if (url.endsWith("/rest/v1/rpc/consume_api_rate_limit")) {
      return jsonResponse({ allowed: true, retry_after_seconds: 60 });
    }
    return fetchMock(input, init);
  };

  try {
    const response = await POST(
      new Request("http://localhost/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": "192.0.2.15",
        },
        body: JSON.stringify({
          headline,
          turnstileToken: "valid-test-turnstile-token",
        }),
      }),
    );
    if (!response.ok) return { response, events: [] };
    const events = (await response.text())
      .trim()
      .split("\n\n")
      .map((frame) => JSON.parse(frame.replace(/^data:\s*/, "")));
    return { response, events };
  } finally {
    globalThis.fetch = previousFetch;
    for (const [name, value] of Object.entries(previousKeys)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

test("streams real research stages and cites only retrieved sources", async () => {
  const { response, events } = await runAnalysis(async (input) => {
    const url = String(input);
    if (url === "https://api.tavily.com/search") {
      return jsonResponse({ results: sources });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      return jsonResponse(modelText(corroboratingAnalysis));
    }
    throw new Error(`Unexpected provider request: ${url}`);
  });

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/event-stream/);
  assert.deepEqual(
    events
      .filter((event) => event.type === "progress")
      .map((event) => event.stage),
    ["searching", "reviewing", "comparing", "preparing", "complete"],
  );
  assert.equal(
    events.find((event) => event.type === "sources").sources.length,
    2,
  );

  const result = events.find((event) => event.type === "result").analysis;
  assert.equal(result.provider, "Gemini");
  assert.equal(result.verdict, "Likely true");
  assert.equal(result.evidenceStrength, "Moderate");
  assert.equal(result.sources.length, 2);
});

test("falls back to Groq with the same retrieved evidence", async () => {
  let groqBody;
  const { events } = await runAnalysis(async (input, init) => {
    const url = String(input);
    if (url === "https://api.tavily.com/search") {
      return jsonResponse({ results: sources });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      return jsonResponse(
        { error: { message: "Temporary Gemini outage" } },
        503,
      );
    }
    if (url === "https://api.groq.com/openai/v1/chat/completions") {
      groqBody = JSON.parse(init.body);
      return jsonResponse({
        choices: [
          { message: { content: JSON.stringify(corroboratingAnalysis) } },
        ],
      });
    }
    throw new Error(`Unexpected provider request: ${url}`);
  });

  assert.match(JSON.stringify(groqBody), /reuters\.com/);
  assert.match(
    groqBody.messages[0].content,
    /Return exactly one valid JSON object/,
  );
  assert.match(groqBody.messages[0].content, /"sourceAssessments": \[/);
  const result = events.find((event) => event.type === "result").analysis;
  assert.equal(result.provider, "Groq");
  assert.equal(result.verdict, "Likely true");
  assert.equal(result.sources.length, 2);
});

test("keeps claims unverified when every search request fails", async () => {
  const { events } = await runAnalysis(async (input) => {
    const url = String(input);
    if (url === "https://api.tavily.com/search") {
      return jsonResponse({ detail: { error: "Invalid Tavily key" } }, 401);
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      return jsonResponse(modelText(corroboratingAnalysis));
    }
    throw new Error(`Unexpected provider request: ${url}`);
  });

  const result = events.find((event) => event.type === "result").analysis;
  assert.equal(result.searchCompleted, false);
  assert.equal(result.evidenceSufficient, false);
  assert.equal(result.verdict, "Unverified");
  assert.equal(result.sources.length, 0);
});

test("keeps a successful but empty search unverified", async () => {
  const { events } = await runAnalysis(async (input) => {
    const url = String(input);
    if (url === "https://api.tavily.com/search") {
      return jsonResponse({ results: [] });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      return jsonResponse(modelText(corroboratingAnalysis));
    }
    throw new Error(`Unexpected provider request: ${url}`);
  });

  const result = events.find((event) => event.type === "result").analysis;
  assert.equal(result.searchCompleted, true);
  assert.equal(result.verdict, "Unverified");
  assert.equal(result.evidenceSufficient, false);
  assert.match(result.assessment, /no usable sources/i);
});

test("keeps the conclusion unverified when evidence is insufficient", async () => {
  const unsupportedFalseClaim = {
    ...corroboratingAnalysis,
    verdict: "Likely false",
    disposition: "contradicted",
    assessment: "The story is fabricated.",
    sourceAssessments: [
      {
        url: sources[0].url,
        summary: "This report disputes the claim.",
        position: "Disputes",
      },
    ],
  };
  const { events } = await runAnalysis(async (input) => {
    const url = String(input);
    if (url === "https://api.tavily.com/search") {
      return jsonResponse({ results: [sources[0]] });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      return jsonResponse(modelText(unsupportedFalseClaim));
    }
    throw new Error(`Unexpected provider request: ${url}`);
  });

  const result = events.find((event) => event.type === "result").analysis;
  assert.equal(result.verdict, "Unverified");
  assert.match(result.assessment, /not provide enough independent evidence/i);
  assert.doesNotMatch(result.assessment, /fabricated/i);
});

test("accepts headlines at the 500-character limit", async () => {
  const { response, events } = await runAnalysis(async (input) => {
    const url = String(input);
    if (url === "https://api.tavily.com/search") {
      return jsonResponse({ results: sources });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      return jsonResponse(modelText(corroboratingAnalysis));
    }
    throw new Error(`Unexpected provider request: ${url}`);
  }, "x".repeat(500));

  assert.equal(response.status, 200);
  assert.equal(events.find((event) => event.type === "result").type, "result");
});

test("rejects headlines over the 500-character limit", async () => {
  const response = await POST(
    new Request("http://localhost/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headline: "x".repeat(501) }),
    }),
  );

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /1 and 500 characters/);
});

test("rejects cross-origin analysis requests before provider calls", async () => {
  const response = await POST(
    new Request("http://localhost/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://attacker.example",
      },
      body: JSON.stringify({ headline: "A current news headline" }),
    }),
  );

  assert.equal(response.status, 403);
});

test("blocks bot traffic rejected by Turnstile", async () => {
  const previousFetch = globalThis.fetch;
  const previousKeys = {
    gemini: process.env.GEMINI_API_KEY,
    tavily: process.env.TAVILY_API_KEY,
    turnstile: process.env.TURNSTILE_SECRET_KEY,
  };
  process.env.GEMINI_API_KEY = "test-gemini-key";
  process.env.TAVILY_API_KEY = "test-tavily-key";
  process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";
  globalThis.fetch = async (input) => {
    assert.equal(
      String(input),
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    return jsonResponse({
      success: false,
      hostname: "localhost",
      action: "analysis",
    });
  };

  try {
    const response = await POST(
      new Request("http://localhost/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: "A current news headline",
          turnstileToken: "invalid-test-token",
        }),
      }),
    );
    assert.equal(response.status, 403);
    assert.match((await response.json()).error, /security check/i);
  } finally {
    globalThis.fetch = previousFetch;
    for (const [name, value] of Object.entries(previousKeys)) {
      const key =
        name === "gemini"
          ? "GEMINI_API_KEY"
          : name === "tavily"
            ? "TAVILY_API_KEY"
            : "TURNSTILE_SECRET_KEY";
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("applies a short burst throttle without imposing a daily AI quota", async () => {
  const previousFetch = globalThis.fetch;
  const previousEnv = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY,
    rateSecret: process.env.RATE_LIMIT_SECRET,
    turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
    tavilyKey: process.env.TAVILY_API_KEY,
    geminiKey: process.env.GEMINI_API_KEY,
  };
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  process.env.RATE_LIMIT_SECRET = "test-rate-limit-secret";
  process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";
  process.env.TAVILY_API_KEY = "test-tavily-key";
  process.env.GEMINI_API_KEY = "test-gemini-key";
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (
      url ===
      "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    ) {
      return jsonResponse({
        success: true,
        hostname: "localhost",
        action: "analysis",
      });
    }
    if (url.endsWith("/rest/v1/rpc/consume_api_rate_limit")) {
      return jsonResponse({ allowed: false, retry_after_seconds: 17 });
    }
    throw new Error(`Unexpected provider request: ${url}`);
  };

  try {
    const response = await POST(
      new Request("http://localhost/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": "192.0.2.16",
        },
        body: JSON.stringify({
          headline: "A current news headline",
          turnstileToken: "valid-test-turnstile-token",
        }),
      }),
    );
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), "17");
  } finally {
    globalThis.fetch = previousFetch;
    for (const [name, value] of Object.entries(previousEnv)) {
      const key =
        name === "supabaseUrl"
          ? "NEXT_PUBLIC_SUPABASE_URL"
          : name === "serviceRole"
            ? "SUPABASE_SERVICE_ROLE_KEY"
            : name === "rateSecret"
              ? "RATE_LIMIT_SECRET"
              : name === "turnstileSecret"
                ? "TURNSTILE_SECRET_KEY"
                : name === "tavilyKey"
                  ? "TAVILY_API_KEY"
                  : "GEMINI_API_KEY";
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("returns an SSE error when both providers return malformed analysis", async () => {
  const { events } = await runAnalysis(async (input) => {
    const url = String(input);
    if (url === "https://api.tavily.com/search") {
      return jsonResponse({ results: sources });
    }
    if (url.includes("generativelanguage.googleapis.com")) {
      return jsonResponse(modelText({}));
    }
    if (url === "https://api.groq.com/openai/v1/chat/completions") {
      return jsonResponse({ choices: [{ message: { content: "not json" } }] });
    }
    throw new Error(`Unexpected provider request: ${url}`);
  });

  assert.equal(
    events.some((event) => event.type === "result"),
    false,
  );
  assert.match(
    events.find((event) => event.type === "error").error,
    /JSON|invalid analysis/i,
  );
});
