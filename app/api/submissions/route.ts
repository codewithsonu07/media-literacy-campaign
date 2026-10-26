import { CLAIM_TOPICS, type ClaimTopic } from "../../lib/radar-types.ts";
import {
  checkJsonRequest,
  checkSameOrigin,
  enforceBurstLimit,
  readJsonBody,
  verifyTurnstile,
} from "../../lib/server-security.ts";
import { createServiceSupabaseClient } from "../../lib/supabase/server.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePublicUrl(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > 2_048) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const originError = checkSameOrigin(request);
  if (originError) return originError;
  const contentTypeError = checkJsonRequest(request);
  if (contentTypeError) return contentTypeError;
  const body = await readJsonBody(request, 8_192);
  if (body.error) return body.error;

  if (!isRecord(body.value)) {
    return Response.json({ error: "Send a valid claim report." }, { status: 400 });
  }
  const { claim, topic, turnstileToken } = body.value;
  const sourceUrl = parsePublicUrl(body.value.sourceUrl);
  if (
    typeof claim !== "string" ||
    claim.trim().length < 10 ||
    claim.trim().length > 500 ||
    typeof topic !== "string" ||
    !CLAIM_TOPICS.includes(topic as ClaimTopic) ||
    sourceUrl === undefined
  ) {
    return Response.json(
      {
        error:
          "Add a claim between 10 and 500 characters, choose a topic, and use a valid HTTPS source link if provided.",
      },
      { status: 400 },
    );
  }

  const burstError = await enforceBurstLimit(request, "submission");
  if (burstError) return burstError;
  const challengeError = await verifyTurnstile(
    turnstileToken,
    request,
    "submission",
  );
  if (challengeError) return challengeError;

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("claim_submissions")
      .insert({
        claim: claim.trim(),
        source_url: sourceUrl,
        topic: topic as ClaimTopic,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Could not save claim submission:", error?.code);
      return Response.json(
        { error: "Your report could not be saved. Please try again." },
        { status: 503 },
      );
    }

    return Response.json(
      {
        id: data.id,
        message: "Your report is private and will be reviewed before publication.",
      },
      { status: 201 },
      );
  } catch (error) {
    console.error(
      "Claim submission configuration failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return Response.json(
      { error: "Claim submissions are not configured yet." },
      { status: 503 },
    );
  }
}
