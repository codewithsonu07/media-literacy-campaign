import type {
  ClaimSource,
  ClaimTopic,
  SubmissionStatus,
} from "../radar-types";

export interface Database {
  public: {
    Tables: {
      claim_submissions: {
        Row: {
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
        };
        Insert: {
          id?: string;
          claim: string;
          source_url?: string | null;
          topic: ClaimTopic;
          status?: SubmissionStatus;
          merged_into?: string | null;
          card_title?: string | null;
          evidence_summary?: string | null;
          bias_notes?: string | null;
          sources?: ClaimSource[];
          sift_prompt?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          claim?: string;
          source_url?: string | null;
          topic?: ClaimTopic;
          status?: SubmissionStatus;
          merged_into?: string | null;
          card_title?: string | null;
          evidence_summary?: string | null;
          bias_notes?: string | null;
          sources?: ClaimSource[];
          sift_prompt?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
      api_rate_limits: {
        Row: {
          request_key: string;
          bucket_start: number;
          request_count: number;
          updated_at: string;
        };
        Insert: {
          request_key: string;
          bucket_start: number;
          request_count?: number;
          updated_at?: string;
        };
        Update: {
          request_key?: string;
          bucket_start?: number;
          request_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      consume_api_rate_limit: {
        Args: {
          p_request_key: string;
          p_max_requests: number;
          p_window_seconds: number;
        };
        Returns: {
          allowed: boolean;
          retry_after_seconds: number;
        };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
