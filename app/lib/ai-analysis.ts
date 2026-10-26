import type {
  EvidenceDisposition,
  EvidencePosition,
  EvidenceSource,
  EvidenceStrength,
} from "./claim-evidence";

export type AIVerdict =
  | "Likely true"
  | "Misleading"
  | "Likely false"
  | "Unverified";

export interface AIAnalysis {
  provider: "Gemini" | "Groq" | "OpenAI";
  claim: string;
  verdict: AIVerdict;
  evidenceStrength: EvidenceStrength;
  evidenceSufficient: boolean;
  searchCompleted: boolean;
  assessment: string;
  wordingBias: string;
  missingContext: string;
  sources: EvidenceSource[];
}

export interface SourceAssessment {
  url: string;
  summary: string;
  position: EvidencePosition;
}

export interface ModelAnalysis {
  claim: string;
  verdict: AIVerdict;
  disposition: EvidenceDisposition;
  assessment: string;
  wordingBias: string;
  missingContext: string;
  sourceAssessments: SourceAssessment[];
}

export type ResearchStage =
  | "searching"
  | "reviewing"
  | "comparing"
  | "preparing"
  | "complete";

export type AIAnalysisEvent =
  | { type: "progress"; stage: ResearchStage; message: string }
  | { type: "sources"; sources: EvidenceSource[] }
  | { type: "result"; analysis: AIAnalysis }
  | { type: "error"; error: string };
