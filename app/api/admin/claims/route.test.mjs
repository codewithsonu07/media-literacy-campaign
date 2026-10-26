import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "./route.ts";
import { PATCH } from "./[id]/route.ts";

test("does not expose the moderation queue without moderator configuration", async () => {
  const previousEmails = process.env.MODERATOR_EMAILS;
  delete process.env.MODERATOR_EMAILS;
  try {
    const response = await GET();
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /not configured/i);
  } finally {
    if (previousEmails === undefined) delete process.env.MODERATOR_EMAILS;
    else process.env.MODERATOR_EMAILS = previousEmails;
  }
});

test("does not allow a moderation update without moderator configuration", async () => {
  const previousEmails = process.env.MODERATOR_EMAILS;
  delete process.env.MODERATOR_EMAILS;
  try {
    const response = await PATCH(
      new Request(
        "http://localhost/api/admin/claims/7c144f47-c131-45b2-b539-2be5a6e73946",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "rejected" }),
        },
      ),
      {
        params: Promise.resolve({
          id: "7c144f47-c131-45b2-b539-2be5a6e73946",
        }),
      },
    );
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /not configured/i);
  } finally {
    if (previousEmails === undefined) delete process.env.MODERATOR_EMAILS;
    else process.env.MODERATOR_EMAILS = previousEmails;
  }
});

test("rejects cross-origin moderator updates", async () => {
  const response = await PATCH(
    new Request(
      "http://localhost/api/admin/claims/7c144f47-c131-45b2-b539-2be5a6e73946",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://attacker.example",
        },
        body: JSON.stringify({ status: "rejected" }),
      },
    ),
    {
      params: Promise.resolve({
        id: "7c144f47-c131-45b2-b539-2be5a6e73946",
      }),
    },
  );
  assert.equal(response.status, 403);
});
