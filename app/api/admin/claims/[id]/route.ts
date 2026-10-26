import { requireModerator } from "../../../../lib/admin-auth.ts";
import type { ClaimSource } from "../../../../lib/radar-types";
import {
  checkJsonRequest,
  checkSameOrigin,
  readJsonBody,
} from "../../../../lib/server-security.ts";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseSources(value: unknown): ClaimSource[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 8) {
    return null;
  }
  const sources: ClaimSource[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.url !== "string") return null;
    if (
      typeof item.summary !== "string" ||
      item.summary.trim().length > 500
    ) {
      return null;
    }
    try {
      const url = new URL(item.url);
      if (url.protocol !== "https:" || url.username || url.password) return null;
      sources.push({
        url: url.toString(),
        summary: item.summary.trim(),
      });
    } catch {
      return null;
    }
  }
  return sources;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const originError = checkSameOrigin(request);
  if (originError) return originError;
  const contentTypeError = checkJsonRequest(request);
  if (contentTypeError) return contentTypeError;
  const body = await readJsonBody(request, 12_288);
  if (body.error) return body.error;
  const { id } = await context.params;
  if (!UUID_PATTERN.test(id) || !isRecord(body.value)) {
    return Response.json({ error: "Invalid moderation request." }, { status: 400 });
  }

  const access = await requireModerator();
  if (access.response) return access.response;
  if (body.value.status === "rejected") {
    const { data, error } = await access.client
      .from("claim_submissions")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("Could not reject claim:", error.code);
      return Response.json(
        { error: "The claim could not be rejected." },
        { status: 503 },
      );
    }
    if (!data) {
      return Response.json(
        { error: "This pending claim was not found." },
        { status: 404 },
      );
    }
    return Response.json({ status: "rejected" });
  }

  if (body.value.status === "merged") {
    const mergedInto = body.value.mergedInto;
    if (
      typeof mergedInto !== "string" ||
      !UUID_PATTERN.test(mergedInto) ||
      mergedInto === id
    ) {
      return Response.json(
        { error: "Choose another pending claim to merge into." },
        { status: 400 },
      );
    }
    const { data: target, error: targetError } = await access.client
      .from("claim_submissions")
      .select("id")
      .eq("id", mergedInto)
      .eq("status", "pending")
      .maybeSingle();
    if (targetError) {
      console.error("Could not load merge target:", targetError.code);
      return Response.json(
        { error: "The duplicate could not be merged." },
        { status: 503 },
      );
    }
    if (!target) {
      return Response.json(
        { error: "The selected merge target is not pending review." },
        { status: 404 },
      );
    }
    const { data, error } = await access.client
      .from("claim_submissions")
      .update({
        status: "merged",
        merged_into: mergedInto,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("Could not merge duplicate claim:", error.code);
      return Response.json(
        { error: "The duplicate could not be merged." },
        { status: 503 },
      );
    }
    if (!data) {
      return Response.json(
        { error: "This pending claim was not found." },
        { status: 404 },
      );
    }
    return Response.json({ status: "merged", mergedInto });
  }

  const { cardTitle, evidenceSummary, biasNotes, siftPrompt } = body.value;
  const sources = parseSources(body.value.sources);
  if (
    body.value.status !== "published" ||
    typeof cardTitle !== "string" ||
    cardTitle.trim().length < 5 ||
    cardTitle.trim().length > 140 ||
    typeof evidenceSummary !== "string" ||
    !evidenceSummary.trim() ||
    evidenceSummary.trim().length > 2_500 ||
    typeof biasNotes !== "string" ||
    !biasNotes.trim() ||
    biasNotes.trim().length > 2_000 ||
    typeof siftPrompt !== "string" ||
    siftPrompt.trim().length < 5 ||
    siftPrompt.trim().length > 500 ||
    !sources
  ) {
    return Response.json(
      { error: "Complete the learning card with valid text and HTTPS sources." },
      { status: 400 },
    );
  }

  const { data, error } = await access.client
    .from("claim_submissions")
    .update({
      status: "published",
      card_title: cardTitle.trim(),
      evidence_summary: evidenceSummary.trim(),
      bias_notes: biasNotes.trim(),
      sift_prompt: siftPrompt.trim(),
      sources,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Could not publish claim card:", error.code);
    return Response.json(
      { error: "The claim card could not be published." },
      { status: 503 },
    );
  }
  if (!data) {
    return Response.json(
      { error: "This pending claim was not found." },
      { status: 404 },
    );
  }
  return Response.json({ status: "published" });
}

export async function DELETE(request: Request, context: RouteContext) {
  const originError = checkSameOrigin(request);
  if (originError) return originError;
  const { id } = await context.params;
  if (!UUID_PATTERN.test(id)) {
    return Response.json({ error: "Invalid claim ID." }, { status: 400 });
  }

  const access = await requireModerator();
  if (access.response) return access.response;
  const { data, error } = await access.client
    .from("claim_submissions")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Could not delete claim:", error.code);
    return Response.json(
      { error: "The claim could not be deleted." },
      { status: 503 },
    );
  }
  if (!data) {
    return Response.json({ error: "Claim not found." }, { status: 404 });
  }
  return Response.json({ deleted: true });
}
