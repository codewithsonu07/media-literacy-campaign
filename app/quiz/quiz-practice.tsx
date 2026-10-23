"use client";

import { useState } from "react";
import { DETECTIVE_CASES } from "../lib/detective-cases";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Eye,
  Flame,
  Globe,
  Layers,
  MessageSquare,
  Newspaper,
  Repeat2,
  RotateCcw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";

export default function QuizPractice() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [selectedVerdict, setSelectedVerdict] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<
    { caseId: string; selected: string; isCorrect: boolean }[]
  >([]);
  const [activeTool, setActiveTool] = useState<
    "clues" | "domain" | "image" | "wire"
  >("clues");
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const currentCase = DETECTIVE_CASES[caseIndex];
  const isComplete = caseIndex >= DETECTIVE_CASES.length;
  const score = userAnswers.filter((a) => a.isCorrect).length;

  function handleSelectVerdict(verdict: string) {
    if (selectedVerdict !== null) return;
    setSelectedVerdict(verdict);
    const isCorrect = verdict === currentCase.correctVerdict;
    if (isCorrect) {
      setStreak((prev) => prev + 1);
      setXp((prev) => prev + 150);
    } else {
      setStreak(0);
    }
    setUserAnswers((prev) => [
      ...prev,
      { caseId: currentCase.id, selected: verdict, isCorrect },
    ]);
  }

  function handleNextCase() {
    setSelectedVerdict(null);
    setSelectedClueId(null);
    setActiveTool("clues");
    setCaseIndex((prev) => prev + 1);
  }

  function handleRestart() {
    setCaseIndex(0);
    setSelectedVerdict(null);
    setUserAnswers([]);
    setSelectedClueId(null);
    setActiveTool("clues");
    setStreak(0);
    setXp(0);
  }

  if (isComplete) {
    let rank = "Senior Verification Specialist";
    let rankClass = "border-sift-accent bg-sift-paper";
    let rankDesc =
      "You possess sharp lateral reading instincts and rarely fall for emotional baits or cheapfakes.";

    if (score === DETECTIVE_CASES.length) {
      rank = "Chief Fact-Checking Investigator";
      rankClass = "border-sift-accent bg-sift-paper-2";
      rankDesc =
        "Flawless forensic eye! You spotted every fake account handle, truncated chart axis, out-of-context video, and AI artifact.";
    } else if (score < 5) {
      rank = "Vulnerable to Viral Hoaxes";
      rankClass = "border-sift-coral bg-sift-paper";
      rankDesc =
        "You occasionally fall for urgent phrasing, professional-looking impostor styling, and deceptive graph axes. Review the SIFT field guide to level up.";
    }

    return (
      <div className="mx-auto w-full max-w-5xl text-sift-ink">
        <div className="flex flex-col items-center border-b border-sift-rule bg-sift-paper px-5 py-8 text-center sm:px-8">
          <Award size={48} className="mb-sift-sm text-sift-accent" />
          <h2 className="font-sift-display text-balance text-sift-title font-semibold">
            Field Detective Dossier
          </h2>
          <p className="mt-1 text-sm text-sift-muted">Forensic audit closed.</p>
          <div className="mt-5 flex flex-col items-center gap-1 bg-sift-paper-2 px-5 py-sift-md text-sm sm:flex-row sm:gap-sift-sm">
            <strong className="font-sift-display text-sift-title font-semibold">
              {score}
            </strong>
            <span>
              / {DETECTIVE_CASES.length} cases verified correctly • {xp} XP
              Earned
            </span>
          </div>
        </div>

        <div
          className={`mx-5 my-5 border-l-4 p-5 sm:mx-8 ${rankClass}`}
        >
          <h3 className="font-sift-display text-balance text-sift-title font-semibold">
            {rank}
          </h3>
          <span className="mt-1 inline-block text-xs text-sift-muted">Assigned investigator rank</span>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-sift-ink-2">
            {rankDesc}
          </p>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="p-5 sm:p-8">
          <h4 className="font-sift-display text-sift-title font-semibold">
            Case-by-Case Forensic Audit:
          </h4>
          <div className="mt-sift-sm overflow-hidden rounded-sift-input border border-sift-rule">
            {DETECTIVE_CASES.map((c) => {
              const ans = userAnswers.find((a) => a.caseId === c.id);
              const isCorrect = ans?.isCorrect ?? false;
              return (
                <div
                  key={c.id}
                  className={`flex flex-wrap items-center gap-sift-sm border-b border-sift-rule px-sift-sm last:border-b-0 sm:px-sift-md ${isCorrect ? "border-l-4 border-l-sift-accent bg-sift-paper" : "border-l-4 border-l-sift-coral bg-sift-paper"}`}
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-sift-pill bg-sift-paper-3 font-mono text-xs font-semibold">{c.caseNumber}</div>
                  <div className="min-w-0 flex-1 py-sift-sm">
                    <strong>{c.headline}</strong>
                    <span className="mt-1 block text-xs text-sift-muted">{c.category}</span>
                  </div>
                  <div className="shrink-0 self-center">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 rounded-sift-pill border border-sift-accent px-sift-xs.5 py-1 text-xs font-semibold text-sift-accent">
                        <CheckCircle2 size={13} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-sift-pill border border-sift-coral px-2.5 py-1 text-xs font-semibold text-sift-ink">
                        <XCircle size={13} className="text-sift-coral" /> Tricked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-sift-sm border-t border-sift-rule px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
          <button
            className="inline-flex min-h-12 items-center justify-center gap-sift-xs rounded-sift-input bg-sift-accent px-5 py-sift-sm text-sm font-semibold text-sift-paper-2 transition-colors hover:brightness-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleRestart}
            type="button"
          >
            <RotateCcw size={14} /> Restart simulation
          </button>
          <a className="inline-flex min-h-12 items-center justify-center gap-sift-xs rounded-sift-input border border-sift-rule bg-transparent px-5 py-sift-sm text-sm font-semibold text-sift-ink transition-colors hover:bg-sift-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent" href="/checker">
            Analyze a headline
          </a>
        </div>
      </div>
    );
  }

  const selectedClue = currentCase.clues.find((c) => c.id === selectedClueId);

  // Check if a specific target tag is currently selected for visual highlighting
  const isTargetActive = (tag: string) => {
    return selectedClue?.hotspotTag === tag;
  };

  return (
    <div className="mx-auto w-full max-w-6xl text-sift-ink" aria-live="polite">
      <div className="flex flex-col gap-sift-md border-y border-sift-rule bg-sift-paper-2 px-sift-md py-sift-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-sift-sm">
          <span className="rounded-sift-input bg-sift-ink px-sift-sm py-sift-xs font-mono text-xs font-bold text-sift-paper-2">
            {String(caseIndex + 1).padStart(2, "0")} / {DETECTIVE_CASES.length}
          </span>
          <span className="rounded-sift-pill border border-sift-rule px-sift-sm py-1.5 text-xs font-medium text-sift-ink-2">
            {currentCase.difficulty}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-sift-xs text-xs">
          <span className="inline-flex min-h-9 items-center gap-1.5 rounded-sift-pill border border-sift-rule bg-sift-paper px-sift-sm py-1.5 font-semibold text-sift-ink">
            <Zap size={11} className="text-sift-accent" /> {xp} XP
          </span>
          {streak > 1 && (
            <span className="inline-flex min-h-9 items-center gap-1 rounded-sift-pill border border-sift-coral bg-sift-paper px-sift-sm py-1.5 font-medium text-sift-ink">
              <Flame size={12} aria-hidden="true" /> {streak} streak
            </span>
          )}
          <span
            className="inline-flex min-h-9 items-center rounded-sift-pill border border-sift-rule bg-sift-paper px-sift-sm py-1.5 text-sift-ink-2"
            aria-label={`Score ${score} of ${caseIndex}`}
          >
            <strong className="text-sift-ink">{score}</strong>
            <span className="mx-1">/</span>
            {caseIndex}
          </span>
        </div>
      </div>

      <div
        className="h-1 overflow-hidden bg-sift-paper-3"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={DETECTIVE_CASES.length}
        aria-valuenow={caseIndex}
      >
        <span
          className="block h-full bg-sift-accent"
          style={{ width: `${(caseIndex / DETECTIVE_CASES.length) * 100}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)]">
        <div className="min-w-0 px-sift-md py-sift-md sm:px-6 sm:py-6 lg:border-r lg:border-sift-rule">
          <div className="mb-sift-md border-b border-sift-rule pb-sift-sm">
            <h2 className="font-sift-display text-sift-title font-semibold leading-tight tracking-[-0.03em] text-sift-ink">
              {currentCase.headline}
            </h2>
            <p className="mt-1 text-sm leading-5 text-sift-muted">{currentCase.category}</p>
          </div>
          <div className="w-full">
          {/* Post Type: Tweet / X Style */}
          {currentCase.postType === "tweet" && (
            <div className="space-y-4 rounded-sift-card border border-sift-rule bg-sift-paper p-sift-md sm:p-6">
              <div
                className={`flex items-center gap-sift-sm ${isTargetActive("USER_HANDLE") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-sift-pill bg-sift-accent font-semibold text-sift-paper-2">
                  {currentCase.author.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                    <strong>{currentCase.author.name}</strong>
                    {currentCase.author.isVerified && (
                      <span className="grid size-4 place-items-center rounded-sift-pill bg-sift-accent text-xs font-bold text-sift-paper-2" title="Verified Badge">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="mt-0.5 block break-all text-sm text-sift-muted">
                    {currentCase.author.handle}
                  </span>
                </div>
              </div>

              <div
                className={`min-w-0 ${isTargetActive("HEADLINE_TONE") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <p className="whitespace-pre-wrap text-base leading-7 text-sift-ink sm:text-lg">{currentCase.content}</p>
              </div>

              <div
                className={`flex flex-wrap items-center justify-between gap-sift-md border-t border-sift-rule pt-3 text-xs text-sift-muted ${isTargetActive("TIMESTAMP_METRIC") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <span>
                  <MessageSquare size={13} /> {currentCase.metrics.comments}
                </span>
                <span>
                  <Repeat2 size={13} /> {currentCase.metrics.reposts}
                </span>
                <span>
                  <Share2 size={13} /> {currentCase.metrics.likes}
                </span>
              </div>
            </div>
          )}

          {/* Post Type: WhatsApp Viral Forward */}
          {currentCase.postType === "whatsapp" && (
            <div className="ml-auto max-w-2xl space-y-4 rounded-sift-card border border-sift-rule bg-sift-paper p-sift-md sm:p-6">
              <div
                className={`inline-flex w-fit items-center gap-sift-xs rounded-sift-pill bg-sift-paper-3 px-sift-sm py-1.5 text-xs text-sift-ink-2 ${isTargetActive("TIMESTAMP_METRIC") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <Repeat2 size={13} aria-hidden="true" />
                <span>Forwarded many times</span>
              </div>
              <p
                className={`whitespace-pre-wrap text-base leading-7 text-sift-ink sm:text-lg ${isTargetActive("HEADLINE_TONE") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                {currentCase.content}
              </p>
              <div className="flex items-center justify-end gap-sift-sm text-xs text-sift-muted">
                <span className="font-mono">11:42 PM</span>
                <span className="font-mono">{currentCase.metrics.reposts}</span>
              </div>
            </div>
          )}

          {/* Post Type: Breaking Banner */}
          {currentCase.postType === "breaking-banner" && (
            <div className="space-y-4 rounded-sift-card border border-sift-rule bg-sift-paper p-sift-md sm:p-6">
              <div
                className={`flex flex-wrap items-center justify-between gap-sift-xs border-b border-sift-rule pb-sift-sm ${isTargetActive("HEADLINE_TONE") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <span className="text-sm font-semibold">Breaking bulletin</span>
                <span className="text-right text-sm font-semibold">{currentCase.author.name}</span>
              </div>
              <p className="whitespace-pre-wrap text-base leading-7 text-sift-ink sm:text-lg">{currentCase.content}</p>
              {currentCase.mediaNote && (
                <div
                  className={`flex items-start gap-sift-xs rounded-sift-input bg-sift-paper-3 p-3 text-sm leading-6 text-sift-ink-2 ${isTargetActive("MEDIA_ATTACHMENT") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
                >
                  <Eye size={14} />
                  <span>{currentCase.mediaNote}</span>
                </div>
              )}
            </div>
          )}

          {/* Post Type: Chart */}
          {currentCase.postType === "chart" && (
            <div className="space-y-4 rounded-sift-card border border-sift-rule bg-sift-paper p-sift-md sm:p-6">
              <div
                className={`flex flex-wrap items-center justify-between gap-sift-xs border-b border-sift-rule pb-sift-sm text-sm ${isTargetActive("HEADLINE_TONE") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <strong>{currentCase.author.name}</strong>
                <span>Infographic Wire</span>
              </div>
              <p className="whitespace-pre-wrap text-base leading-7 text-sift-ink sm:text-lg">{currentCase.content}</p>
              <div
                className={`grid min-h-56 grid-cols-[auto_minmax(0,1fr)] items-stretch gap-sift-xs rounded-sift-input border border-sift-rule bg-sift-paper-2 p-2 sm:gap-5 sm:p-sift-md ${isTargetActive("MEDIA_ATTACHMENT") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <div className="flex flex-col justify-between py-1 text-right font-mono text-xs text-sift-muted">
                  <span>6.2%</span>
                  <span>6.0%</span>
                  <span>5.8% (Truncated!)</span>
                </div>
                <div className="flex h-48 items-end justify-center gap-sift-md border-b border-l border-sift-rule pb-2 pl-3 sm:gap-columns sm:pl-sift-md">
                  <div className="flex h-full flex-col items-center justify-end gap-sift-xs">
                    <div className="h-[25%] w-7 rounded-t-sm bg-sift-accent sm:w-9" />
                    <span>Q2 (5.9%)</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-end gap-sift-xs">
                    <div className="h-[95%] w-7 rounded-t-sm bg-sift-accent sm:w-9" />
                    <span>Q3 (6.1%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Post Type: AI Synthetic Media */}
          {currentCase.postType === "ai-image" && (
            <div className="space-y-4 rounded-sift-card border border-sift-rule bg-sift-paper p-sift-md sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-sift-xs border-b border-sift-rule pb-sift-sm text-sm">
                <strong>{currentCase.author.name}</strong>
                <span className="rounded-sift-pill bg-sift-paper-3 px-sift-sm py-1 text-xs font-medium text-sift-ink-2">Viral Photo Post</span>
              </div>
              <p className="whitespace-pre-wrap text-base leading-7 text-sift-ink sm:text-lg">{currentCase.content}</p>
              <div
                className={`flex items-start gap-sift-sm rounded-sift-input border border-sift-rule bg-sift-paper-2 p-sift-md ${isTargetActive("MEDIA_ATTACHMENT") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <Sparkles size={20} className="shrink-0 text-sift-accent" />
                <div className="text-sm leading-6">
                  <strong>Simulated Visual Artifacts:</strong>
                  <p>{currentCase.mediaNote}</p>
                </div>
              </div>
            </div>
          )}

          {/* Post Type: Quote Card */}
          {currentCase.postType === "quote-card" && (
            <div className="space-y-4 rounded-sift-card border border-sift-rule bg-sift-paper p-sift-md sm:p-6">
              <div
                className={`flex flex-wrap items-center justify-between gap-sift-xs border-b border-sift-rule pb-sift-sm text-sm ${isTargetActive("USER_HANDLE") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                <strong>{currentCase.author.name}</strong>
                <span>Quote Card</span>
              </div>
              <blockquote
                className={`border-l-4 border-sift-accent py-sift-xs pl-sift-md font-sift-display text-sift-title font-medium leading-7 ${isTargetActive("HEADLINE_TONE") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
              >
                {currentCase.content}
              </blockquote>
              {currentCase.mediaNote && (
                <div
                  className={`flex items-start gap-sift-xs rounded-sift-input bg-sift-paper-3 p-3 text-sm leading-6 text-sift-ink-2 ${isTargetActive("MEDIA_ATTACHMENT") ? "rounded-sift-input ring-2 ring-sift-accent ring-offset-2 ring-offset-sift-paper" : ""}`}
                >
                  <Eye size={14} />
                  <span>{currentCase.mediaNote}</span>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        <div className="min-w-0 self-start border-y border-sift-rule bg-sift-paper-2 lg:border-y-0">
        <div className="flex flex-wrap gap-1 border-b border-sift-rule px-sift-sm pt-sift-xs sm:px-5">
          <button
            className={`inline-flex min-h-11 items-center justify-center gap-sift-xs border-b-2 border-transparent px-sift-sm py-sift-xs text-sm font-medium text-sift-ink-2 transition-colors hover:bg-sift-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent ${activeTool === "clues" ? "!border-b-sift-accent !bg-sift-accent !text-sift-paper-2" : ""}`}
            aria-pressed={activeTool === "clues"}
            onClick={() => setActiveTool("clues")}
            type="button"
          >
            <Eye size={13} /> Clues
          </button>
          <button
            className={`inline-flex min-h-11 items-center justify-center gap-sift-xs border-b-2 border-transparent px-sift-sm py-sift-xs text-sm font-medium text-sift-ink-2 transition-colors hover:bg-sift-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent ${activeTool === "domain" ? "!border-b-sift-accent !bg-sift-accent !text-sift-paper-2" : ""}`}
            aria-pressed={activeTool === "domain"}
            onClick={() => setActiveTool("domain")}
            type="button"
          >
            <Globe size={13} /> Account
          </button>
          <button
            className={`inline-flex min-h-11 items-center justify-center gap-sift-xs border-b-2 border-transparent px-sift-sm py-sift-xs text-sm font-medium text-sift-ink-2 transition-colors hover:bg-sift-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent ${activeTool === "image" ? "!border-b-sift-accent !bg-sift-accent !text-sift-paper-2" : ""}`}
            aria-pressed={activeTool === "image"}
            onClick={() => setActiveTool("image")}
            type="button"
          >
            <Layers size={13} /> Media
          </button>
          <button
            className={`inline-flex min-h-11 items-center justify-center gap-sift-xs border-b-2 border-transparent px-sift-sm py-sift-xs text-sm font-medium text-sift-ink-2 transition-colors hover:bg-sift-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent ${activeTool === "wire" ? "!border-b-sift-accent !bg-sift-accent !text-sift-paper-2" : ""}`}
            aria-pressed={activeTool === "wire"}
            onClick={() => setActiveTool("wire")}
            type="button"
          >
            <Newspaper size={13} /> Coverage
          </button>
        </div>

        <div className="p-sift-md sm:p-5">
          {activeTool === "clues" && (
            <details open>
              <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-sift-ink-2 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent">
                Inspect a clue
              </summary>
              <div className="space-y-1">
                <div className="mt-sift-sm grid gap-sift-xs">
                  {currentCase.clues.map((clue, idx) => (
                    <button
                      key={clue.id}
                      className={`inline-flex min-h-11 w-full items-center justify-start gap-sift-xs rounded-sift-input border border-sift-rule bg-sift-paper px-sift-sm py-sift-xs text-left text-sm font-medium text-sift-ink transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent ${selectedClueId === clue.id ? "!border-sift-accent !bg-sift-accent !text-sift-paper-2" : ""}`}
                      aria-pressed={selectedClueId === clue.id}
                      onClick={() =>
                        setSelectedClueId(
                          selectedClueId === clue.id ? null : clue.id,
                        )
                      }
                      type="button"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-sift-pill bg-sift-paper-3 font-mono text-xs font-semibold text-sift-ink-2">0{idx + 1}</span>
                      <span>{clue.label}</span>
                    </button>
                  ))}
                </div>

                {selectedClue ? (
                  <div className="mt-sift-md flex gap-sift-sm rounded-sift-input border border-sift-coral bg-sift-paper p-sift-md text-sm leading-6 transition-colors duration-200 motion-reduce:transition-none">
                    <AlertTriangle
                      size={16}
                      className="text-sift-coral shrink-0"
                    />
                    <div>
                      <strong>Forensic Observation:</strong>
                      <p>{selectedClue.hint}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-sift-md text-sm leading-6 text-sift-muted">
                    Select a clue to highlight the related detail in the post.
                  </p>
                )}
              </div>
            </details>
          )}

          {activeTool === "domain" && (
            <div className="min-h-36 rounded-sift-input bg-sift-paper p-sift-md text-sm leading-6 sm:p-5 transition-colors duration-200 motion-reduce:transition-none">
              <div className="mb-sift-sm flex items-center gap-sift-xs text-base">
                <Globe size={18} className="text-sift-accent" />
                <strong>Simulated Source &amp; WHOIS Inspection</strong>
              </div>
              <p>{currentCase.simulatedForensics.domainCheck}</p>
              <small>
                Source Audit Status: SIFT Move I (Investigate the Source)
              </small>
            </div>
          )}

          {activeTool === "image" && (
            <div className="min-h-36 rounded-sift-input bg-sift-paper p-sift-md text-sm leading-6 sm:p-5 transition-colors duration-200 motion-reduce:transition-none">
              <div className="mb-sift-sm flex items-center gap-sift-xs text-base">
                <Layers size={18} className="text-sift-coral" />
                <strong>Reverse Search &amp; Image Forensics</strong>
              </div>
              <p>{currentCase.simulatedForensics.imageAudit}</p>
              <small>
                Visual Forensics: SIFT Move T (Trace to Original Context)
              </small>
            </div>
          )}

          {activeTool === "wire" && (
            <div className="min-h-36 rounded-sift-input bg-sift-paper p-sift-md text-sm leading-6 sm:p-5 transition-colors duration-200 motion-reduce:transition-none">
              <div className="mb-sift-sm flex items-center gap-sift-xs text-base">
                <Newspaper size={18} className="text-sift-accent" />
                <strong>Lateral Wire &amp; Agency Cross-Check</strong>
              </div>
              <p>{currentCase.simulatedForensics.lateralWireCoverage}</p>
              <small>Consensus Check: SIFT Move F (Find Better Coverage)</small>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* VERDICT BUTTONS */}
      <details open className="border-t border-sift-rule px-sift-md py-5 sm:px-6 sm:py-6">
        <summary className="min-h-11 cursor-pointer py-2 text-base font-semibold text-sift-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent">
          Make your call
        </summary>
        <div className="mt-sift-sm grid grid-cols-2 gap-sift-xs sm:grid-cols-4">
          {currentCase.options.map((opt) => {
            const isChosen = selectedVerdict === opt;
            const isAnswered = selectedVerdict !== null;
            const isThisCorrect = opt === currentCase.correctVerdict;

            let buttonClass = "inline-flex min-h-12 items-center justify-center gap-sift-xs rounded-sift-input border border-sift-rule bg-sift-paper px-sift-sm py-sift-sm text-sm font-semibold text-sift-ink transition-colors hover:border-sift-accent focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent disabled:cursor-not-allowed";
            const shortVerdict =
              opt === "Legitimate Verified News"
                ? "Verified"
                : opt === "Misleading Context"
                  ? "Misleading"
                  : opt === "Manipulated Media"
                    ? "Manipulated"
                    : opt === "Satire / Parody"
                      ? "Satire"
                      : "Fabricated";
            if (isAnswered) {
              if (isThisCorrect) buttonClass += " !border-sift-accent !bg-sift-accent !text-sift-paper-2";
              else if (isChosen) buttonClass += " !border-sift-coral !bg-sift-coral !text-sift-ink";
              else buttonClass += " opacity-50";
            }

            return (
              <button
                key={opt}
                className={buttonClass}
                aria-label={opt}
                disabled={isAnswered}
                onClick={() => handleSelectVerdict(opt)}
                type="button"
              >
                <span className={`grid size-4 shrink-0 place-items-center rounded-sift-pill border-2 border-current ${isAnswered && (isThisCorrect || isChosen) ? "bg-current" : ""}`}>
                  {isAnswered && (isThisCorrect || isChosen) && (
                    <span className={`size-1.5 rounded-full ${isThisCorrect ? "bg-sift-paper" : "bg-sift-ink"}`} />
                  )}
                </span>
                <span>{shortVerdict}</span>
              </button>
            );
          })}
        </div>
      </details>

      {/* DEBRIEFING CARD WITH OFFICIAL VERIFICATION STAMP */}
      {selectedVerdict !== null && (
        <div
          className={`m-4 rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md text-sift-ink sm:m-6 sm:p-6 transition-colors duration-200 motion-reduce:transition-none ${
            selectedVerdict === currentCase.correctVerdict
              ? "border-l-4 border-sift-accent"
              : "border-l-4 border-sift-coral"
          }`}
        >
          {/* Official Animated Forensic Stamp */}
          <div className="mb-sift-md flex justify-center">
            <div
              className={`rounded-sift-input border-2 border-dashed px-sift-md py-sift-xs font-mono text-xs font-bold ${
                currentCase.correctVerdict === "Legitimate Verified News"
                  ? "border-sift-accent text-sift-accent"
                  : "border-sift-coral text-sift-ink"
              }`}
            >
              {currentCase.correctVerdict === "Legitimate Verified News"
                ? "✓ Verified report"
                : currentCase.correctVerdict}
            </div>
          </div>

          <div className="flex items-start gap-sift-sm">
            {selectedVerdict === currentCase.correctVerdict ? (
              <>
                <ShieldCheck size={24} className="text-sift-accent shrink-0" />
                <div>
                  <strong>Correct Forensic Assessment! (+150 XP)</strong>
                  <p>
                    You classified this case accurately as:{" "}
                    <em>{currentCase.correctVerdict}</em>
                  </p>
                </div>
              </>
            ) : (
              <>
                <ShieldAlert size={24} className="text-sift-coral shrink-0" />
                <div>
                  <strong>Hoax Trap Triggered!</strong>
                  <p>
                    You voted <em>{selectedVerdict}</em>, but the correct
                    forensic verdict is:{" "}
                    <strong>{currentCase.correctVerdict}</strong>.
                  </p>
                </div>
              </>
            )}
          </div>

          <p className="mt-sift-md text-sm leading-6 text-sift-ink-2">
            {currentCase.forensicDebrief.summary}
          </p>

          <div className="mt-5 rounded-sift-input border border-sift-rule bg-sift-paper p-sift-md text-sm leading-6">
            <strong>Key Investigative Red Flags:</strong>
            <ul>
              {currentCase.forensicDebrief.keyRedFlags.map((flag, idx) => (
                <li key={idx}>
                  <AlertTriangle
                    size={13}
                    className="text-sift-coral shrink-0"
                  />{" "}
                  {flag}
                </li>
              ))}
            </ul>
          </div>

          {/* SIFT Move Callout */}
          <div className="mt-sift-md flex flex-col gap-sift-sm rounded-sift-input border border-sift-accent bg-sift-paper p-sift-md sm:flex-row sm:items-start">
            <div className="inline-flex w-fit shrink-0 items-center rounded-sift-pill bg-sift-accent px-sift-sm py-1.5 text-xs font-semibold text-sift-paper-2">
              SIFT move: {currentCase.forensicDebrief.siftMoveApplied.letter}
            </div>
            <div className="text-sm leading-6">
              <strong>
                {currentCase.forensicDebrief.siftMoveApplied.step}
              </strong>
              <p>{currentCase.forensicDebrief.siftMoveApplied.actionTaken}</p>
            </div>
          </div>

          <div className="mt-sift-md rounded-sift-input border-l-4 border-sift-accent bg-sift-paper p-sift-md text-sm leading-6">
            <strong>Media literacy takeaway:</strong>
            <p>{currentCase.forensicDebrief.realWorldLesson}</p>
          </div>

          <div className="mt-sift-lg flex justify-end">
            <button
              className="inline-flex min-h-12 items-center justify-center gap-sift-xs rounded-sift-input bg-sift-accent px-5 py-sift-sm text-sm font-semibold text-sift-paper-2 transition-colors hover:brightness-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleNextCase}
              type="button"
            >
              Next Case File <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
