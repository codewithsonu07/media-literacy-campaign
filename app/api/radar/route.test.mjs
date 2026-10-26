import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "./route.ts";
import { getSupabasePublicConfig } from "../../lib/supabase/server.ts";

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("public Radar reads published cards with the publishable key", async () => {
  const names = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ];
  const previous = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  );
  const previousFetch = globalThis.fetch;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-publishable-key";
  let query;
  let apiKey;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (!url.includes("/rest/v1/claim_submissions")) {
      throw new Error(`Unexpected request: ${url}`);
    }
    query = new URL(url).searchParams;
    apiKey = new Headers(init.headers).get("apikey");
    return jsonResponse([]);
  };

  try {
    const response = await GET(
      new Request("http://localhost/api/radar?topic=Science"),
    );
    assert.equal(response.status, 200);
    assert.equal(query.get("status"), "eq.published");
    assert.equal(query.get("topic"), "eq.Science");
    assert.equal(apiKey, "test-publishable-key");
  } finally {
    globalThis.fetch = previousFetch;
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("Supabase public config uses the publishable key", () => {
  const names = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
  const previous = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  );
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-publishable-key";

  try {
    assert.deepEqual(getSupabasePublicConfig(), {
      url: "https://test.supabase.co",
      publishableKey: "test-publishable-key",
    });
  } finally {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});
