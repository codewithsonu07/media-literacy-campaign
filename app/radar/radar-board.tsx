"use client";

import { useEffect, useState } from "react";
import { CLAIM_TOPICS } from "../lib/radar-types";
import type { ClaimTopic } from "../lib/radar-types";
import type { PublicClaimCard } from "../lib/radar-types";

function isSafeSource(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const source = value as Record<string, unknown>;
  if (
    typeof source.url !== "string" ||
    typeof source.summary !== "string"
  ) {
    return false;
  }
  try {
    const url = new URL(source.url);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isPublicClaimCard(value: unknown): value is PublicClaimCard {
  if (typeof value !== "object" || value === null) return false;
  const card = value as Record<string, unknown>;
  const validSourceUrl =
    card.source_url === null ||
    (typeof card.source_url === "string" &&
      isSafeSource({ url: card.source_url, summary: "" }));
  const validDates =
    typeof card.submitted_at === "string" &&
    !Number.isNaN(Date.parse(card.submitted_at)) &&
    typeof card.reviewed_at === "string" &&
    !Number.isNaN(Date.parse(card.reviewed_at));
  return (
    typeof card.id === "string" &&
    typeof card.claim === "string" &&
    validSourceUrl &&
    validDates &&
    typeof card.topic === "string" &&
    CLAIM_TOPICS.includes(card.topic as (typeof CLAIM_TOPICS)[number]) &&
    typeof card.card_title === "string" &&
    typeof card.evidence_summary === "string" &&
    typeof card.bias_notes === "string" &&
    typeof card.sift_prompt === "string" &&
    Array.isArray(card.sources) &&
    card.sources.every(isSafeSource)
  );
}

export default function RadarBoard() {
  const [cards, setCards] = useState<PublicClaimCard[]>([]);
  const [topic, setTopic] = useState<ClaimTopic | "All topics">("All topics");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const query =
          topic === "All topics" ? "" : `?topic=${encodeURIComponent(topic)}`;
        const response = await fetch(`/api/radar${query}`, {
          signal: controller.signal,
        });
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message =
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof payload.error === "string"
              ? payload.error
              : "The Claim Radar could not be loaded.";
          throw new Error(message);
        }
        if (!Array.isArray(payload) || !payload.every(isPublicClaimCard)) {
          throw new Error("The Claim Radar returned an invalid response.");
        }
        setCards(payload);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The Claim Radar could not be loaded.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [topic]);

  if (isLoading) {
    return (
      <p className="text-sm text-sift-muted" role="status">
        Loading reviewed investigations...
      </p>
    );
  }
  if (error) {
    return (
      <p
        className="rounded-sift-input border border-sift-coral px-4 py-3 text-sm text-sift-ink"
        role="alert"
      >
        {error}
      </p>
    );
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-sift-muted">
          {cards.length} reviewed investigation{cards.length === 1 ? "" : "s"}
        </p>
        <label className="flex items-center gap-2 text-sm font-semibold text-sift-ink">
          Filter by topic
          <select
            className="min-h-10 rounded-sift-input border border-sift-rule bg-sift-paper-2 px-3 text-sm font-normal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
            onChange={(event) => {
              setError("");
              setIsLoading(true);
              setTopic(event.target.value as ClaimTopic | "All topics");
            }}
            value={topic}
          >
            <option>All topics</option>
            {CLAIM_TOPICS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      {cards.length === 0 ? (
        <div className="rounded-sift-card border border-dashed border-sift-rule bg-sift-paper-2 p-6">
          <h2 className="font-sift-display text-sift-title font-semibold text-sift-ink">
            No reviewed investigations in this topic yet.
          </h2>
          <p className="mt-2 text-sm leading-6 text-sift-ink-2">
            Student reports stay private while campaign editors review them. No
            claim appears here until its learning card is ready.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {cards.map((card) => (
            <article
              className="flex flex-col rounded-sift-card border border-sift-rule bg-sift-paper-2 p-5 sm:p-7"
              key={card.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-sift-pill bg-sift-accent-soft px-3 py-1 text-xs font-semibold text-sift-accent-soft-ink">
                  {card.topic}
                </span>
                <time
                  className="text-xs text-sift-muted"
                  dateTime={card.reviewed_at}
                >
                  Reviewed{" "}
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(card.reviewed_at))}
                </time>
              </div>

              <h2 className="mt-4 font-sift-display text-xl font-semibold tracking-tight text-sift-ink sm:text-2xl">
                {card.card_title}
              </h2>
              <blockquote className="mt-4 border-l-2 border-sift-coral pl-4 text-sm leading-6 text-sift-ink-2">
                {card.claim}
              </blockquote>

              <div className="mt-5 space-y-4 text-sm leading-6">
                <section>
                  <h3 className="font-semibold text-sift-ink">
                    What the evidence shows
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap text-sift-ink-2">
                    {card.evidence_summary}
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-sift-ink">
                    Framing to notice
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap text-sift-ink-2">
                    {card.bias_notes}
                  </p>
                </section>
              </div>

              <section className="mt-5 border-t border-sift-rule pt-4">
                <h3 className="text-sm font-semibold text-sift-ink">
                  Read the sources
                </h3>
                <ul className="mt-2 space-y-2">
                  {card.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        className="text-sm font-semibold text-sift-accent underline underline-offset-2"
                        href={source.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {new URL(source.url).hostname}
                      </a>
                      {source.summary && (
                        <p className="mt-1 text-xs leading-5 text-sift-muted">
                          {source.summary}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <p className="mt-auto border-t border-sift-rule pt-4 text-sm font-medium leading-6 text-sift-ink">
                SIFT prompt: {card.sift_prompt}
              </p>
              <p className="mt-3 text-xs leading-5 text-sift-muted">
                This educational review is not a definitive fact-check.
                “Unverified” does not mean false; open the linked sources and
                assess the evidence.
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
