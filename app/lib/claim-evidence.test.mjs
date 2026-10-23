import assert from "node:assert/strict";
import test from "node:test";
import {
  applySourceAssessments,
  decideEvidence,
  normalizeSearchResults,
} from "./claim-evidence.ts";

test("normalizes safe Tavily results and removes duplicates and unsafe URLs", () => {
  const sources = normalizeSearchResults({
    results: [
      {
        title: "Report",
        url: "https://www.example.org/story#top",
        content: "A report about the claim.",
        score: 0.8,
        published_date: "2026-10-10",
      },
      {
        title: "Duplicate",
        url: "https://www.example.org/story?utm_source=test",
        content: "Duplicate result.",
        score: 0.9,
      },
      {
        title: "Unsafe",
        url: "http://unsafe.example/story",
        content: "Not accepted.",
        score: 1,
      },
    ],
  });

  assert.equal(sources.length, 1);
  assert.equal(sources[0].url, "https://www.example.org/story");
  assert.equal(sources[0].publisher, "example.org");
  assert.equal(sources[0].publishedDate, "2026-10-10");
});

test("only attaches assessments for sources returned by search", () => {
  const [source] = normalizeSearchResults({
    results: [
      {
        title: "Report",
        url: "https://news.example/report",
        content: "A report about the claim.",
        score: 0.8,
      },
    ],
  });
  const enriched = applySourceAssessments(
    [source],
    [
      {
        url: "https://invented.example/fake",
        summary: "Invented source",
        position: "Supports",
      },
      {
        url: source.url,
        summary: "The report directly discusses the claim.",
        position: "Supports",
      },
    ],
  );

  assert.equal(enriched[0].summary, "The report directly discusses the claim.");
  assert.equal(enriched[0].evidencePosition, "Supports");
  assert.equal(enriched.length, 1);
});

test("requires multiple independent relevant sources for a factual verdict", () => {
  const sources = normalizeSearchResults({
    results: [
      {
        title: "A",
        url: "https://news.publisher-a.com/x",
        content: "Evidence A",
        score: 0.8,
      },
      {
        title: "B",
        url: "https://sub.publisher-a.com/y",
        content: "Evidence B",
        score: 0.7,
      },
    ],
  }).map((source) => ({
    ...source,
    summary: "Relevant evidence",
    evidencePosition: "Supports",
  }));
  const sufficient = decideEvidence(sources, "corroborated", "Likely true");
  const conflicting = decideEvidence(sources, "mixed", "Likely true");

  assert.equal(sources[0].publisher, "publisher-a.com");
  assert.equal(sources[1].publisher, "publisher-a.com");
  assert.equal(sufficient.evidenceStrength, "Limited");
  assert.equal(sufficient.evidenceSufficient, false);
  assert.equal(sufficient.verdict, "Unverified");
  assert.equal(conflicting.evidenceSufficient, false);
  assert.equal(conflicting.verdict, "Unverified");
});

test("allows corroboration from multiple registrable domains", () => {
  const sources = normalizeSearchResults({
    results: [
      {
        title: "A",
        url: "https://news.publisher-a.com/x",
        content: "Evidence A",
        score: 0.8,
      },
      {
        title: "B",
        url: "https://publisher-b.org/y",
        content: "Evidence B",
        score: 0.7,
      },
    ],
  }).map((source) => ({
    ...source,
    summary: "Relevant evidence",
    evidencePosition: "Supports",
  }));

  const decision = decideEvidence(sources, "corroborated", "Likely true");
  assert.equal(decision.evidenceStrength, "Moderate");
  assert.equal(decision.evidenceSufficient, true);
  assert.equal(decision.verdict, "Likely true");
});

test("does not treat context-only sources as proof of a claim", () => {
  const sources = normalizeSearchResults({
    results: [
      {
        title: "A",
        url: "https://publisher-a.com/x",
        content: "Context A",
        score: 0.8,
      },
      {
        title: "B",
        url: "https://publisher-b.org/y",
        content: "Context B",
        score: 0.7,
      },
    ],
  }).map((source) => ({
    ...source,
    summary: "Provides background but does not verify the claim.",
    evidencePosition: "Context",
  }));

  const decision = decideEvidence(sources, "corroborated", "Likely true");
  assert.equal(decision.evidenceStrength, "Moderate");
  assert.equal(decision.evidenceSufficient, false);
  assert.equal(decision.verdict, "Unverified");
});
