import { getDomain } from "tldts";

export type EvidencePosition = "Supports" | "Disputes" | "Context" | "Unclear";
export type EvidenceStrength = "Limited" | "Moderate" | "Strong";
export type EvidenceDisposition =
  | "corroborated"
  | "contradicted"
  | "mixed"
  | "insufficient";
export type ClaimVerdict =
  | "Likely true"
  | "Misleading"
  | "Likely false"
  | "Unverified";

export interface EvidenceSource {
  title: string;
  url: string;
  publisher: string;
  publishedDate: string | null;
  snippet: string;
  relevanceScore: number;
  summary: string;
  evidencePosition: EvidencePosition;
}

export interface SourceAssessment {
  url: string;
  summary: string;
  position: EvidencePosition;
}

export interface EvidenceDecision {
  evidenceStrength: EvidenceStrength;
  evidenceSufficient: boolean;
  verdict: ClaimVerdict;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeSearchResults(payload: unknown): EvidenceSource[] {
  if (!isRecord(payload) || !Array.isArray(payload.results)) return [];

  const seen = new Set<string>();
  const sources: EvidenceSource[] = [];
  for (const result of payload.results) {
    if (!isRecord(result)) continue;
    if (typeof result.title !== "string" || typeof result.url !== "string") {
      continue;
    }
    if (typeof result.content !== "string" || !result.content.trim()) continue;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(result.url);
    } catch {
      continue;
    }
    if (parsedUrl.protocol !== "https:") continue;

    parsedUrl.hash = "";
    const canonicalUrl = parsedUrl.toString();
    const publisher =
      getDomain(parsedUrl.hostname, { allowPrivateDomains: true }) ??
      parsedUrl.hostname.toLowerCase();
    const dedupeKey = `${publisher}${parsedUrl.pathname.replace(/\/$/, "")}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const score =
      typeof result.score === "number" && Number.isFinite(result.score)
        ? Math.max(0, Math.min(1, result.score))
        : 0;
    const publishedDate =
      typeof result.published_date === "string"
        ? result.published_date.slice(0, 100)
        : null;

    sources.push({
      title: result.title.trim().slice(0, 240),
      url: canonicalUrl,
      publisher,
      publishedDate,
      snippet: result.content.trim().slice(0, 900),
      relevanceScore: score,
      summary: "",
      evidencePosition: "Unclear",
    });
    if (sources.length === 8) break;
  }

  return sources;
}

export function applySourceAssessments(
  sources: EvidenceSource[],
  assessments: SourceAssessment[],
): EvidenceSource[] {
  const knownUrls = new Set(sources.map((source) => source.url));
  const byUrl = new Map<string, SourceAssessment>();
  for (const assessment of assessments) {
    if (
      knownUrls.has(assessment.url) &&
      assessment.summary.trim() &&
      ["Supports", "Disputes", "Context", "Unclear"].includes(
        assessment.position,
      )
    ) {
      byUrl.set(assessment.url, assessment);
    }
  }

  return sources.map((source) => {
    const assessment = byUrl.get(source.url);
    return assessment
      ? {
          ...source,
          summary: assessment.summary.trim().slice(0, 600),
          evidencePosition: assessment.position,
        }
      : source;
  });
}

export function decideEvidence(
  sources: EvidenceSource[],
  disposition: EvidenceDisposition,
  proposedVerdict: ClaimVerdict,
): EvidenceDecision {
  const assessedSources = sources.filter(
    (source) =>
      source.evidencePosition !== "Unclear" && source.relevanceScore >= 0.4,
  );
  const independentPublishers = new Set(
    assessedSources.map((source) => source.publisher.toLowerCase()),
  ).size;
  const topSources = assessedSources.filter(
    (source) => source.relevanceScore >= 0.65,
  ).length;

  let evidenceStrength: EvidenceStrength = "Limited";
  if (
    assessedSources.length >= 3 &&
    independentPublishers >= 3 &&
    topSources >= 2
  ) {
    evidenceStrength = "Strong";
  } else if (assessedSources.length >= 2 && independentPublishers >= 2) {
    evidenceStrength = "Moderate";
  }

  const expectedPosition =
    disposition === "corroborated"
      ? "Supports"
      : disposition === "contradicted"
        ? "Disputes"
        : null;
  const alignedPublishers = new Set(
    assessedSources
      .filter((source) => source.evidencePosition === expectedPosition)
      .map((source) => source.publisher.toLowerCase()),
  ).size;
  const evidenceSufficient =
    expectedPosition !== null &&
    alignedPublishers >= 2 &&
    evidenceStrength !== "Limited";
  return {
    evidenceStrength,
    evidenceSufficient,
    verdict: evidenceSufficient ? proposedVerdict : "Unverified",
  };
}
