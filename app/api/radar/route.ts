import { createPublicSupabaseClient } from "../../lib/supabase/server.ts";
import { CLAIM_TOPICS, type ClaimTopic } from "../../lib/radar-types.ts";

export async function GET(request: Request) {
  const topic = new URL(request.url).searchParams.get("topic");
  if (topic && !CLAIM_TOPICS.includes(topic as ClaimTopic)) {
    return Response.json({ error: "Choose a valid Radar topic." }, { status: 400 });
  }

  try {
    const supabase = createPublicSupabaseClient();
    let query = supabase
      .from("claim_submissions")
      .select(
        "id, claim, source_url, topic, card_title, evidence_summary, bias_notes, sources, sift_prompt, submitted_at, reviewed_at",
      )
      .eq("status", "published")
      .order("submitted_at", { ascending: false })
      .limit(50);
    if (topic) query = query.eq("topic", topic as ClaimTopic);
    const { data, error } = await query;

    if (error) {
      console.error("Could not load published claims:", error.code);
      return Response.json(
        { error: "The Claim Radar is temporarily unavailable." },
        { status: 503 },
      );
    }
    return Response.json(data);
  } catch (error) {
    console.error(
      "Claim Radar configuration failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return Response.json(
      { error: "The Claim Radar is not configured yet." },
      { status: 503 },
    );
  }
}
