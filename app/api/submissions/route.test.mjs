import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "./route.ts";

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function withSubmissionEnvironment(run) {
  const names = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "TURNSTILE_SECRET_KEY",
    "RATE_LIMIT_SECRET",
  ];
  const previous = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  );
  const previousFetch = globalThis.fetch;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-publishable-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";
  process.env.RATE_LIMIT_SECRET = "test-rate-limit-secret";
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
      return jsonResponse({
        success: true,
        hostname: "localhost",
        action: "submission",
      });
    }
    if (url.endsWith("/rest/v1/rpc/consume_api_rate_limit")) {
      return jsonResponse({ allowed: true, retry_after_seconds: 3600 });
    }
    if (
      url.includes("/rest/v1/claim_submissions") &&
      init?.method === "POST"
    ) {
      return jsonResponse({ id: "7c144f47-c131-45b2-b539-2be5a6e73946" }, 201);
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    await run();
  } finally {
    globalThis.fetch = previousFetch;
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

function submissionRequest(overrides = {}) {
  return new Request("http://localhost/api/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": "192.0.2.20",
      ...overrides.headers,
    },
    body: JSON.stringify({
      claim: "A viral claim that needs source checking.",
      topic: "Science",
      sourceUrl: "https://example.org/story",
      turnstileToken: "valid-test-turnstile-token",
      ...overrides.body,
    }),
  });
}

test("stores anonymous reports as private pending submissions", async () => {
  await withSubmissionEnvironment(async () => {
    const response = await POST(submissionRequest());
    assert.equal(response.status, 201);
    assert.match((await response.json()).message, /private/i);
  });
});

test("rejects insecure source links before writing a report", async () => {
  await withSubmissionEnvironment(async () => {
    const response = await POST(
      submissionRequest({ body: { sourceUrl: "http://example.org/story" } }),
    );
    assert.equal(response.status, 400);
  });
});

test("rejects cross-origin student submissions", async () => {
  const response = await POST(
    submissionRequest({
      headers: { Origin: "https://attacker.example" },
    }),
  );
  assert.equal(response.status, 403);
});
