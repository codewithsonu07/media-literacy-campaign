"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeHeadline } from "../lib/analysis-engine";
import { Flame, ArrowRight, ShieldCheck } from "lucide-react";

const QUICK_TESTS = [
  "SHOCKING: Secret spice cures diabetes in 48 hours!",
  "NASA telescope detects organic molecules on exoplanet.",
  "Opposition leader SLAMS government in furious debate!",
];

export default function HomeScanner() {
  const [input, setInput] = useState(QUICK_TESTS[0]);
  const [result, setResult] = useState(() => analyzeHeadline(QUICK_TESTS[0]));

  function handleScan(text: string) {
    setInput(text);
    setResult(analyzeHeadline(text));
  }

  return (
    <div className="rounded-sift-card border border-sift-paper-2 bg-sift-paper-2/80 p-sift-md backdrop-blur-xl sm:p-sift-lg">
      <div className="mb-sift-md flex flex-wrap items-center gap-sift-sm">
        <span className="text-sift-small font-semibold text-sift-ink">Live linguistic scanner</span>
        <span className="rounded-sift-pill border border-sift-rule bg-sift-paper-2 px-sift-sm py-1 text-xs text-sift-muted">Interactive Demo</span>
      </div>

      <div className="border-b border-sift-rule pb-sift-md">
        <input
          aria-label="Headline for live analysis"
          type="text"
          value={input}
          onChange={(e) => handleScan(e.target.value)}
          placeholder="Test any headline..."
          className="min-h-12 w-full rounded-sift-input border border-sift-muted bg-sift-paper px-sift-md text-sift-body text-sift-ink placeholder:text-sift-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
        />
        <div className="mt-sift-sm flex flex-wrap items-center gap-sift-xs">
          <span className="mr-1 w-full text-sift-small font-medium text-sift-muted sm:w-auto">Quick examples:</span>
          {QUICK_TESTS.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleScan(t)}
              type="button"
              aria-pressed={input === t}
              className={`min-h-11 rounded-sift-pill border px-sift-sm py-2 text-sift-small font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent motion-reduce:transition-none ${
                input === t
                  ? "border-sift-accent bg-sift-accent text-sift-accent-ink"
                  : "border-sift-rule bg-sift-paper-2 text-sift-ink-2 hover:border-sift-accent hover:bg-sift-accent-soft"
              }`}
            >
              {idx === 0 ? "Health" : idx === 1 ? "Science" : "Politics"}
            </button>
          ))}
        </div>
      </div>

      {/* Live Result Gauge Bar */}
      <div className="mt-sift-md grid grid-cols-1 divide-y divide-sift-rule border-y border-sift-rule sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        <div className="min-w-0 bg-sift-paper-2 p-sift-md">
          <span className="text-sift-small font-medium text-sift-muted">Sensationalism Score</span>
          <div className="mt-sift-xs flex flex-wrap items-center gap-sift-xs">
            <Flame
              size={18}
              className={
                result.sensationalismScore > 50
                  ? "text-[var(--color-coral-ink)]"
                  : "text-sift-accent"
              }
            />
            <strong className="text-sift-title font-bold tracking-tight text-sift-ink">{result.sensationalismScore} / 100</strong>
            <span
              className={`rounded-sift-pill px-sift-xs py-1 text-xs font-semibold ${
                result.sensationalismScore > 50
                  ? "bg-sift-coral/15 text-[var(--color-coral-ink)]"
                  : "bg-sift-accent-soft text-sift-accent-soft-ink"
              }`}
            >
              {result.sensationalismLevel}
            </span>
          </div>
        </div>

        <div className="min-w-0 bg-sift-paper-2 p-sift-md">
          <span className="text-sift-small font-medium text-sift-muted">Verification Risk</span>
          <div className="mt-sift-xs flex items-center gap-sift-xs">
            <ShieldCheck size={18} className="shrink-0 text-sift-accent" />
            <strong className="text-sift-body font-bold text-sift-ink">{result.credibilityRisk}</strong>
          </div>
        </div>

        <div className="min-w-0 bg-sift-paper-2 p-sift-md">
          <span className="text-sift-small font-medium text-sift-muted">Linguistic Red Flags</span>
          <div className="mt-sift-xs flex items-center gap-sift-xs">
            <strong className="text-sift-body font-bold text-sift-ink">{result.flags.length} terms flagged</strong>
          </div>
        </div>
      </div>

      <div className="mt-sift-md flex flex-col items-start gap-sift-md border-t border-sift-rule pt-sift-md sm:flex-row sm:items-center sm:justify-between">
        <span className="max-w-[34rem] text-sift-small leading-6 text-sift-ink-2">
          <strong className="font-semibold text-sift-ink">Objective Reframe:</strong> “{result.neutralReframe}”
        </span>
        <Link className="inline-flex min-h-12 shrink-0 items-center justify-center gap-sift-xs rounded-sift-input bg-sift-accent px-sift-md py-sift-sm text-sift-small font-semibold text-sift-accent-ink transition-colors hover:bg-sift-accent-soft-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sift-accent motion-reduce:transition-none" href={`/checker`}>
          Full analysis <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
