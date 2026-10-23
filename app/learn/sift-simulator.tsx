"use client";

import { useState } from "react";
import { SIFT_SIMULATION } from "../lib/learn-data";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

export default function SiftSimulator() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { step: string; optionId: string; isOptimal: boolean }[]
  >([]);

  const step = SIFT_SIMULATION[currentStepIndex];
  const isFinished = currentStepIndex >= SIFT_SIMULATION.length;

  const optimalCount = history.filter((h) => h.isOptimal).length;

  function handleSelect(optionId: string) {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(optionId);
    const chosen = step.userOptions.find((o) => o.id === optionId);
    setHistory((prev) => [
      ...prev,
      { step: step.step, optionId, isOptimal: chosen?.isOptimal ?? false },
    ]);
  }

  function handleNext() {
    setSelectedOptionId(null);
    setCurrentStepIndex((prev) => prev + 1);
  }

  function handleReset() {
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setHistory([]);
  }

  if (isFinished) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-paper-3)] p-5 text-[var(--color-paper)] sm:p-8">
        <Award size={40} className="mb-5 text-[var(--color-lime)]" />
        <h3 className="text-sift-title font-semibold leading-tight tracking-[-0.035em]">You Mastered the 4 SIFT Moves!</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-paper-3)] sm:text-base">
          You made the optimal investigative move in{" "}
          <strong>{optimalCount} of 4</strong> scenario stages. By stopping
          emotional impulses, reading laterally, checking official domains, and
          tracing primary circulars, you successfully prevented a viral
          misinformation outbreak.
        </p>

        <div className="my-7 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {SIFT_SIMULATION.map((s) => {
            const h = history.find((x) => x.step === s.step);
            return (
              <div key={s.step} className="flex min-h-14 items-center gap-3 rounded-[var(--radius-input)] border border-[var(--color-paper-3)] px-3 py-2">
                <span className="font-[var(--font-outlier)] text-lg text-[var(--color-lime)]">{s.letter}</span>
                <span className="flex-1 text-sm font-medium">{s.name}</span>
                {h?.isOptimal ? (
                  <CheckCircle2 size={16} className="text-[var(--color-lime)]" />
                ) : (
                  <XCircle size={16} className="text-[var(--color-coral)]" />
                )}
              </div>
            );
          })}
        </div>

        <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-input)] bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-ink)] transition-colors hover:bg-[var(--color-accent-soft-ink)] focus-visible:outline-3 focus-visible:outline-[var(--color-lime)] focus-visible:outline-offset-2" onClick={handleReset} type="button">
          <RotateCcw size={14} /> Replay SIFT Simulation
        </button>
      </div>
    );
  }

  const selectedOption = step.userOptions.find(
    (o) => o.id === selectedOptionId,
  );

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-paper-3)] p-5 text-[var(--color-paper)] sm:p-8" aria-live="polite">
      {/* Step Tracker Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--color-paper-3)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          {SIFT_SIMULATION.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isDone = idx < currentStepIndex;
            return (
              <div
                key={s.step}
                className={`flex min-h-12 items-center gap-2 rounded-[var(--radius-input)] border px-3 py-2 ${
                  isCurrent
                    ? "border-[var(--color-lime)] bg-[var(--color-lime)] text-[var(--color-ink)]"
                    : isDone
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                      : "border-[var(--color-paper-3)] text-[var(--color-paper-3)]"
                }`}
              >
                <span className="font-[var(--font-outlier)] text-sm font-semibold">{s.letter}</span>
                <span className="min-w-0 text-xs font-medium leading-tight sm:text-sm">{s.name}</span>
              </div>
            );
          })}
        </div>
        <span className="inline-flex min-h-9 shrink-0 items-center gap-2 self-start rounded-full border border-[var(--color-paper-3)] px-3 py-2 font-mono text-xs sm:self-auto">
          <Sparkles size={12} /> Interactive Lab
        </span>
      </div>

      {/* Scenario Stage */}
      <div className="pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h4 className="max-w-3xl text-sift-title font-semibold leading-tight tracking-[-0.025em]">{step.objective}</h4>
          <span className="font-mono text-xs text-[var(--color-paper-3)]">Move {step.letter} / objective</span>
        </div>

        <div className="my-5 border-l-2 border-[var(--color-lime)] bg-[var(--color-paper)] p-4 text-[var(--color-ink)] sm:p-5">
          <p className="text-sm leading-relaxed sm:text-base">{step.scenarioPrompt}</p>
        </div>

        <div className="space-y-3">
          <span className="mb-3 block text-sm text-[var(--color-paper-3)]">Choose your move:</span>
          {step.userOptions.map((opt) => {
            const isChosen = selectedOptionId === opt.id;
            const isAnswered = selectedOptionId !== null;

            let optClass =
              "flex min-h-14 w-full items-center gap-3 rounded-[var(--radius-input)] border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-3 focus-visible:outline-[var(--color-lime)] focus-visible:outline-offset-2";
            if (isAnswered) {
              if (opt.isOptimal)
                optClass +=
                  " border-[var(--color-success)] bg-[var(--color-accent-soft)] text-[var(--color-accent-soft-ink)]";
              else if (isChosen)
                optClass +=
                  " border-[var(--color-coral)] bg-[var(--color-coral)] text-[var(--color-ink)]";
              else
                optClass +=
                  " border-[var(--color-paper-3)] text-[var(--color-paper-3)] opacity-60";
            } else {
              optClass +=
                " border-[var(--color-paper-3)] text-[var(--color-paper)] hover:border-[var(--color-lime)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60";
            }

            return (
              <button
                key={opt.id}
                className={optClass}
                aria-label={opt.text}
                disabled={isAnswered}
                onClick={() => handleSelect(opt.id)}
                type="button"
              >
                <span className={`h-4 w-4 shrink-0 rounded-full border ${
                  isAnswered && opt.isOptimal
                    ? "border-[var(--color-success)] bg-[var(--color-success)]"
                    : isAnswered && isChosen
                      ? "border-[var(--color-coral-ink)] bg-[var(--color-coral-ink)]"
                      : "border-current"
                }`} />
                <span>{opt.shortText || opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Card */}
        {selectedOption && (
          <div
            className={`mt-6 rounded-[var(--radius-card)] border p-5 sm:p-6 ${
              selectedOption.isOptimal
                ? "border-[var(--color-success)] bg-[var(--color-accent-soft)] text-[var(--color-accent-soft-ink)]"
                : "border-[var(--color-coral)] bg-[var(--color-paper-2)] text-[var(--color-ink)]"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {selectedOption.isOptimal ? (
                <>
                  <ShieldCheck size={20} className="text-[var(--color-success)]" />
                  <strong>Optimal Move!</strong>
                </>
              ) : (
                <>
                  <HelpCircle size={20} className="text-[var(--color-coral-ink)]" />
                  <strong>Common Cognitive Trap:</strong>
                </>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed">{selectedOption.feedback}</p>
            <div className="mt-4 border-t border-[var(--color-rule)] pt-4 text-sm leading-relaxed">
              <strong>Forensic insight:</strong> {selectedOption.insight}
            </div>

            <div className="mt-5">
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-input)] bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-ink)] transition-colors hover:bg-[var(--color-accent-soft-ink)] focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
                onClick={handleNext}
                type="button"
              >
                Continue to Move{" "}
                {currentStepIndex < 3
                  ? SIFT_SIMULATION[currentStepIndex + 1].letter
                  : "Summary"}{" "}
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
