"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

interface FlowNode {
  id: string;
  question: string;
  context: string;
  yesNext: string | "SAFE" | "UNVERIFIED" | "STOP_DONT_SHARE";
  noNext: string | "SAFE" | "UNVERIFIED" | "STOP_DONT_SHARE";
  yesLabel: string;
  noLabel: string;
}

const FLOW_NODES: Record<string, FlowNode> = {
  root: {
    id: "root",
    question:
      "1. Did the post trigger sudden intense emotion (anger, fear, or excitement)?",
    context:
      "Emotional triggers are intentional cues. High adrenaline suppresses rational scrutiny.",
    yesNext: "node-source",
    noNext: "node-source",
    yesLabel: "Yes, felt an immediate urge to share/react",
    noLabel: "No, read it calmly",
  },
  "node-source": {
    id: "node-source",
    question:
      "2. Can you identify who originated this story (specific named author or institution)?",
    context:
      "Look beyond the account handle: who actually conducted the research or spoke the quote?",
    yesNext: "node-domain",
    noNext: "STOP_DONT_SHARE",
    yesLabel: "Yes, names accredited agency or author",
    noLabel: "No, anonymous or 'insiders say'",
  },
  "node-domain": {
    id: "node-domain",
    question:
      "3. Did you verify the domain address outside the page (e.g. checked Wikipedia)?",
    context:
      "Impostor domains use `.co.in` or slight spelling variations to disguise fake publications.",
    yesNext: "node-wires",
    noNext: "UNVERIFIED",
    yesLabel: "Yes, confirmed legitimate official registry",
    noLabel: "No, only saw the website logo",
  },
  "node-wires": {
    id: "node-wires",
    question:
      "4. Do at least 2 independent news wires (Reuters, AP, PIB, BBC) report this?",
    context:
      "Major events or government policies are never exclusive to an anonymous viral account.",
    yesNext: "SAFE",
    noNext: "UNVERIFIED",
    yesLabel: "Yes, corroborated across independent wires",
    noLabel: "No, exclusive to viral social feeds",
  },
};

export default function DecisionFlowchart() {
  const [currentNodeId, setCurrentNodeId] = useState<string>("root");
  const [path, setPath] = useState<{ question: string; answer: string }[]>([]);

  const currentNode = FLOW_NODES[currentNodeId];
  const isTerminal = ["SAFE", "UNVERIFIED", "STOP_DONT_SHARE"].includes(
    currentNodeId,
  );

  function handleAnswer(choice: "yes" | "no") {
    if (!currentNode) return;
    const nextId = choice === "yes" ? currentNode.yesNext : currentNode.noNext;
    const answerLabel =
      choice === "yes" ? currentNode.yesLabel : currentNode.noLabel;

    setPath((prev) => [
      ...prev,
      { question: currentNode.question, answer: answerLabel },
    ]);
    setCurrentNodeId(nextId);
  }

  function handleReset() {
    setCurrentNodeId("root");
    setPath([]);
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-5 sm:p-8">
      <div className="mb-7 w-full min-w-0 max-w-3xl">
        <h3 className="text-sift-title font-semibold leading-tight tracking-[-0.035em]">Interactive decision: should I share this story?</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          Walk through the interactive verification matrix before hitting
          &ldquo;repost&rdquo; or forwarding to a group.
        </p>
      </div>

      {!isTerminal && currentNode ? (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-5 sm:p-7">
          <div className="border-l-2 border-[var(--color-accent)] pl-4 sm:pl-5">
            <h4 className="text-lg font-semibold leading-snug sm:text-xl">{currentNode.question}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{currentNode.context}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              className="flex min-h-14 items-center gap-3 rounded-[var(--radius-input)] border border-[var(--color-success)] bg-[var(--color-accent-soft)] px-4 py-3 text-left text-sm font-semibold text-[var(--color-accent-soft-ink)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-ink)] focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
              aria-label={currentNode.yesLabel}
              onClick={() => handleAnswer("yes")}
              type="button"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>
                {currentNode.id === "root"
                  ? "Yes"
                  : currentNode.id === "node-source"
                    ? "Named source"
                    : currentNode.id === "node-domain"
                      ? "Checked the domain"
                      : "Two or more reports"}
              </span>
            </button>
            <button
              className="flex min-h-14 items-center gap-3 rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3 text-left text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-coral)] hover:bg-[var(--color-paper-3)] focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
              aria-label={currentNode.noLabel}
              onClick={() => handleAnswer("no")}
              type="button"
            >
              <AlertOctagon size={16} className="shrink-0 text-[var(--color-coral-ink)]" />
              <span>
                {currentNode.id === "root"
                  ? "No"
                  : currentNode.id === "node-source"
                    ? "Anonymous source"
                    : currentNode.id === "node-domain"
                      ? "Only saw logo"
                      : "Only social posts"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-5 sm:p-7">
          {currentNodeId === "SAFE" && (
            <div className="border-l-2 border-[var(--color-success)] pl-4 sm:pl-5">
              <ShieldCheck size={32} className="mb-3 text-[var(--color-success)]" />
              <h4 className="text-xl font-semibold leading-tight">Verification Cleared: Safe to Share with Context</h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                The story has named primary attribution, a verified
                institutional domain, and independent corroboration. When
                sharing, link to the primary reporting wire rather than an
                editorialized social caption.
              </p>
            </div>
          )}

          {currentNodeId === "UNVERIFIED" && (
            <div className="border-l-2 border-[var(--color-accent)] pl-4 sm:pl-5">
              <HelpCircle size={32} className="mb-3 text-[var(--color-accent)]" />
              <h4 className="text-xl font-semibold leading-tight">Hold On: Claim is Currently Unverified</h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                Lack of independent confirmation or unknown domain credentials
                means this claim could be a rumor, outdated recycled media, or
                deliberate spin. Pause until established fact-checkers verify
                it.
              </p>
            </div>
          )}

          {currentNodeId === "STOP_DONT_SHARE" && (
            <div className="border-l-2 border-[var(--color-coral)] pl-4 sm:pl-5">
              <AlertOctagon size={32} className="mb-3 text-[var(--color-coral-ink)]" />
              <h4 className="text-xl font-semibold leading-tight">Red Flag Triggered: Do Not Share!</h4>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                Anonymous attribution and unverified sourcing are the hallmarks
                of viral disinformation. Forwarding this accelerates the spread
                of unverified claims and harms public trust.
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-[var(--color-rule)] pt-6">
            <h5 className="mb-4 text-sm font-semibold text-sift-muted">Your Decision Trail:</h5>
            <ul className="space-y-3">
              {path.map((item, idx) => (
                <li key={idx} className="grid gap-1 border-l border-[var(--color-rule)] pl-4 text-sm sm:grid-cols-[1fr_auto] sm:gap-5">
                  <strong className="font-medium leading-relaxed">{item.question}</strong>
                  <span className="text-[var(--color-muted)]">{item.answer}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-input)] bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-ink)] transition-colors hover:bg-[var(--color-accent-soft-ink)] focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
            onClick={handleReset}
            type="button"
          >
            <RotateCcw size={14} /> Test another post
          </button>
        </div>
      )}
    </div>
  );
}
