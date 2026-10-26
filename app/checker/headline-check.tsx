"use client";

import { useRef, useState } from "react";
import { analyzeHeadline, SAMPLE_HEADLINES } from "../lib/analysis-engine";
import type { AnalysisReport, LinguisticFlag } from "../lib/analysis-engine";
import type {
  AIAnalysis,
  AIAnalysisEvent,
  ResearchStage,
} from "../lib/ai-analysis";
import type { EvidenceSource } from "../lib/claim-evidence";
import FormattedMarkdown, {
  plainTextPreview,
} from "../components/formatted-markdown";
import TurnstileWidget from "../lib/turnstile-widget";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Flame,
  Info,
  Layers,
  Search,
  ShieldAlert,
  Sliders,
  Sparkles,
  Copy,
  Check,
  Zap,
  Target,
  Shield,
  LoaderCircle,
} from "lucide-react";

interface HeadlineCheckProps {
  turnstileSiteKey: string;
}

export default function HeadlineCheck({
  turnstileSiteKey,
}: HeadlineCheckProps) {
  const [draft, setDraft] = useState("");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [activeTab, setActiveTab] = useState<
    "manipulation" | "anatomy" | "psychology" | "reframe" | "verify"
  >("manipulation");
  const [selectedFlag, setSelectedFlag] = useState<LinguisticFlag | null>(null);
  const [copied, setCopied] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [aiError, setAiError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [researchStage, setResearchStage] = useState<ResearchStage | null>(
    null,
  );
  const [stageMessage, setStageMessage] = useState("");
  const [liveSources, setLiveSources] = useState<EvidenceSource[]>([]);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);

  async function handleAnalyze(textToAnalyze?: string) {
    const target = (textToAnalyze !== undefined ? textToAnalyze : draft).trim();
    if (!target) return;
    const res = analyzeHeadline(target);
    setReport(res);
    setSelectedFlag(res.flags[0] || null);
    setActiveTab("manipulation");
    setAiAnalysis(null);
    setAiError("");
    setResearchStage(null);
    setStageMessage("");
    setLiveSources([]);
    if (turnstileSiteKey && !turnstileToken) {
      setAiError("Complete the security check before starting AI research.");
      return;
    }
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: target,
          turnstileToken,
        }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "AI analysis could not be completed.");
      }
      if (!response.body) throw new Error("The research stream did not start.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const consumeFrame = (frame: string) => {
        const dataLine = frame
          .split("\n")
          .find((line) => line.startsWith("data:"));
        if (!dataLine) return;
        const event = JSON.parse(dataLine.slice(5).trim()) as AIAnalysisEvent;
        if (event.type === "progress") {
          setResearchStage(event.stage);
          setStageMessage(event.message);
        } else if (event.type === "sources") {
          setLiveSources(event.sources);
        } else if (event.type === "result") {
          setAiAnalysis(event.analysis);
        } else if (event.type === "error") {
          setAiError(event.error);
        }
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
    } catch (error) {
      if (!controller.signal.aborted) {
        setAiError(
          error instanceof Error
            ? error.message
            : "AI analysis could not be completed.",
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsAnalyzing(false);
        activeRequest.current = null;
        setTurnstileToken("");
        setChallengeKey((key) => key + 1);
      }
    }
  }

  function handleSelectSample(sample: (typeof SAMPLE_HEADLINES)[0]) {
    setDraft(sample.text);
    handleAnalyze(sample.text);
  }

  function handleClear() {
    activeRequest.current?.abort();
    setDraft("");
    setReport(null);
    setSelectedFlag(null);
    setAiAnalysis(null);
    setAiError("");
    setIsAnalyzing(false);
    setResearchStage(null);
    setStageMessage("");
    setLiveSources([]);
    setTurnstileToken("");
    setChallengeKey((key) => key + 1);
  }

  function handleCopyReport() {
    if (!report) return;
    const textToCopy = `[SIFT IT Forensic Intelligence Dossier]
Headline: "${report.rawHeadline}"
Manipulation Wording Signal: ${report.manipulationRisk.overallScore}/100 (${report.manipulationRisk.tier})
Primary Manipulation Tactic: ${report.manipulationRisk.primaryTactic}
Emotional Temperature: ${report.manipulationRisk.emotionalTemperature}
Sensationalism Wording Signal: ${report.sensationalismScore}/100 (${report.sensationalismLevel})
Source Attribution: ${report.attribution.status}
Note: Local wording signals do not determine factual accuracy.
Objective Reframe: "${report.neutralReframe}"
Linguistic Flags Detected: ${report.flags.map((f) => `"${f.term}" (${f.category})`).join(", ") || "None"}
Verified with SIFT IT Forensic Engine`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 text-sift-ink sm:space-y-7">
      <div className="flex flex-col gap-4 border-b border-sift-rule pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-sift-muted">
            Forensic linguistic intelligence
          </p>
          <h2 className="mt-2 font-sift-display text-balance text-sift-title font-semibold tracking-tight text-sift-ink sm:text-3xl">
            Headline &amp; Claim Analyzer
          </h2>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sift-rule bg-sift-paper px-3 py-2 text-xs font-semibold text-sift-ink-2">
          <Sparkles className="shrink-0 text-sift-accent" size={13} /> Manipulation Risk
          Engine
        </span>
      </div>

      <p className="max-w-4xl text-sm leading-6 text-sift-ink-2 sm:text-base sm:leading-7">
        Enter any breaking headline, viral forward, or article title. Our
        linguistic engine evaluates <strong>Manipulation Risk</strong> across 5
        vectors, identifies psychological vulnerabilities targeted, and produces
        an objective neutral reframe.
      </p>

      {/* Preset Samples */}
      <div className="space-y-3">
        <span className="block text-sm font-semibold text-sift-ink">
          Try a real-world case study:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_HEADLINES.map((sample) => (
            <button
              key={sample.category}
              aria-label={`${sample.badge}, ${sample.category}`}
              onClick={() => handleSelectSample(sample)}
              type="button"
              className={`inline-flex min-h-11 items-center gap-2 rounded-sift-input border px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 ${
                draft === sample.text
                  ? "border-sift-accent bg-sift-accent text-sift-accent-ink"
                  : "border-sift-rule bg-sift-paper-2 text-sift-ink-2 hover:border-sift-accent"
              }`}
            >
              <span className="text-xs font-medium opacity-80">
                {sample.badge}
              </span>
              <span className="font-semibold">
                {sample.category === "Health Misinformation"
                  ? "Health"
                  : sample.category === "Financial Panic"
                    ? "Finance"
                    : sample.category === "Political Hyperbole"
                      ? "Politics"
                      : sample.category === "Science Journalism"
                        ? "Science"
                        : sample.category === "Civic Announcement"
                          ? "Civic"
                          : "AI"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-sift-ink"
          htmlFor="headline-text"
        >
          Headline to Inspect:
        </label>
        <textarea
          className="min-h-36 w-full resize-y rounded-sift-input border border-sift-muted bg-sift-paper-2 px-sift-md py-sift-sm text-sift-body leading-7 text-sift-ink placeholder:text-sift-muted focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 sm:min-h-40"
          id="headline-text"
          maxLength={500}
          onChange={(e) => {
            activeRequest.current?.abort();
            setDraft(e.target.value);
            if (report) setReport(null);
            setAiAnalysis(null);
            setAiError("");
            setIsAnalyzing(false);
            setResearchStage(null);
            setStageMessage("");
            setLiveSources([]);
          }}
          placeholder="Paste or type a headline (e.g., 'BREAKING: Secret government order leaks online, minister slams critics...')"
          value={draft}
        />
        <div className="flex flex-col gap-1 text-xs leading-5 text-sift-muted sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <span className="max-w-2xl">
            Scans for psychological hooks, manipulation vectors, and sourcing
            quality.
          </span>
          <span className="shrink-0 font-mono tabular-nums">
            {draft.length} / 500 chars
          </span>
        </div>
      </div>

      {turnstileSiteKey && (
        <TurnstileWidget
          key={challengeKey}
          action="analysis"
          onError={setAiError}
          onToken={setTurnstileToken}
          siteKey={turnstileSiteKey}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex min-h-12 w-full items-center justify-center gap-1 whitespace-nowrap rounded-sift-input bg-sift-accent px-sift-sm py-sift-sm text-center text-sm font-semibold leading-5 text-sift-accent-ink transition-[filter,transform] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none sm:w-auto sm:gap-2 sm:px-sift-md"
          disabled={!draft.trim() || isAnalyzing}
          onClick={() => handleAnalyze()}
          type="button"
        >
          {isAnalyzing ? (
            <LoaderCircle size={14} className="animate-spin motion-reduce:animate-none" />
          ) : (
            <Sparkles size={14} />
          )}
          {isAnalyzing
            ? "Searching sources and analyzing..."
            : "Analyze with AI & Audit Wording"}
        </button>
        <button
          className="min-h-12 w-full rounded-sift-input border border-sift-rule bg-sift-paper-2 px-sift-md py-sift-sm text-sm font-semibold text-sift-ink-2 transition-colors hover:border-sift-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none sm:w-auto"
          disabled={!draft && !report}
          onClick={handleClear}
          type="button"
        >
          Clear Input
        </button>
      </div>

      {/* ANALYSIS DASHBOARD RESULT */}
      <div className="space-y-5" aria-live="polite">
        {isAnalyzing && (
          <ResearchProgress
            stage={researchStage}
            message={stageMessage}
            sources={liveSources}
          />
        )}
        {!report ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-sift-rule bg-sift-paper p-5 sm:flex-row sm:items-start sm:p-6">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sift-paper-3 text-sift-accent"
              aria-hidden="true"
            >
              <Sliders size={20} />
            </span>
            <div>
              <strong className="text-base font-semibold text-sift-ink">
                Your forensic analysis dossier will appear here.
              </strong>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-sift-ink-2">
                Select one of the sample case studies above or paste any news
                headline to inspect its Manipulation Risk Index, cognitive
                vulnerability profile, sensationalism score, and recommended
                lateral fact-checking queries.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Score Matrix */}
            <div className="flex flex-col gap-3 border-b border-sift-rule pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-sift-display text-xl font-semibold text-sift-ink">
                  Wording Signals &amp; Evidence Review
                </h3>
              </div>
              <button
                className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-[var(--radius-input)] border border-sift-rule bg-sift-paper-2 px-4 py-2 text-sm font-semibold text-sift-ink-2 transition-colors hover:border-sift-accent focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none"
                onClick={handleCopyReport}
                type="button"
                title="Copy analysis summary to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-sift-accent" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy report
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div
                className="flex items-start gap-3 rounded-xl border border-sift-rule bg-sift-paper p-4 text-sm leading-6 text-sift-ink-2"
                role="status"
              >
                <Info size={15} className="mt-0.5 shrink-0 text-sift-accent" />
                <span>
                  {aiError} The local wording analysis is still available below.
                </span>
              </div>
            )}

            {aiAnalysis && <AIReviewPanel analysis={aiAnalysis} />}

            {/* Score Grid Cards: 3 High-Impact Cards */}
            <p className="text-xs leading-5 text-sift-muted">
              Local rule-based wording signals only. These scores do not show
              whether a claim is true; use the evidence conclusion below.
            </p>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {/* Card 1: Manipulation Risk Index */}
              <div className="rounded-2xl border border-sift-rule bg-sift-paper-2 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-sift-muted">
                    <span>Manipulation risk index</span>
                  <Zap size={16} className="shrink-0 text-sift-accent" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <strong className="font-sift-display text-4xl font-semibold tabular-nums text-sift-ink">
                    {report.manipulationRisk.overallScore}
                  </strong>
                  <small className="text-sm text-sift-muted">/ 100</small>
                </div>
                <div className="mt-2 inline-flex rounded-full bg-sift-paper-3 px-2.5 py-1 text-xs font-semibold text-sift-ink-2">
                  {report.manipulationRisk.tier}
                </div>
                <ScoreMeter score={report.manipulationRisk.overallScore} label="Manipulation risk score" />
                <p className="mt-3 text-xs leading-5 text-sift-muted">
                  Estimates pressure from emotional, urgent, and loaded wording.
                </p>
              </div>

              {/* Card 2: Sensationalism Meter */}
              <div className="rounded-2xl border border-sift-rule bg-sift-paper-2 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 text-sm font-semibold text-sift-muted">
                  <span>Sensationalism index</span>
                  <Flame size={16} className="shrink-0 text-sift-coral" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <strong className="font-sift-display text-4xl font-semibold tabular-nums text-sift-ink">
                    {report.sensationalismScore}
                  </strong>
                  <small className="text-sm text-sift-muted">/ 100</small>
                </div>
                <div className="mt-2 inline-flex rounded-full bg-sift-paper-3 px-2.5 py-1 text-xs font-semibold text-sift-ink-2">
                  {report.sensationalismLevel}
                </div>
                <ScoreMeter score={report.sensationalismScore} label="Sensationalism score" />
                <p className="mt-3 text-xs leading-5 text-sift-muted">
                  Counts loaded words, urgency cues, capitalization, and
                  punctuation.
                </p>
              </div>

              {/* Card 3: Headline Attribution */}
              <div className="rounded-2xl border border-sift-rule bg-sift-paper-2 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 text-sm font-semibold text-sift-muted">
                  <span>Headline attribution</span>
                  <ShieldAlert size={16} className="shrink-0 text-sift-accent" />
                </div>
                <div className="mt-4 min-h-11 text-lg font-semibold leading-6 text-sift-ink">
                  {report.attribution.identifiedSources.length > 0
                    ? report.attribution.identifiedSources.join(", ")
                    : report.attribution.status === "Vague / Weasel Words"
                      ? "Vague attribution"
                      : report.attribution.status === "Anonymous Sources"
                        ? "Anonymous attribution"
                        : "No source in headline"}
                </div>
                <p className="mt-3 text-xs leading-5 text-sift-muted">
                  Shows names detected in the headline, not the publishers
                  consulted below. Naming a source does not verify a claim.
                </p>
              </div>
            </div>

            {/* Interactive Headline Highlighter */}
            <div className="rounded-2xl border border-sift-rule bg-sift-paper p-4 sm:p-5">
              <h4 className="text-sm font-semibold text-sift-muted">
                Headline anatomy inspection
              </h4>
              <p className="mt-3 break-words text-lg font-medium leading-8 text-sift-ink sm:text-xl sm:leading-9">
                {renderAnnotatedHeadline(
                  report.rawHeadline,
                  report.flags,
                  selectedFlag,
                  setSelectedFlag,
                )}
              </p>
              <div className="mt-4 flex items-start gap-2 border-t border-sift-rule pt-3 text-xs leading-5 text-sift-muted">
                <Info size={13} className="mt-0.5 shrink-0 text-sift-accent" />
                <span>
                  {report.flags.length > 0
                    ? `Click any highlighted word above to inspect its manipulation mechanism (${report.flags.length} linguistic flags detected).`
                    : "No high-risk emotional or clickbait words detected in the headline phrasing."}
                </span>
              </div>
            </div>

            {/* Selected Flag Details Inspector */}
            {selectedFlag && (
              <div className="rounded-2xl border border-sift-rule bg-sift-paper-2 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-sift-display text-lg font-semibold text-sift-ink">
                    “{selectedFlag.term}”
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${severityTone(selectedFlag.severity)}`}
                  >
                    {selectedFlag.category}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-sift-ink-2">
                  {selectedFlag.explanation}
                </p>
              </div>
            )}

            {/* Interactive Analysis Tabs */}
            <div
              className="flex gap-2 overflow-x-auto border-b border-sift-rule pb-2"
              role="tablist"
            >
              <button
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-input)] px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none ${
                  activeTab === "manipulation"
                    ? "bg-sift-accent text-sift-accent-ink"
                    : "text-sift-ink-2 hover:bg-sift-paper-3"
                }`}
                onClick={() => setActiveTab("manipulation")}
                type="button"
                role="tab"
              >
                <Zap size={14} /> Vectors
              </button>
              <button
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-input)] px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none ${
                  activeTab === "anatomy"
                    ? "bg-sift-accent text-sift-accent-ink"
                    : "text-sift-ink-2 hover:bg-sift-paper-3"
                }`}
                onClick={() => setActiveTab("anatomy")}
                type="button"
                role="tab"
              >
                <Layers size={14} /> Language flags ({report.flags.length})
              </button>
              <button
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-input)] px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none ${
                  activeTab === "psychology"
                    ? "bg-sift-accent text-sift-accent-ink"
                    : "text-sift-ink-2 hover:bg-sift-paper-3"
                }`}
                onClick={() => setActiveTab("psychology")}
                type="button"
                role="tab"
              >
                <Flame size={14} /> Triggers
              </button>
              <button
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-input)] px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none ${
                  activeTab === "reframe"
                    ? "bg-sift-accent text-sift-accent-ink"
                    : "text-sift-ink-2 hover:bg-sift-paper-3"
                }`}
                onClick={() => setActiveTab("reframe")}
                type="button"
                role="tab"
              >
                <CheckCircle2 size={14} /> Neutral reframe
              </button>
              <button
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-input)] px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none ${
                  activeTab === "verify"
                    ? "bg-sift-accent text-sift-accent-ink"
                    : "text-sift-ink-2 hover:bg-sift-paper-3"
                }`}
                onClick={() => setActiveTab("verify")}
                type="button"
                role="tab"
              >
                <Search size={14} /> Fact-check plan
              </button>
            </div>

            <div className="pt-5">
              {/* TAB 1: MANIPULATION VECTORS (NEW) */}
              {activeTab === "manipulation" && (
                <div className="space-y-5">
                  <div className="max-w-3xl">
                    <h4 className="font-sift-display text-lg font-semibold text-sift-ink">
                      Multi-Vector Manipulation Diagnosis
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-sift-ink-2">
                      Disinformation does not rely on random exaggeration. It
                      systematically targets 5 psychological vulnerability
                      channels to hijack attention and bypass critical
                      skepticism.
                    </p>
                  </div>

                  {/* Primary Manipulation Strategy Card */}
                  <div className="rounded-2xl border border-sift-rule bg-sift-paper p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <Target size={18} className="mt-0.5 shrink-0 text-sift-coral" />
                      <div>
                        <h5 className="font-semibold leading-6 text-sift-ink">
                          Primary strategy:{" "}
                          {report.manipulationRisk.primaryTactic}
                        </h5>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-sift-rule pt-3">
                      <strong className="text-sm text-sift-ink">
                        Targeted audience vulnerability:
                      </strong>
                      <p className="mt-1 text-sm leading-6 text-sift-ink-2">
                        {report.manipulationRisk.targetVulnerability}
                      </p>
                    </div>
                  </div>

                  {/* 5 Vectors Grid */}
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.values(report.manipulationRisk.vectors).map(
                      (vec) => (
                        <div
                          key={vec.name}
                          className="rounded-xl border border-sift-rule bg-sift-paper-2 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <strong className="text-sm font-semibold leading-5 text-sift-ink">
                              {vec.name}
                            </strong>
                            <span
                              className={`shrink-0 rounded-sift-pill border px-2 py-1 text-xs font-semibold ${severityTone(vec.level)}`}
                            >
                              {sentenceLabel(vec.level)}
                            </span>
                          </div>
                          <ScoreMeter score={vec.score} label={`${vec.name} score`} />
                          <p className="mt-3 text-sm leading-5 text-sift-ink-2">
                            {vec.description}
                          </p>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Detected Tactics & Countermoves */}
                  {report.manipulationRisk.detectedTactics.length > 0 && (
                    <div className="rounded-2xl border border-sift-rule bg-sift-paper p-4 sm:p-5">
                      <h5 className="font-semibold text-sift-ink">
                        Tactics Identified in Headline:
                      </h5>
                      <div className="mt-3 space-y-3">
                        {report.manipulationRisk.detectedTactics.map((t) => (
                          <div key={t.name} className="rounded-xl border border-sift-rule bg-sift-paper-2 p-4">
                            <div className="flex items-start gap-2">
                              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-sift-coral" />
                              <strong className="text-sm text-sift-ink">{t.name}</strong>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-sift-ink-2">{t.description}</p>
                            <div className="mt-3 flex items-start gap-2 border-t border-sift-rule pt-3 text-sm leading-6 text-sift-ink-2">
                              <Shield size={13} className="mt-1 shrink-0 text-sift-accent" />
                              <span>
                                <strong>Forensic Countermove:</strong>{" "}
                                {t.countermove}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: LINGUISTIC FLAGS */}
              {activeTab === "anatomy" && (
                <div className="space-y-5">
                  <div className="max-w-3xl">
                    <h4 className="font-sift-display text-lg font-semibold text-sift-ink">
                      Identified Language Patterns
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-sift-ink-2">
                      Words chosen to maximize virality, convey false certainty,
                      or obscure the true source of evidence.
                    </p>
                  </div>
                  {report.flags.length === 0 ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-sift-rule bg-sift-paper p-4 sm:p-5">
                      <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-sift-accent" />
                      <div>
                        <strong className="font-semibold text-sift-ink">
                          Clean linguistic profile
                        </strong>
                        <p className="mt-2 text-sm leading-6 text-sift-ink-2">
                          No obvious clickbait modifiers, manufactured urgency,
                          or loaded verbs detected. Note: A clean tone does not
                          guarantee the underlying claim is true; always verify
                          facts laterally.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {report.flags.map((flag, idx) => (
                        <div
                          key={`${flag.start}-${idx}`}
                          className={`w-full cursor-pointer rounded-xl border p-4 text-left transition-colors focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none ${severityTone(flag.severity)} ${
                            selectedFlag?.start === flag.start
                              ? "ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper"
                              : ""
                          }`}
                          onClick={() => setSelectedFlag(flag)}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold">“{flag.term}”</span>
                            <span className="text-xs font-medium">{flag.category}</span>
                          </div>
                          <p className="mt-2 text-sm leading-6">{flag.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {report.punctuationFlags.length > 0 && (
                    <div className="rounded-xl border border-sift-rule bg-sift-paper p-4">
                      <h5 className="font-semibold text-sift-ink">
                        Punctuation &amp; Typography Alerts:
                      </h5>
                      <ul className="mt-2 space-y-2">
                        {report.punctuationFlags.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm leading-6 text-sift-ink-2">
                            <AlertTriangle size={13} className="mt-1 shrink-0 text-sift-coral" />{" "}
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PSYCHOLOGY & EMOTIONAL TRIGGERS */}
              {activeTab === "psychology" && (
                <div className="space-y-5">
                  <div className="max-w-3xl">
                    <h4 className="font-sift-display text-lg font-semibold text-sift-ink">
                      Cognitive Bias &amp; Emotional Triggers
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-sift-ink-2">
                      Misinformation exploits evolutionary psychology. The radar
                      below reveals which brain reflex this headline attempts to
                      hijack.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {report.emotionalTriggers.map((trigger) => (
                      <div
                        key={trigger.name}
                        className="rounded-xl border border-sift-rule bg-sift-paper-2 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <strong className="text-sm font-semibold leading-5 text-sift-ink">
                            {trigger.name}
                          </strong>
                          <span
                            className={`shrink-0 rounded-sift-pill border px-2 py-1 text-xs font-semibold ${severityTone(trigger.intensity)}`}
                          >
                            {sentenceLabel(trigger.intensity)}
                          </span>
                        </div>
                        <ScoreMeter score={trigger.score} label={`${trigger.name} intensity`} />
                        <p className="mt-3 text-sm leading-5 text-sift-ink-2">
                          {trigger.description}
                        </p>
                        {trigger.matchedWords.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-sift-rule pt-3 text-xs text-sift-muted">
                            <span className="font-semibold">Trigger words:</span>
                            {trigger.matchedWords.map((w) => (
                              <code
                                key={w}
                                className="rounded-md bg-sift-paper-3 px-2 py-1 font-mono text-sift-ink-2"
                              >
                                {w}
                              </code>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: NEUTRAL REFRAME */}
              {activeTab === "reframe" && (
                <div className="space-y-5">
                  <div className="max-w-3xl">
                    <h4 className="font-sift-display text-lg font-semibold text-sift-ink">
                      How an Objective Newsroom Would Frame This
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-sift-ink-2">
                      Responsible wire services (like Reuters or The Associated
                      Press) strip emotional adjectives and present only
                      attributed, verifiable assertions.
                    </p>
                  </div>

                  <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                    <div className="rounded-2xl border border-sift-rule bg-sift-paper p-4 sm:p-5">
                      <span className="text-sm font-semibold text-sift-muted">
                        Original sensational headline
                      </span>
                      <blockquote className="mt-3 break-words border-l-2 border-sift-rule pl-4 font-sift-display text-lg leading-7 text-sift-ink">
                        “{report.rawHeadline}”
                      </blockquote>
                      <div className="mt-5 border-t border-sift-rule pt-3 text-sm text-sift-ink-2">
                        <span className="font-semibold text-sift-ink">Linguistic Issues:</span>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                          {report.flags.map((f, i) => (
                            <li key={i}>
                              Uses {f.category.toLowerCase()} (<em>{f.term}</em>
                              )
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-1 text-2xl text-sift-accent xl:rotate-0" aria-hidden="true">
                      →
                    </div>

                    <div className="rounded-2xl border border-sift-accent bg-sift-accent/10 p-4 sm:p-5">
                      <span className="text-sm font-semibold text-sift-accent">
                        Objective journalistic reframe
                      </span>
                      <blockquote className="mt-3 break-words border-l-2 border-sift-accent pl-4 font-sift-display text-lg leading-7 text-sift-ink">
                        “{report.neutralReframe}”
                      </blockquote>
                      <p className="mt-5 border-t border-sift-rule pt-3 text-sm leading-6 text-sift-ink-2">
                        Neutralized emotional intensifiers, replaced loaded
                        conflict verbs with standard reporting terminology, and
                        eliminated artificial urgency.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: FACT-CHECK ACTION PLAN */}
              {activeTab === "verify" && (
                <div className="space-y-5">
                  <div className="max-w-3xl">
                    <h4 className="font-sift-display text-lg font-semibold text-sift-ink">
                      SIFT Lateral Reading Action Plan
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-sift-ink-2">
                      Don&apos;t just read the headline—verify it laterally
                      across trusted investigative fact-check databases with one
                      click.
                    </p>
                  </div>

                  {/* SIFT Moves Checklist */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {report.verificationSteps.map((step) => (
                      <div key={step.move} className="flex items-start gap-3 rounded-xl border border-sift-rule bg-sift-paper-2 p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sift-accent font-sift-display text-lg font-semibold text-sift-accent-ink">
                          {step.move}
                        </div>
                        <div>
                          <strong className="font-semibold text-sift-ink">{step.label}</strong>
                          <p className="mt-1 text-sm leading-5 text-sift-ink-2">{step.instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Direct One-Click Fact-Checking Search Links */}
                  <div>
                    <h5 className="font-semibold text-sift-ink">
                      Search Pre-Configured Queries in Verified Fact-Checking
                      Archives:
                    </h5>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {report.factCheckLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block rounded-xl border border-sift-rule bg-sift-paper-2 p-4 transition-colors hover:border-sift-accent focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <strong className="font-semibold text-sift-ink group-hover:text-sift-accent">
                              {link.name}
                            </strong>
                            <ExternalLink size={13} className="shrink-0 text-sift-coral" />
                          </div>
                          <p className="mt-2 text-sm leading-5 text-sift-ink-2">
                            {link.purpose}
                          </p>
                          <span className="mt-4 inline-block text-xs font-semibold text-sift-accent">
                            Launch Query ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-xl border border-sift-rule bg-sift-paper p-4 text-xs leading-5 text-sift-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-sift-accent" />
          <span>
            <strong>Educational Methodology Note:</strong> AI search summarizes
            available coverage and may be wrong or incomplete; the wording
            scores are heuristic, not a truth test. Follow source links and
            cross-check primary documents before reaching a conclusion.
          </span>
        </div>
      </div>
    </div>
  );
}

const RESEARCH_STAGES: {
  id: ResearchStage;
  label: string;
  icon: typeof Search;
}[] = [
  { id: "searching", label: "Search", icon: Search },
  { id: "reviewing", label: "Review sources", icon: Layers },
  { id: "comparing", label: "Compare evidence", icon: Flame },
  { id: "preparing", label: "Prepare report", icon: CheckCircle2 },
];

const METER_WIDTH_CLASSES = [
  "w-[0%]", "w-[1%]", "w-[2%]", "w-[3%]", "w-[4%]", "w-[5%]", "w-[6%]", "w-[7%]", "w-[8%]", "w-[9%]",
  "w-[10%]", "w-[11%]", "w-[12%]", "w-[13%]", "w-[14%]", "w-[15%]", "w-[16%]", "w-[17%]", "w-[18%]", "w-[19%]",
  "w-[20%]", "w-[21%]", "w-[22%]", "w-[23%]", "w-[24%]", "w-[25%]", "w-[26%]", "w-[27%]", "w-[28%]", "w-[29%]",
  "w-[30%]", "w-[31%]", "w-[32%]", "w-[33%]", "w-[34%]", "w-[35%]", "w-[36%]", "w-[37%]", "w-[38%]", "w-[39%]",
  "w-[40%]", "w-[41%]", "w-[42%]", "w-[43%]", "w-[44%]", "w-[45%]", "w-[46%]", "w-[47%]", "w-[48%]", "w-[49%]",
  "w-[50%]", "w-[51%]", "w-[52%]", "w-[53%]", "w-[54%]", "w-[55%]", "w-[56%]", "w-[57%]", "w-[58%]", "w-[59%]",
  "w-[60%]", "w-[61%]", "w-[62%]", "w-[63%]", "w-[64%]", "w-[65%]", "w-[66%]", "w-[67%]", "w-[68%]", "w-[69%]",
  "w-[70%]", "w-[71%]", "w-[72%]", "w-[73%]", "w-[74%]", "w-[75%]", "w-[76%]", "w-[77%]", "w-[78%]", "w-[79%]",
  "w-[80%]", "w-[81%]", "w-[82%]", "w-[83%]", "w-[84%]", "w-[85%]", "w-[86%]", "w-[87%]", "w-[88%]", "w-[89%]",
  "w-[90%]", "w-[91%]", "w-[92%]", "w-[93%]", "w-[94%]", "w-[95%]", "w-[96%]", "w-[97%]", "w-[98%]", "w-[99%]",
  "w-[100%]",
] as const;

function ScoreMeter({ score, label }: { score: number; label: string }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div
      className="mt-3 h-2 overflow-hidden rounded-full bg-sift-paper-3"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeScore}
    >
      <div
        className={`${METER_WIDTH_CLASSES[safeScore]} h-full rounded-full bg-sift-accent`}
      />
    </div>
  );
}

function severityTone(value: string) {
  const tone = value.toLowerCase();
  if (tone === "critical" || tone === "high") {
    return "border-sift-coral bg-sift-coral/10 text-sift-coral";
  }
  if (tone === "low") {
    return "border-sift-rule bg-sift-paper-3 text-sift-ink-2";
  }
  return "border-sift-accent bg-sift-accent/10 text-sift-accent";
}

function evidenceTone(value: string) {
  const tone = value.toLowerCase();
  if (tone === "refutes") return severityTone("high");
  if (tone === "supports") return severityTone("medium");
  return severityTone("low");
}

function sentenceLabel(value: string) {
  return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function ResearchProgress({
  stage,
  message,
  sources,
}: {
  stage: ResearchStage | null;
  message: string;
  sources: EvidenceSource[];
}) {
  const isComplete = stage === "complete";
  const activeIndex = isComplete
    ? RESEARCH_STAGES.length
    : RESEARCH_STAGES.findIndex((item) => item.id === stage);

  return (
    <section
      className="rounded-2xl border border-sift-rule bg-sift-paper p-4 sm:p-5"
      aria-label="Headline research progress"
    >
      <ol className="flex flex-wrap gap-2">
        {RESEARCH_STAGES.map((item, index) => {
          const Icon = item.icon;
          const state =
            isComplete || index < activeIndex
              ? "done"
              : index === activeIndex
                ? "active"
                : "queued";
          return (
            <li
              key={item.id}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                state === "active"
                  ? "border-sift-accent bg-sift-accent text-sift-accent-ink"
                  : state === "done"
                    ? "border-sift-accent bg-sift-accent/10 text-sift-accent"
                    : "border-sift-rule bg-sift-paper-2 text-sift-muted"
              }`}
              aria-current={state === "active" ? "step" : undefined}
            >
              <span className="flex size-5 items-center justify-center">
                {state === "done" ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Icon size={15} />
                )}
              </span>
              <span>{item.label}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm leading-6 text-sift-ink-2" role="status">
        {message}
      </p>
      {sources.length > 0 && (
        <div
          className="mt-3 grid gap-2 sm:grid-cols-2"
          aria-label="Sources found so far"
        >
          {sources.slice(0, 4).map((source) => (
            <a
              key={source.url}
              className="block rounded-xl border border-sift-rule bg-sift-paper-2 p-3 transition-colors hover:border-sift-accent focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 motion-reduce:transition-none"
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong className="block text-sm font-semibold text-sift-ink">{source.title}</strong>
              <span className="mt-1 block text-xs text-sift-muted">{source.publisher}</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function AIReviewPanel({ analysis }: { analysis: AIAnalysis }) {
  return (
    <section
      className="rounded-2xl border border-sift-rule bg-sift-paper p-4 sm:p-5"
      aria-label="AI research review"
    >
      <div className="flex flex-col gap-3 border-b border-sift-rule pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="font-sift-display text-lg font-semibold text-sift-ink">
            Evidence conclusion: {analysis.verdict}
          </h4>
          <span className="mt-1 block text-xs text-sift-muted">{analysis.provider}</span>
        </div>
        <span
          className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${severityTone(analysis.evidenceStrength)}`}
        >
          {analysis.evidenceStrength} evidence
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-sift-ink-2">
        <strong>Claim reviewed:</strong> {analysis.claim}
      </p>
      <div className="mt-3">
        <FormattedMarkdown>{analysis.assessment}</FormattedMarkdown>
      </div>
      <p className="mt-3 text-xs leading-5 text-sift-muted">
        {analysis.evidenceSufficient
          ? `${analysis.evidenceStrength} evidence from independent sources · ${analysis.sources.length} sources reviewed`
          : `Not enough independent evidence for a firm verdict · ${analysis.sources.length} sources reviewed`}
      </p>
      <details className="mt-4 border-t border-sift-rule pt-3">
        <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-sift-accent focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2">
          Evidence and details
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sift-rule bg-sift-paper-2 p-4">
            <strong className="text-sm font-semibold text-sift-ink">Wording and framing</strong>
            <div className="mt-2">
              <FormattedMarkdown>{analysis.wordingBias}</FormattedMarkdown>
            </div>
          </div>
          <div className="rounded-xl border border-sift-rule bg-sift-paper-2 p-4">
            <strong className="text-sm font-semibold text-sift-ink">Context still needed</strong>
            <div className="mt-2">
              <FormattedMarkdown>{analysis.missingContext}</FormattedMarkdown>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <strong className="text-sm font-semibold text-sift-ink">
            {analysis.searchCompleted
              ? "Web sources consulted"
              : "Live web search unavailable"}
          </strong>
          {analysis.sources.length ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {analysis.sources.map((source) => (
                <article className="rounded-xl border border-sift-rule bg-sift-paper-2 p-4" key={source.url}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <a
                      className="inline-flex min-h-8 items-start gap-1 text-sm font-semibold leading-5 text-sift-accent underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2"
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title} <ExternalLink size={12} />
                    </a>
                    <span className={`inline-flex w-fit shrink-0 rounded-sift-pill border px-2 py-1 text-xs font-semibold ${evidenceTone(source.evidencePosition)}`}>
                      {sentenceLabel(source.evidencePosition)}
                    </span>
                  </div>
                  <span className="mt-2 block text-xs leading-5 text-sift-muted">
                    {source.publisher}
                    {source.publishedDate ? ` · ${source.publishedDate}` : ""}
                    {` · Relevance ${source.relevanceScore.toFixed(2)}`}
                  </span>
                  <div className="mt-3">
                    {source.summary ? (
                      <FormattedMarkdown>{source.summary}</FormattedMarkdown>
                    ) : (
                      <p className="line-clamp-3 text-sm leading-6 text-sift-ink-2">
                        {plainTextPreview(source.snippet)}
                      </p>
                    )}
                    <details className="mt-2 border-t border-sift-rule pt-1">
                      <summary className="min-h-10 cursor-pointer py-2 text-xs font-semibold text-sift-accent focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2">
                        Read source excerpt
                      </summary>
                      <div className="mt-2 max-h-80 overflow-y-auto rounded-lg bg-sift-paper p-3">
                        <FormattedMarkdown>
                          {source.snippet || source.summary}
                        </FormattedMarkdown>
                      </div>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>
              {analysis.searchCompleted
                ? "Search returned no usable sources. Treat this result as unverified."
                : "Search did not complete. Treat this result as unverified and verify the claim with current, reliable sources."}
            </p>
          )}
        </div>
        <p className="mt-4 border-t border-sift-rule pt-3 text-xs leading-5 text-sift-muted">
          An AI research aid is not a definitive fact-check. Open the cited
          sources to confirm the claim.
        </p>
      </details>
    </section>
  );
}

// Helper to highlight flagged terms in headline
function renderAnnotatedHeadline(
  headline: string,
  flags: LinguisticFlag[],
  selectedFlag: LinguisticFlag | null,
  onSelect: (flag: LinguisticFlag) => void,
) {
  if (flags.length === 0) return <span>{headline}</span>;

  const parts = [];
  let cursor = 0;

  for (const flag of flags) {
    if (flag.start > cursor) {
      parts.push(
        <span key={`text-${cursor}`}>
          {headline.slice(cursor, flag.start)}
        </span>,
      );
    }

    const isSelected = selectedFlag?.start === flag.start;
    parts.push(
      <mark
        key={`flag-${flag.start}-${flag.end}`}
        className={`cursor-pointer rounded px-0.5 underline decoration-2 underline-offset-2 focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 ${severityTone(flag.severity)} ${
          isSelected ? "ring-2 ring-sift-accent" : ""
        }`}
        onClick={() => onSelect(flag)}
        title={`${flag.category}: ${flag.explanation}`}
      >
        {headline.slice(flag.start, flag.end)}
        <span className="ml-1 inline-block rounded bg-sift-paper-2 px-1 py-0.5 align-middle font-mono text-[0.6rem] font-medium text-sift-ink-2">
          {flag.category.split(" ")[0]}
        </span>
      </mark>,
    );

    cursor = flag.end;
  }

  if (cursor < headline.length) {
    parts.push(<span key={`text-end`}>{headline.slice(cursor)}</span>);
  }

  return <>{parts}</>;
}
