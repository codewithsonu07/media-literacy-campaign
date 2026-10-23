"use client";

import { useState } from "react";


interface OutletFraming {
  id: string;
  source: string;
  biasType: "Sensationalist Tabloid" | "Corporate Slanted" | "Objective Wire Service";
  headline: string;
  loadedWords: string[];
  neutralityScore: number;
  narrativeGoal: string;
  tone: string;
}

const FRAMINGS: OutletFraming[] = [
  {
    id: "tabloid",
    source: "Daily Viral Alert",
    biasType: "Sensationalist Tabloid",
    headline: "INFLATION PANIC: Business owners SLAM catastrophic wage hike as economic disaster looms!",
    loadedWords: ["PANIC", "SLAM", "catastrophic", "disaster looms"],
    neutralityScore: 18,
    narrativeGoal: "Maximizes fear and alarm to capture quick social media clicks.",
    tone: "Alarmist / High Outrage"
  },
  {
    id: "corporate",
    source: "Financial Opinion Post",
    biasType: "Corporate Slanted",
    headline: "Struggling small enterprises crushed by reckless new bureaucratic payroll mandate.",
    loadedWords: ["crushed", "reckless", "bureaucratic payroll mandate"],
    neutralityScore: 38,
    narrativeGoal: "Frames a labor policy exclusively through employer burden while omitting worker benefit.",
    tone: "Selectively Grievance-Oriented"
  },
  {
    id: "objective",
    source: "AP / Reuters",
    biasType: "Objective Wire Service",
    headline: "Government approves 5% minimum wage increase following annual cost-of-living review.",
    loadedWords: [],
    neutralityScore: 96,
    narrativeGoal: "Reports the factual action, numerical scale, and institutional justification with zero emotive adjectives.",
    tone: "Neutral / Informative"
  }
];

export default function BiasComparator() {
  const [activeId, setActiveId] = useState<string>("tabloid");

  const current = FRAMINGS.find((f) => f.id === activeId) || FRAMINGS[0];

  return (
    <div className="overflow-hidden rounded-sift-card border border-sift-rule bg-sift-paper-2">
      <div className="flex flex-col gap-sift-md border-b border-sift-rule p-sift-md sm:p-sift-lg lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[32rem]">
          <h3 className="font-sift-display text-sift-title font-bold leading-snug tracking-[-0.025em] text-sift-ink">Interactive media framing: compare three versions of one event</h3>
        </div>
        <div className="flex flex-wrap gap-sift-xs" role="group" aria-label="Choose a framing example">
          {FRAMINGS.map((f) => (
            <button
              key={f.id}
              className={`inline-flex min-h-11 items-center justify-center rounded-sift-pill border px-sift-md py-sift-xs text-sift-small font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent motion-reduce:transition-none ${
                activeId === f.id
                  ? "border-sift-ink bg-sift-ink text-sift-paper-2"
                  : "border-sift-rule bg-sift-paper-2 text-sift-ink-2 hover:border-sift-accent hover:bg-sift-accent-soft"
              }`}
              onClick={() => setActiveId(f.id)}
              type="button"
              aria-pressed={activeId === f.id}
            >
              {f.source}
            </button>
          ))}
        </div>
      </div>

      <div className="p-sift-md sm:p-sift-lg lg:p-sift-xl">
        <div className="flex flex-wrap items-center justify-between gap-sift-sm">
          <span className={`inline-flex min-h-8 items-center rounded-sift-pill px-sift-sm py-1 text-sift-small font-semibold ${
            current.id === "tabloid"
              ? "bg-sift-coral/15 text-[var(--color-coral-ink)]"
              : current.id === "corporate"
                ? "bg-sift-paper-3 text-sift-ink-2"
                : "bg-sift-accent-soft text-sift-accent-soft-ink"
          }`}>
            {current.biasType}
          </span>
          <span className="text-sift-small text-sift-muted">
            Neutrality Index: <strong className="ml-sift-xs font-semibold text-sift-ink">{current.neutralityScore}%</strong>
          </span>
        </div>

        <blockquote className="my-sift-lg border-l-2 border-sift-accent pl-sift-md font-sift-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-sift-ink sm:my-sift-xl sm:pl-sift-lg sm:text-3xl lg:text-4xl">
          “{current.headline}”
        </blockquote>

        <div className="grid grid-cols-1 gap-sift-lg border-t border-sift-rule pt-sift-lg md:grid-cols-3 md:gap-sift-lg">
          <div>
            <span className="text-sift-small font-semibold text-sift-accent">Narrative Framing:</span>
            <p className="mt-sift-xs text-sift-small leading-6 text-sift-ink-2">{current.narrativeGoal}</p>
          </div>
          <div>
            <span className="text-sift-small font-semibold text-sift-accent">Emotional Tone:</span>
            <p className="mt-sift-xs text-sift-small leading-6 text-sift-ink-2">{current.tone}</p>
          </div>
          <div>
            <span className="text-sift-small font-semibold text-sift-accent">Loaded Language:</span>
            <div className="mt-sift-xs flex flex-wrap gap-sift-xs">
              {current.loadedWords.length > 0 ? (
                current.loadedWords.map((w) => (
                  <span key={w} className="inline-flex min-h-8 items-center rounded-sift-pill border border-sift-rule bg-sift-paper px-sift-sm py-1 text-sift-small font-medium text-sift-ink-2">
                    {w}
                  </span>
                ))
              ) : (
                <span className="text-sift-small font-semibold text-sift-accent-soft-ink">
                  ✓ None detected (Neutral vocabulary)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
