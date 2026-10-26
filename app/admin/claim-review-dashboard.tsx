"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import type { AIAnalysis, AIAnalysisEvent } from "../lib/ai-analysis";
import TurnstileWidget from "../lib/turnstile-widget";
import { CLAIM_TOPICS } from "../lib/radar-types";
import type { ClaimSubmission, ClaimSource } from "../lib/radar-types";

interface ClaimReviewDashboardProps {
  siteKey: string;
}

interface ClaimEditorProps {
  claim: ClaimSubmission;
  otherClaims: ClaimSubmission[];
  siteKey: string;
  onDone: () => void;
}

function getErrorMessage(value: unknown, fallback: string): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }
  return fallback;
}

function isClaimSubmission(value: unknown): value is ClaimSubmission {
  if (typeof value !== "object" || value === null) return false;
  const claim = value as Record<string, unknown>;
  return (
    typeof claim.id === "string" &&
    typeof claim.claim === "string" &&
    typeof claim.topic === "string" &&
    CLAIM_TOPICS.includes(claim.topic as (typeof CLAIM_TOPICS)[number]) &&
    claim.status === "pending" &&
    (typeof claim.source_url === "string" || claim.source_url === null) &&
    (typeof claim.merged_into === "string" || claim.merged_into === null) &&
    typeof claim.submitted_at === "string"
  );
}

function ClaimEditor({ claim, otherClaims, siteKey, onDone }: ClaimEditorProps) {
  const [cardTitle, setCardTitle] = useState(claim.claim.slice(0, 140));
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [biasNotes, setBiasNotes] = useState("");
  const [siftPrompt, setSiftPrompt] = useState(
    "What original source would help you verify this claim?",
  );
  const [sourceLines, setSourceLines] = useState(
    claim.source_url ?? "",
  );
  const [researchToken, setResearchToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const [mergeTarget, setMergeTarget] = useState("");
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function researchClaim() {
    setError("");
    setAnalysis(null);
    setIsResearching(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: claim.claim,
          turnstileToken: researchToken,
        }),
      });
      if (!response.ok) {
        const payload: unknown = await response.json();
        throw new Error(
          getErrorMessage(payload, "AI research could not be completed."),
        );
      }
      if (!response.body) throw new Error("The research stream did not start.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const result: { analysis?: AIAnalysis } = {};
      let streamError = "";

      const consumeFrame = (frame: string) => {
        const dataLine = frame
          .split("\n")
          .find((line) => line.startsWith("data:"));
        if (!dataLine) return;
        const event = JSON.parse(dataLine.slice(5).trim()) as AIAnalysisEvent;
        if (event.type === "result") result.analysis = event.analysis;
        if (event.type === "error") streamError = event.error;
      };

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() || "";
        frames.forEach(consumeFrame);
        if (done) break;
      }
      if (buffer.trim()) consumeFrame(buffer);
      if (streamError) throw new Error(streamError);
      if (!result.analysis) {
        throw new Error("AI research returned no assessment.");
      }

      setAnalysis(result.analysis);
      setEvidenceSummary(
        `${result.analysis.assessment}\n\n${result.analysis.missingContext}`.trim(),
      );
      setBiasNotes(result.analysis.wordingBias);
      setSourceLines(
        result.analysis.sources
          .map(
            (source) =>
              `${source.url} | ${source.summary.replace(/\s+/g, " ").slice(0, 500)}`,
          )
          .join("\n"),
      );
    } catch (researchError) {
      setError(
        researchError instanceof Error
          ? researchError.message
          : "AI research could not be completed.",
      );
    } finally {
      setIsResearching(false);
      setResearchToken("");
      setChallengeKey((key) => key + 1);
    }
  }

  async function updateClaim(
    action: "publish" | "reject" | "delete" | "merge",
  ) {
    if (
      action === "delete" &&
      !window.confirm("Permanently delete this student report?")
    ) {
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      const response =
        action === "delete"
          ? await fetch(`/api/admin/claims/${claim.id}`, { method: "DELETE" })
          : await fetch(`/api/admin/claims/${claim.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body:
                action === "reject"
                  ? JSON.stringify({ status: "rejected" })
                  : action === "merge"
                    ? JSON.stringify({
                        status: "merged",
                        mergedInto: mergeTarget,
                      })
                  : JSON.stringify({
                      status: "published",
                      cardTitle,
                      evidenceSummary,
                      biasNotes,
                      siftPrompt,
                      sources: parseSourceLines(sourceLines),
                    }),
            });
      const payload: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          getErrorMessage(payload, "The moderation action failed."),
        );
      }
      onDone();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The moderation action failed.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="space-y-5 rounded-sift-card border border-sift-rule bg-sift-paper-2 p-5 sm:p-7">
      <div>
        <span className="rounded-sift-pill bg-sift-accent-soft px-3 py-1 text-xs font-semibold text-sift-accent-soft-ink">
          {claim.topic}
        </span>
        <h2 className="mt-3 font-sift-display text-xl font-semibold text-sift-ink">
          Student report
        </h2>
        <blockquote className="mt-2 border-l-2 border-sift-coral pl-4 text-sm leading-6 text-sift-ink-2">
          {claim.claim}
        </blockquote>
        {claim.source_url && (
          <a
            className="mt-2 inline-block text-sm font-semibold text-sift-accent underline"
            href={claim.source_url}
            rel="noreferrer"
            target="_blank"
          >
            Open submitted source
          </a>
        )}
      </div>

      <div className="rounded-sift-input border border-sift-rule bg-sift-paper px-4 py-4">
        <h3 className="text-sm font-semibold text-sift-ink">
          Curator-triggered AI research
        </h3>
        <p className="mt-1 text-xs leading-5 text-sift-muted">
          This only searches when you choose it. Review every source and rewrite
          conclusions before publishing; AI output is not an authoritative fact
          check.
        </p>
        {siteKey && (
          <div className="mt-3">
            <TurnstileWidget
              key={challengeKey}
              action="analysis"
              onError={setError}
              onToken={setResearchToken}
              siteKey={siteKey}
            />
          </div>
        )}
        <button
          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-sift-input border border-sift-rule px-3 text-sm font-semibold text-sift-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
          disabled={isResearching || Boolean(siteKey && !researchToken)}
          onClick={() => void researchClaim()}
          type="button"
        >
          {isResearching ? "Researching..." : "Research this claim"}
        </button>
        {analysis && (
          <div className="mt-4 space-y-2 border-t border-sift-rule pt-3 text-sm leading-6">
            <p>
              <strong>AI assessment (not a verdict):</strong>{" "}
              {analysis.assessment}
            </p>
            <p>
              <strong>Evidence strength:</strong> {analysis.evidenceStrength}
            </p>
            <ul className="list-inside list-disc space-y-1">
              {analysis.sources.map((source) => (
                <li key={source.url}>
                  <a
                    className="font-semibold text-sift-accent underline"
                    href={source.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {new URL(source.url).hostname}
                  </a>{" "}
                  — {source.summary}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sift-ink">
          Edit the learning card before it goes public
        </h3>
        <EditorField
          id="card-title"
          label="Card title"
          maxLength={140}
          onChange={setCardTitle}
          required
          value={cardTitle}
        />
        <EditorField
          id="evidence-summary"
          label="Evidence explanation"
          maxLength={2500}
          onChange={setEvidenceSummary}
          required
          textarea
          value={evidenceSummary}
        />
        <EditorField
          id="bias-notes"
          label="Media framing / bias observations"
          maxLength={2000}
          onChange={setBiasNotes}
          required
          textarea
          value={biasNotes}
        />
        <EditorField
          id="source-lines"
          label="HTTPS sources — one per line, optional note after |"
          maxLength={4096}
          onChange={setSourceLines}
          required
          textarea
          value={sourceLines}
        />
        <EditorField
          id="sift-prompt"
          label="SIFT question for students"
          maxLength={500}
          onChange={setSiftPrompt}
          required
          textarea
          value={siftPrompt}
        />
      </div>

      {error && (
        <p className="rounded-sift-input border border-sift-coral px-3 py-2 text-sm text-sift-ink" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-sift-rule pt-4">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-sift-input bg-sift-accent px-4 text-sm font-semibold text-sift-accent-ink disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
          disabled={isSaving || !sourceLines.trim()}
          onClick={() => void updateClaim("publish")}
          type="button"
        >
          {isSaving ? "Saving..." : "Publish reviewed card"}
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-sift-input border border-sift-rule px-4 text-sm font-semibold text-sift-ink disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
          disabled={isSaving}
          onClick={() => void updateClaim("reject")}
          type="button"
        >
          Reject
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-sift-input border border-sift-coral px-4 text-sm font-semibold text-sift-ink disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-coral"
          disabled={isSaving}
          onClick={() => void updateClaim("delete")}
          type="button"
        >
          Delete permanently
        </button>
      </div>
      {otherClaims.length > 0 && (
        <div className="space-y-2 border-t border-sift-rule pt-4">
          <label
            className="block text-sm font-semibold text-sift-ink"
            htmlFor="merge-target"
          >
            If this repeats another report, merge it into:
          </label>
          <select
            className="min-h-11 w-full rounded-sift-input border border-sift-rule bg-sift-paper px-3 text-sm text-sift-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
            id="merge-target"
            onChange={(event) => setMergeTarget(event.target.value)}
            value={mergeTarget}
          >
            <option value="">Choose another pending report</option>
            {otherClaims.map((otherClaim) => (
              <option key={otherClaim.id} value={otherClaim.id}>
                {otherClaim.claim.slice(0, 100)}
              </option>
            ))}
          </select>
          <button
            className="inline-flex min-h-10 items-center rounded-sift-input border border-sift-rule px-3 text-sm font-semibold text-sift-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
            disabled={isSaving || !mergeTarget}
            onClick={() => void updateClaim("merge")}
            type="button"
          >
            Merge duplicate into selected report
          </button>
        </div>
      )}
    </article>
  );
}

function parseSourceLines(value: string): ClaimSource[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url = "", ...note] = line.split("|");
      return { url: url.trim(), summary: note.join("|").trim() };
    });
}

interface EditorFieldProps {
  id: string;
  label: string;
  maxLength: number;
  onChange: (value: string) => void;
  required?: boolean;
  textarea?: boolean;
  value: string;
}

function EditorField({
  id,
  label,
  maxLength,
  onChange,
  required = false,
  textarea = false,
  value,
}: EditorFieldProps) {
  const className =
    "mt-1 w-full rounded-sift-input border border-sift-rule bg-sift-paper px-3 py-2 text-sm leading-6 text-sift-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent";
  return (
    <div>
      <label className="block text-xs font-semibold text-sift-ink" htmlFor={id}>
        {label}
      </label>
      {textarea ? (
        <textarea
          className={className}
          id={id}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          rows={3}
          value={value}
        />
      ) : (
        <input
          className={className}
          id={id}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          value={value}
        />
      )}
    </div>
  );
}

export default function ClaimReviewDashboard({
  siteKey,
}: ClaimReviewDashboardProps) {
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadClaims = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/claims");
      const payload: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          getErrorMessage(payload, "The review queue could not be loaded."),
        );
      }
      if (!Array.isArray(payload) || !payload.every(isClaimSubmission)) {
        throw new Error("The review queue returned an invalid response.");
      }
      setClaims(payload);
      setSelectedId((current) =>
        current && payload.some((claim) => claim.id === current)
          ? current
          : null,
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "The review queue could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(loadClaims);
  }, [loadClaims]);

  async function signOut() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publicKey) {
      setError("Moderator sign-out is not configured.");
      return;
    }
    const supabase = createBrowserClient(url, publicKey);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError("Could not sign out. Please try again.");
      return;
    }
    router.replace("/admin/login");
    router.refresh();
  }

  const selectedClaim = claims.find((claim) => claim.id === selectedId);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-sift-rule pb-4">
        <div>
          <p className="text-sm text-sift-muted">Private editor workspace</p>
          <h1 className="mt-1 font-sift-display text-2xl font-semibold text-sift-ink">
            Claim review queue
          </h1>
        </div>
        <button
          className="inline-flex min-h-10 items-center rounded-sift-input border border-sift-rule px-3 text-sm font-semibold text-sift-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
          onClick={() => void signOut()}
          type="button"
        >
          Sign out
        </button>
      </header>

      {error && (
        <p className="rounded-sift-input border border-sift-coral px-4 py-3 text-sm text-sift-ink" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.5fr)]">
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sift-ink">
              Pending reports ({claims.length})
            </h2>
            <button
              className="text-sm font-semibold text-sift-accent underline"
              onClick={() => void loadClaims()}
              type="button"
            >
              Refresh
            </button>
          </div>
          {isLoading ? (
            <p className="text-sm text-sift-muted" role="status">
              Loading private reports...
            </p>
          ) : claims.length === 0 ? (
            <p className="rounded-sift-input border border-sift-rule bg-sift-paper-2 p-4 text-sm leading-6 text-sift-muted">
              There are no pending reports.
            </p>
          ) : (
            <ul className="space-y-2">
              {claims.map((claim) => (
                <li key={claim.id}>
                  <button
                    aria-pressed={selectedId === claim.id}
                    className={`w-full rounded-sift-input border p-3 text-left text-sm leading-5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent ${
                      selectedId === claim.id
                        ? "border-sift-accent bg-sift-accent-soft"
                        : "border-sift-rule bg-sift-paper-2"
                    }`}
                    onClick={() => setSelectedId(claim.id)}
                    type="button"
                  >
                    <span className="text-xs font-semibold text-sift-accent">
                      {claim.topic}
                    </span>
                    <span className="mt-1 block font-medium text-sift-ink">
                      {claim.claim}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div>
          {selectedClaim ? (
            <ClaimEditor
              key={selectedClaim.id}
              claim={selectedClaim}
              otherClaims={claims.filter(
                (claim) => claim.id !== selectedClaim.id,
              )}
              onDone={() => {
                setSelectedId(null);
                void loadClaims();
              }}
              siteKey={siteKey}
            />
          ) : (
            <div className="grid min-h-64 place-items-center rounded-sift-card border border-dashed border-sift-rule bg-sift-paper-2 p-6 text-center">
              <p className="max-w-md text-sm leading-6 text-sift-muted">
                Choose a report to inspect it, optionally run AI-assisted
                research, then publish a source-backed learning card or reject
                the report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
