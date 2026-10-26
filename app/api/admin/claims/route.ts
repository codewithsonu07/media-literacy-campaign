import { requireModerator } from "../../../lib/admin-auth.ts";

export async function GET() {
  const access = await requireModerator();
  if (access.response) return access.response;

  const { data, error } = await access.client
    .from("claim_submissions")
    .select(
      "id, claim, source_url, topic, status, merged_into, card_title, evidence_summary, bias_notes, sources, sift_prompt, submitted_at, reviewed_at",
    )
    .eq("status", "pending")
    .order("submitted_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Could not load pending claims:", error.code);
    return Response.json(
      { error: "The moderation queue is temporarily unavailable." },
      { status: 503 },
    );
  }
  return Response.json(data);
}
