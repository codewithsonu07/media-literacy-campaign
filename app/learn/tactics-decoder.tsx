"use client";

import { useState } from "react";
import { DISINFORMATION_TACTICS } from "../lib/learn-data";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Flame,
  Globe,
  History,
  Scale,
  Shield,
  Sparkles,
} from "lucide-react";

export default function TacticsDecoder() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("rage-farming");

  const categories = [
    "All",
    "Psychological Hooks",
    "Media & AI Manipulation",
    "Context & Data Distortion",
  ];

  const filteredTactics =
    selectedCategory === "All"
      ? DISINFORMATION_TACTICS
      : DISINFORMATION_TACTICS.filter((t) => t.category === selectedCategory);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function getIcon(name: string) {
    switch (name) {
      case "Flame":
        return <Flame size={18} className="text-[var(--color-coral-ink)]" />;
      case "History":
        return <History size={18} className="text-[var(--color-accent)]" />;
      case "Sparkles":
        return <Sparkles size={18} className="text-[var(--color-success)]" />;
      case "Globe":
        return <Globe size={18} className="text-[var(--color-coral-ink)]" />;
      case "BarChart3":
        return <BarChart3 size={18} className="text-[var(--color-accent)]" />;
      case "Scale":
        return <Scale size={18} className="text-[var(--color-success)]" />;
      default:
        return <AlertTriangle size={18} className="text-[var(--color-coral-ink)]" />;
    }
  }

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter disinformation tactics">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`min-h-10 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 ${
              selectedCategory === cat
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            }`}
            onClick={() => setSelectedCategory(cat)}
            type="button"
          >
            {cat === "Psychological Hooks"
              ? "Psychology"
              : cat === "Media & AI Manipulation"
                ? "Media"
                : cat === "Context & Data Distortion"
                  ? "Context"
                  : cat === "All"
                    ? `All (${DISINFORMATION_TACTICS.length})`
                    : cat}
          </button>
        ))}
      </div>

      {/* Grid of Tactics Cards */}
      <div className="grid gap-3 lg:grid-cols-2">
        {filteredTactics.map((tactic) => {
          const isExpanded = expandedId === tactic.id;
          return (
            <article
              key={tactic.id}
              className={`rounded-[var(--radius-card)] border p-5 sm:p-6 ${
                isExpanded
                  ? "border-[var(--color-accent)] bg-[var(--color-paper-2)]"
                  : "border-[var(--color-rule)] bg-[var(--color-paper)]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)]">
                  {getIcon(tactic.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-tight tracking-[-0.025em]">
                    <button
                      className="rounded-sm whitespace-nowrap text-left hover:text-[var(--color-accent)] focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2"
                      aria-label={tactic.name}
                      aria-expanded={isExpanded}
                      onClick={() => toggleExpand(tactic.id)}
                      type="button"
                    >
                      {tactic.shortName}
                    </button>
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs leading-relaxed text-[var(--color-muted)]">{tactic.category}</span>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-xs ${
                        tactic.severity === "Critical"
                          ? "border-[var(--color-coral)] text-[var(--color-coral-ink)]"
                          : tactic.severity === "High"
                            ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                            : "border-[var(--color-rule)] text-[var(--color-muted)]"
                      }`}
                    >
                      {tactic.severity} risk
                    </span>
                  </div>
                </div>
                <button
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2"
                  aria-label={
                    isExpanded ? "Collapse details" : "Expand details"
                  }
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpand(tactic.id)}
                  type="button"
                >
                  {isExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{tactic.summary}</p>

              {isExpanded && (
                <div className="mt-5 space-y-4 border-t border-[var(--color-rule)] pt-5">
                  <div>
                    <strong className="text-sm font-semibold">The Psychological Mechanism:</strong>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-2)]">{tactic.howItWorks}</p>
                  </div>

                  <div className="border-l-2 border-[var(--color-coral)] pl-4">
                    <strong className="text-sm font-semibold">Real-World Example in the Wild:</strong>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">“{tactic.realWorldExample}”</p>
                  </div>

                  <div className="rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-[var(--color-accent)]" />
                      <strong className="text-sm font-semibold">SIFT Forensic Countermeasure:</strong>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-2)]">{tactic.countermeasure}</p>
                    <div className="mt-4 border-l-2 border-[var(--color-success)] pl-3 text-sm font-medium leading-relaxed text-[var(--color-success)]">{tactic.siftTip}</div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
