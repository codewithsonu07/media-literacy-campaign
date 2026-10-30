import assert from "node:assert/strict";
import test from "node:test";
import { analyzeHeadline } from "./analysis-engine.ts";

test("an ordinary unattributed headline does not imply attribution risk", () => {
  const report = analyzeHeadline("City council approves its annual budget.");

  assert.equal(report.attribution.status, "No Attribution (Direct Assertion)");
  assert.equal(report.manipulationRisk.vectors.attributionObfuscation.score, 0);
  assert.equal(report.manipulationRisk.tier, "Low wording signals");
});

test("a publisher name is attribution only when the headline attributes a claim", () => {
  const mentioned = analyzeHeadline("The council discussed Reuters coverage today.");
  const attributed = analyzeHeadline("Reuters reports the council approved its budget.");

  assert.equal(mentioned.attribution.status, "No Attribution (Direct Assertion)");
  assert.equal(attributed.attribution.status, "Attributed to Specific Entity");
  assert.deepEqual(attributed.attribution.identifiedSources, ["Reuters"]);
});

test("attribution does not change the sensational wording score", () => {
  const direct = analyzeHeadline("Council approves a shocking new budget.");
  const attributed = analyzeHeadline("According to the council, it approved a shocking new budget.");

  assert.equal(attributed.attribution.status, "Attributed to Specific Entity");
  assert.equal(attributed.sensationalismScore, direct.sensationalismScore);
});

test("vague attribution is identified separately from no attribution", () => {
  const report = analyzeHeadline("Insiders claim the council approved its annual budget.");

  assert.equal(report.attribution.status, "Vague / Weasel Words");
  assert.equal(report.manipulationRisk.vectors.attributionObfuscation.score, 85);
});