"use client";

import { FormEvent, useState } from "react";
import { CLAIM_TOPICS, type ClaimTopic } from "../lib/radar-types";
import TurnstileWidget from "../lib/turnstile-widget";

interface ClaimSubmissionFormProps {
  siteKey: string;
}

export default function ClaimSubmissionForm({
  siteKey,
}: ClaimSubmissionFormProps) {
  const [claim, setClaim] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [topic, setTopic] = useState<ClaimTopic>("Other");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, sourceUrl, topic, turnstileToken }),
      });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("message" in result) ||
        typeof result.message !== "string"
      ) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Your report could not be submitted.";
        throw new Error(message);
      }

      setClaim("");
      setSourceUrl("");
      setTopic("Other");
      setSuccess(result.message);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Your report could not be submitted.",
      );
    } finally {
      setIsSubmitting(false);
      setTurnstileToken("");
      setChallengeKey((key) => key + 1);
    }
  }

  return (
    <form
      className="space-y-5 rounded-sift-card border border-sift-rule bg-sift-paper-2 p-5 sm:p-7"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          className="block text-sm font-semibold text-sift-ink"
          htmlFor="claim"
        >
          What claim or headline did you see?
        </label>
        <textarea
          className="mt-2 min-h-32 w-full rounded-sift-input border border-sift-rule bg-sift-paper px-4 py-3 text-sm leading-6 text-sift-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
          id="claim"
          maxLength={500}
          minLength={10}
          onChange={(event) => setClaim(event.target.value)}
          placeholder="Describe the claim in your own words. Avoid names or private message contents."
          required
          value={claim}
        />
        <p className="mt-1 text-right text-xs text-sift-muted">
          {claim.length} / 500 characters
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className="block text-sm font-semibold text-sift-ink"
            htmlFor="topic"
          >
            Topic
          </label>
          <select
            className="mt-2 min-h-11 w-full rounded-sift-input border border-sift-rule bg-sift-paper px-3 text-sm text-sift-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
            id="topic"
            onChange={(event) => setTopic(event.target.value as ClaimTopic)}
            value={topic}
          >
            {CLAIM_TOPICS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-semibold text-sift-ink"
            htmlFor="source-url"
          >
            Public source link <span className="font-normal">(optional)</span>
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-sift-input border border-sift-rule bg-sift-paper px-3 text-sm text-sift-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
            id="source-url"
            maxLength={2048}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder="https://..."
            type="url"
            value={sourceUrl}
          />
        </div>
      </div>

      <p className="text-sm leading-6 text-sift-muted">
        Reports are private until a campaign editor reviews them. Please do not
        include personal details, private messages, or confidential material.
        Submitting does not mean the claim is false.
      </p>

      {siteKey && (
        <TurnstileWidget
          key={challengeKey}
          action="submission"
          onError={setError}
          onToken={setTurnstileToken}
          siteKey={siteKey}
        />
      )}

      {error && (
        <p className="rounded-sift-input border border-sift-coral px-3 py-2 text-sm text-sift-ink" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-sift-input border border-sift-accent px-3 py-2 text-sm text-sift-ink" role="status">
          {success}
        </p>
      )}

      <button
        className="inline-flex min-h-12 items-center justify-center rounded-sift-input bg-sift-accent px-5 text-sm font-semibold text-sift-accent-ink transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Sending report..." : "Send for review"}
      </button>
    </form>
  );
}
