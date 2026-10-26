export const CLAIM_TOPICS = [
  "Politics",
  "Health",
  "Science",
  "Technology",
  "Community",
  "Other",
] as const;

export type ClaimTopic = (typeof CLAIM_TOPICS)[number];
export type SubmissionStatus =
  | "pending"
  | "published"
  | "rejected"
  | "merged";

export interface ClaimSource {
  url: string;
  summary: string;
}

export interface ClaimSubmission {
  id: string;
  claim: string;
  source_url: string | null;
  topic: ClaimTopic;
  status: SubmissionStatus;
  merged_into: string | null;
  card_title: string | null;
  evidence_summary: string | null;
  bias_notes: string | null;
  sources: ClaimSource[];
  sift_prompt: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface PublicClaimCard {
  id: string;
  claim: string;
  source_url: string | null;
  topic: ClaimTopic;
  card_title: string;
  evidence_summary: string;
  bias_notes: string;
  sources: ClaimSource[];
  sift_prompt: string;
  submitted_at: string;
  reviewed_at: string;
}
