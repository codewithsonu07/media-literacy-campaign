// Headline & Claim Linguistic Analysis Engine
// Evaluates sensationalism, emotional triggers, attribution quality, and manipulation risk vectors.

export interface EmotionalTrigger {
  name: string;
  intensity: "low" | "medium" | "high";
  score: number;
  matchedWords: string[];
  description: string;
}

export interface LinguisticFlag {
  term: string;
  category: "Emotional Trigger" | "Absolute Claim" | "Urgency / Pressure" | "Weasel Attribution" | "Loaded Verb" | "Clickbait Hook";
  start: number;
  end: number;
  explanation: string;
  severity: "high" | "medium" | "low";
}

export interface ManipulationVector {
  name: string;
  score: number; // 0-100
  level: "Low" | "Moderate" | "Elevated" | "Critical";
  description: string;
}

export interface ManipulationRiskReport {
  overallScore: number; // 0-100
  tier: "Low wording signals" | "Some wording signals" | "Elevated wording signals" | "Many wording signals";
  primaryTactic: string;
  targetVulnerability: string;
  emotionalTemperature: "Cold / Academic" | "Neutral / Sober" | "Warm / Subjective" | "Heated / Outraged" | "Volatile / Crisis";
  vectors: {
    cognitiveExploitation: ManipulationVector;
    attributionObfuscation: ManipulationVector;
    linguisticDistortion: ManipulationVector;
    contextSplicingRisk: ManipulationVector;
    viralityEngineering: ManipulationVector;
  };
  detectedTactics: {
    name: string;
    description: string;
    countermove: string;
  }[];
}

export interface AnalysisReport {
  rawHeadline: string;
  cleanedHeadline: string;
  sensationalismScore: number; // 0-100
  sensationalismLevel: "Low wording signal" | "Moderate wording signal" | "High wording signal" | "Very high wording signal";
  credibilityRisk: "Low Risk" | "Caution Warranted" | "High Verification Needed" | "Extreme Red Flags";
  credibilityScore: number; // 0-100 (higher = more measured/grounded)
  framingType: "Informative / Neutral" | "Sensationalized" | "Speculative / Unverified" | "Emotionally Charged";
  manipulationRisk: ManipulationRiskReport;
  flags: LinguisticFlag[];
  emotionalTriggers: EmotionalTrigger[];
  attribution: {
    status: "Attributed to Specific Entity" | "Vague / Weasel Words" | "No Attribution (Direct Assertion)" | "Anonymous Sources";
    detail: string;
    identifiedSources: string[];
  };
  capsRatio: number;
  punctuationFlags: string[];
  neutralReframe: string;
  verificationSteps: {
    move: "S" | "I" | "F" | "T";
    label: string;
    instruction: string;
    searchQuery: string;
  }[];
  factCheckLinks: {
    name: string;
    url: string;
    purpose: string;
  }[];
}

const EMOTIONAL_WORDS: Record<string, { category: string; description: string; severity: "high" | "medium" | "low" }> = {
  // Shock & Outrage
  shocking: { category: "Emotional Trigger", description: "Sensationalized framing designed to prompt reflex sharing.", severity: "high" },
  disaster: { category: "Emotional Trigger", description: "Catastrophic wording that may exaggerate real-world impact.", severity: "high" },
  scandal: { category: "Emotional Trigger", description: "Sensationalist framing prioritizing controversy over facts.", severity: "high" },
  outrage: { category: "Emotional Trigger", description: "Emotional appeal targeting moral indignation.", severity: "high" },
  horrifying: { category: "Emotional Trigger", description: "Fear-inducing adjective intended to bypass critical evaluation.", severity: "high" },
  furious: { category: "Emotional Trigger", description: "Emotion-laden description framing reactions in extremes.", severity: "medium" },
  slams: { category: "Loaded Verb", description: "Hyperbolic tabloid verb replacing nuanced political criticism.", severity: "medium" },
  blasts: { category: "Loaded Verb", description: "Violent conflict metaphor used routinely for routine disagreements.", severity: "medium" },
  destroys: { category: "Loaded Verb", description: "Extreme hyperbole common in partisan and clickbait media.", severity: "high" },
  eviscerates: { category: "Loaded Verb", description: "Aggressive rhetorical verb designed to stimulate tribal cheering.", severity: "high" },
  humiliated: { category: "Loaded Verb", description: "Loaded psychological framing designed to belittle.", severity: "medium" },
  
  // Mystery & Conspiratorial
  secret: { category: "Clickbait Hook", description: "Appeals to conspiracy theory and exclusive forbidden knowledge.", severity: "high" },
  exposed: { category: "Clickbait Hook", description: "Implies hidden malfeasance before evidence has been established.", severity: "high" },
  unbelievable: { category: "Emotional Trigger", description: "Superlative expression signaling exaggerated narrative.", severity: "medium" },
  miracle: { category: "Absolute Claim", description: "Health/science hyperbole; legitimate science rarely claims miracles.", severity: "high" },
  cure: { category: "Absolute Claim", description: "Absolute medical claim; requires clinical peer-reviewed verification.", severity: "high" },
  proven: { category: "Absolute Claim", description: "Premature assertion of scientific certainty without study details.", severity: "medium" },
  guaranteed: { category: "Absolute Claim", description: "Commercial or promotional certainty rarely found in objective reporting.", severity: "high" },
  quietly: { category: "Clickbait Hook", description: "Implies covert or sinister intent behind ordinary administrative processes.", severity: "medium" },
  they: { category: "Weasel Attribution", description: "Vague adversarial collective often used in paranoid or clickbait narratives.", severity: "medium" },
  refuse: { category: "Loaded Verb", description: "Implies deliberate institutional suppression without substantiation.", severity: "high" },
  leaked: { category: "Clickbait Hook", description: "Promotes an impression of clandestine revelation to bypass standard scrutiny.", severity: "medium" },
  
  // Absolutes
  all: { category: "Absolute Claim", description: "Totalizing word that omits nuance, exceptions, and variations.", severity: "medium" },
  every: { category: "Absolute Claim", description: "Sweeping generalization that rarely holds across large systems.", severity: "medium" },
  never: { category: "Absolute Claim", description: "Total exclusion; high probability of over-simplification.", severity: "medium" },
  always: { category: "Absolute Claim", description: "Broad generalization that eliminates real-world conditions.", severity: "medium" },
  nobody: { category: "Absolute Claim", description: "Exclusionary claim designed to create an illusion of suppression.", severity: "medium" },
  everyone: { category: "Absolute Claim", description: "Manufactured consensus (bandwagon fallacy).", severity: "medium" },
  
  // Urgency
  breaking: { category: "Urgency / Pressure", description: "Urgency cue prompting quick reaction before verification.", severity: "medium" },
  urgent: { category: "Urgency / Pressure", description: "Pressure word to bypass deliberate second-thought.", severity: "high" },
  warning: { category: "Urgency / Pressure", description: "Alarmist framing prompting immediate emotional defense.", severity: "medium" },
  now: { category: "Urgency / Pressure", description: "Temporal compression creating artificial panic.", severity: "low" },
  immediately: { category: "Urgency / Pressure", description: "Call-to-action language unusual in purely informative journalism.", severity: "high" },
  alert: { category: "Urgency / Pressure", description: "Emergency framing that warrants checking original regulatory wires.", severity: "medium" },
  panic: { category: "Emotional Trigger", description: "High-intensity trigger intended to provoke irrational defensive reflexes.", severity: "high" },
  
  // Weasel words & Vague Attribution
  experts: { category: "Weasel Attribution", description: "Vague collective authority without specifying names, credentials, or consensus.", severity: "medium" },
  insiders: { category: "Weasel Attribution", description: "Anonymous attribution impossible for readers to evaluate independently.", severity: "high" },
  sources: { category: "Weasel Attribution", description: "Unspecified source; verify whether primary documents are linked.", severity: "medium" },
  report: { category: "Weasel Attribution", description: "Reference to an unnamed report; trace the original author and publisher.", severity: "low" },
  viral: { category: "Clickbait Hook", description: "Uses social media momentum as a substitute for factual accuracy.", severity: "medium" }
};

export function analyzeHeadline(headline: string): AnalysisReport {
  const text = headline.trim();
  const lower = text.toLowerCase();
  
  // 1. Find Linguistic Matches
  const flags: LinguisticFlag[] = [];
  const words = text.split(/\s+/);
  
  for (const [key, meta] of Object.entries(EMOTIONAL_WORDS)) {
    const keyLower = key.toLowerCase();
    let searchPos = 0;
    while (searchPos < lower.length) {
      const idx = lower.indexOf(keyLower, searchPos);
      if (idx === -1) break;
      
      const end = idx + keyLower.length;
      const charBefore = idx === 0 ? " " : lower[idx - 1];
      const charAfter = end === lower.length ? " " : lower[end];
      
      const isWordBoundary = !/[a-z0-9]/i.test(charBefore) && !/[a-z0-9]/i.test(charAfter);
      
      if (isWordBoundary) {
        flags.push({
          term: text.slice(idx, end),
          category: meta.category as LinguisticFlag["category"],
          start: idx,
          end,
          explanation: meta.description,
          severity: meta.severity
        });
      }
      searchPos = end;
    }
  }

  // Sort flags by position and deduplicate
  flags.sort((a, b) => a.start - b.start);
  const cleanFlags = flags.filter((item, index) => index === 0 || item.start >= flags[index - 1].end);

  // 2. Structural & Typography Analysis
  const lettersOnly = text.replace(/[^a-zA-Z]/g, "");
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const capsRatio = lettersOnly.length > 0 ? capsCount / lettersOnly.length : 0;
  
  const punctuationFlags: string[] = [];
  if (text.includes("?!") || text.includes("!?")) punctuationFlags.push("Interrobang (?!) signaling exaggerated disbelief");
  if ((text.match(/!{2,}/g) || []).length > 0) punctuationFlags.push("Multiple exclamation marks (sensationalist punctuation)");
  if ((text.match(/\?{2,}/g) || []).length > 0) punctuationFlags.push("Multiple question marks (speculative agitation)");
  if (capsRatio > 0.45 && lettersOnly.length > 10) punctuationFlags.push("Heavy ALL-CAPS usage (simulated shouting / panic)");

  // 3. Emotional Triggers Scoring
  const angerWords = cleanFlags.filter(f => ["slams", "blasts", "destroys", "eviscerates", "outrage", "furious"].includes(f.term.toLowerCase()));
  const fearWords = cleanFlags.filter(f => ["shocking", "disaster", "warning", "horrifying", "danger", "deadly", "panic"].includes(f.term.toLowerCase()));
  const curiosityWords = cleanFlags.filter(f => ["secret", "exposed", "unbelievable", "miracle", "quietly", "leaked", "refuse"].includes(f.term.toLowerCase()));
  const urgencyWords = cleanFlags.filter(f => ["breaking", "urgent", "immediately", "now", "alert"].includes(f.term.toLowerCase()));

  const emotionalTriggers: EmotionalTrigger[] = [
    {
      name: "Moral Outrage / Conflict",
      intensity: angerWords.length > 1 ? "high" : angerWords.length === 1 ? "medium" : "low",
      score: Math.min(100, angerWords.length * 40),
      matchedWords: angerWords.map(w => w.term),
      description: "Uses conflict-laden words to provoke tribal defensiveness or moral anger."
    },
    {
      name: "Fear & Threat Perception",
      intensity: fearWords.length > 1 ? "high" : fearWords.length === 1 ? "medium" : "low",
      score: Math.min(100, fearWords.length * 45),
      matchedWords: fearWords.map(w => w.term),
      description: "Triggers survival alarmism, discouraging rational evidence evaluation."
    },
    {
      name: "Curiosity Gap / Forbidden Knowledge",
      intensity: curiosityWords.length > 1 ? "high" : curiosityWords.length === 1 ? "medium" : "low",
      score: Math.min(100, curiosityWords.length * 35),
      matchedWords: curiosityWords.map(w => w.term),
      description: "Hints at hidden or suppressed information to force reflex clicks."
    },
    {
      name: "Manufactured Urgency",
      intensity: urgencyWords.length > 1 ? "high" : urgencyWords.length === 1 ? "medium" : "low",
      score: Math.min(100, urgencyWords.length * 30),
      matchedWords: urgencyWords.map(w => w.term),
      description: "Pressures reader to share quickly before verifying context."
    }
  ];

  // 4. Attribution Quality
  const foundSources: string[] = [];
  let attributionStatus: AnalysisReport["attribution"]["status"] = "No Attribution (Direct Assertion)";
  let attributionDetail = "No explicit source attribution was detected. A named organization does not by itself show who verified the claim.";

  if (/(anonymous sources|unnamed sources|sources say|insiders claim|experts reveal|allegedly|rumors)/i.test(lower)) {
    attributionStatus = "Vague / Weasel Words";
    attributionDetail = "Uses ambiguous authorities ('sources', 'insiders') that cannot be scrutinized or cross-referenced.";
  } else {
    const sourceMatch = text.match(/\baccording to\s+([^,.;:!?]+)/i) ?? text.match(/\b(reuters|associated press|ap news|pib|who|un|nasa|isro|bbc|the hindu|nature|lancet)\s+(?:reports?|says?|confirms?|finds?|announces?)\b/i);
    const source = sourceMatch?.[1]?.trim();
    if (source) {
      attributionStatus = "Attributed to Specific Entity";
      attributionDetail = `The headline explicitly attributes the claim to "${source}". Verify the original source and its supporting evidence.`;
      foundSources.push(source);
    }
  }

  // 5. Sensationalism Score (0 to 100)
  let rawScore = 0;
  rawScore += cleanFlags.length * 14;
  if (capsRatio > 0.4) rawScore += 25;
  if (punctuationFlags.length > 0) rawScore += punctuationFlags.length * 15;
  
  const sensationalismScore = Math.max(5, Math.min(98, Math.round(rawScore)));

  let sensationalismLevel: AnalysisReport["sensationalismLevel"] = "Low wording signal";
  if (sensationalismScore >= 70) sensationalismLevel = "Very high wording signal";
  else if (sensationalismScore >= 45) sensationalismLevel = "High wording signal";
  else if (sensationalismScore >= 25) sensationalismLevel = "Moderate wording signal";

  // Credibility Score (Inverse of sensationalism with attribution bonus)
  let credScore = 100 - sensationalismScore;
  if (attributionStatus === "Attributed to Specific Entity") credScore = Math.min(95, credScore + 15);
  if (attributionStatus === "Vague / Weasel Words") credScore = Math.max(10, credScore - 15);
  
  let credibilityRisk: AnalysisReport["credibilityRisk"] = "Low Risk";
  if (credScore < 30) credibilityRisk = "Extreme Red Flags";
  else if (credScore < 55) credibilityRisk = "High Verification Needed";
  else if (credScore < 75) credibilityRisk = "Caution Warranted";

  // Framing classification
  let framingType: AnalysisReport["framingType"] = "Informative / Neutral";
  if (sensationalismScore > 65) framingType = "Sensationalized";
  else if (attributionStatus === "Vague / Weasel Words") framingType = "Speculative / Unverified";
  else if (angerWords.length > 0 || fearWords.length > 0) framingType = "Emotionally Charged";

  // 6. DEEP MANIPULATION RISK ANALYSIS
  // Calculate specific manipulation vector scores (0-100)
  const cognitiveScore = Math.min(100, (angerWords.length * 35) + (fearWords.length * 40));
  const attributionScore = attributionStatus === "Vague / Weasel Words" ? 85 : 0;
  const linguisticScore = Math.min(100, (cleanFlags.filter(f => f.category === "Absolute Claim" || f.category === "Loaded Verb").length * 30) + (capsRatio > 0.4 ? 30 : 0));
  const contextScore = (text.includes("?") || punctuationFlags.length > 0 || /secret|quietly|refuse/i.test(lower)) ? 75 : 20;
  const viralityScore = Math.min(100, (urgencyWords.length * 40) + (curiosityWords.length * 35) + (punctuationFlags.length * 15));

  const overallManipScore = Math.max(8, Math.min(96, Math.round(
    (cognitiveScore * 0.3) +
    (attributionScore * 0.2) +
    (linguisticScore * 0.2) +
    (contextScore * 0.15) +
    (viralityScore * 0.15)
  )));

  function getVectorLevel(score: number): "Low" | "Moderate" | "Elevated" | "Critical" {
    if (score >= 70) return "Critical";
    if (score >= 45) return "Elevated";
    if (score >= 25) return "Moderate";
    return "Low";
  }

  let manipTier: ManipulationRiskReport["tier"] = "Low wording signals";
  if (overallManipScore >= 75) manipTier = "Many wording signals";
  else if (overallManipScore >= 50) manipTier = "Elevated wording signals";
  else if (overallManipScore >= 25) manipTier = "Some wording signals";

  let primaryTactic = "Informational / Standard Wire Reporting";
  let targetVulnerability = "General public seeking straightforward factual developments.";
  const detectedTactics: ManipulationRiskReport["detectedTactics"] = [];

  if (fearWords.length > 0 || /cure|miracle|deadly|danger/i.test(lower)) {
    primaryTactic = "Fear-Mongering & Health Vulnerability Exploitation";
    targetVulnerability = "Targets individuals anxious about physical health or medical expenses with false certainty.";
    detectedTactics.push({
      name: "Appeal to Health Anxiety & Miracle Solution",
      description: "Promises an immediate, effortless solution to complex medical ailments while villainizing mainstream medical professionals.",
      countermove: "Search the claim on PubMed or Google Scholar with keywords like 'clinical trial' and 'peer-reviewed meta-analysis'."
    });
  } else if (angerWords.length > 0) {
    primaryTactic = "Rage-Bait & Tribal Grievance Escalation";
    targetVulnerability = "Targets partisan identity and political frustration, forcing readers to pick sides emotionally.";
    detectedTactics.push({
      name: "Rage-Bait Conflict Framing",
      description: "Substitutes nuanced institutional debates with violent rhetorical verbs ('slams', 'destroys') to induce moral outrage.",
      countermove: "Seek primary unedited transcripts of the debate rather than commentator highlight reels."
    });
  } else if (/secret|quietly|refuse|they/i.test(lower)) {
    primaryTactic = "Conspiracy Curiosity Gap & Institution Discrediting";
    targetVulnerability = "Exploits natural human distrust of authority and desire for exclusive, insider knowledge.";
    detectedTactics.push({
      name: "Clandestine Suppression Framing",
      description: "Claims 'they' are deliberately hiding or 'quietly' passing rules to bypass standard civic scrutiny.",
      countermove: "Check public gazettes, ministry press releases, or official legislative records."
    });
  } else if (urgencyWords.length > 0) {
    primaryTactic = "Manufactured Crisis & FOMO Acceleration";
    targetVulnerability = "Pressures immediate sharing by creating artificial urgency before logic can evaluate.";
    detectedTactics.push({
      name: "Artificial Urgency Trigger",
      description: "Frames everyday administrative or seasonal updates as sudden, shocking breaking alerts.",
      countermove: "Pause 30 seconds. Real emergency advisories are broadcast simultaneously on official government portals."
    });
  }

  let emotionalTemp: ManipulationRiskReport["emotionalTemperature"] = "Neutral / Sober";
  if (angerWords.length > 0 && fearWords.length > 0) emotionalTemp = "Volatile / Crisis";
  else if (angerWords.length > 0 || sensationalismScore > 65) emotionalTemp = "Heated / Outraged";
  else if (sensationalismScore > 35) emotionalTemp = "Warm / Subjective";
  else if (attributionStatus === "Attributed to Specific Entity") emotionalTemp = "Cold / Academic";

  const manipulationRisk: ManipulationRiskReport = {
    overallScore: overallManipScore,
    tier: manipTier,
    primaryTactic,
    targetVulnerability,
    emotionalTemperature: emotionalTemp,
    vectors: {
      cognitiveExploitation: {
        name: "Cognitive & Affective Exploitation",
        score: cognitiveScore,
        level: getVectorLevel(cognitiveScore),
        description: "Exploits amygdala reflexes (rage, dread, or existential panic) to bypass deliberate thought."
      },
      attributionObfuscation: {
        name: "Attribution Obfuscation",
        score: attributionScore,
        level: getVectorLevel(attributionScore),
        description: "Conceals who originated the assertion by using passive voice or vague authority collectives."
      },
      linguisticDistortion: {
        name: "Linguistic Hyperbole & Absolutes",
        score: linguisticScore,
        level: getVectorLevel(linguisticScore),
        description: "Uses totalizing qualifiers ('every', 'never', 'miracle') and loaded partisan rhetoric."
      },
      contextSplicingRisk: {
        name: "Context Splicing & Insinuation",
        score: contextScore,
        level: getVectorLevel(contextScore),
        description: "Employs suspicious punctuation, rhetorical questions, and insinuations to lead readers to unproven conclusions."
      },
      viralityEngineering: {
        name: "Virality & Pressure Engineering",
        score: viralityScore,
        level: getVectorLevel(viralityScore),
        description: "Pressures immediate reposting via artificial urgency cues, FOMO, and alarmist deadlines."
      }
    },
    detectedTactics
  };

  // 7. Neutral Reframe Generator
  let reframed = text;
  reframed = reframed.replace(/^(breaking|urgent|shocking|exclusive|exposed)[:!-]\s*/i, "");
  reframed = reframed.replace(/^(breaking news|must watch|watch)[:!-]\s*/i, "");
  reframed = reframed.replace(/\b(slams|blasts|eviscerates)\b/gi, "criticizes");
  reframed = reframed.replace(/\b(destroys)\b/gi, "rebuts");
  reframed = reframed.replace(/\b(miracle|shocking|unbelievable)\b/gi, "notable");
  reframed = reframed.replace(/\b(secret plan|secret spice)\b/gi, "ingredient");
  reframed = reframed.replace(/!{1,}/g, ".");
  reframed = reframed.replace(/\?{2,}/g, "?");
  
  if (capsRatio > 0.5) {
    reframed = reframed.charAt(0).toUpperCase() + reframed.slice(1).toLowerCase();
  }
  reframed = reframed.trim();
  if (!reframed.endsWith(".") && !reframed.endsWith("?")) {
    reframed += ".";
  }
  const neutralReframe = reframed !== text ? reframed : `Objective framing: ${text}`;

  // 8. Core Entities for Fact Checking Queries
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "to", "for", "in", "on", "of", "and", "or", "breaking", "urgent", "shocking"]);
  const coreKeywords = words
    .map(w => w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
    .filter(w => w.length > 3 && !stopWords.has(w))
    .slice(0, 5)
    .join(" ");

  const cleanQuery = encodeURIComponent(coreKeywords || text);

  const factCheckLinks = [
    {
      name: "Google Fact Check Explorer",
      url: `https://toolbox.google.com/factcheck/explorer/search/list?hl=en&query=${cleanQuery}`,
      purpose: "Searches verified IFCN claims across international fact-checkers"
    },
    {
      name: "Google News Primary Search",
      url: `https://news.google.com/search?q=${cleanQuery}`,
      purpose: "Check if credible mainstream wire services are reporting this story"
    },
    {
      name: "Alt News (India Fact Check)",
      url: `https://www.altnews.in/?s=${cleanQuery}`,
      purpose: "Specialized in debunking regional misinformation, doctored videos, and viral rumors"
    },
    {
      name: "BOOM Live",
      url: `https://www.boomlive.in/search?q=${cleanQuery}`,
      purpose: "Independent fact-checking organization verifying political, health, and social media claims"
    },
    {
      name: "PIB Fact Check (Official)",
      url: `https://factcheck.pib.gov.in/`,
      purpose: "Official verification channel for government policies, circulars, and national advisories"
    },
    {
      name: "Snopes Fact Archive",
      url: `https://www.snopes.com/search/${cleanQuery}/`,
      purpose: "Global archive of urban legends, viral claims, and internet hoaxes"
    }
  ];

  const verificationSteps = [
    {
      move: "S" as const,
      label: "STOP (Check Your Reaction)",
      instruction: overallManipScore > 50
        ? `Manipulation Risk is ${overallManipScore}/100 (${manipTier}). Notice any rapid emotional impulse (anger, fear, urgency) before clicking or forwarding.`
        : "Pause for 5 seconds. Even measured headlines may omit necessary caveats.",
      searchQuery: ""
    },
    {
      move: "I" as const,
      label: "INVESTIGATE THE SOURCE",
      instruction: attributionStatus === "Attributed to Specific Entity"
        ? `Verify the original outlet: Did "${foundSources[0] || "the source"}" actually publish this, or is an impostor domain copying their name?`
        : "Who wrote or published this? Check the 'About Us' page and search the domain name on Wikipedia to assess reputation.",
      searchQuery: `${coreKeywords} source origin`
    },
    {
      move: "F" as const,
      label: "FIND BETTER COVERAGE",
      instruction: "Read laterally. Open 2 other tabs to check if established news organizations (Reuters, AP, The Hindu, BBC) corroborate this story with independent evidence.",
      searchQuery: `${coreKeywords} news coverage`
    },
    {
      move: "T" as const,
      label: "TRACE TO THE ORIGINAL CONTEXT",
      instruction: "Find the primary source: Locate the unedited speech video, court filing, or peer-reviewed academic DOI instead of relying on a commentator's summary.",
      searchQuery: `${coreKeywords} original document report`
    }
  ];

  return {
    rawHeadline: text,
    cleanedHeadline: text,
    sensationalismScore,
    sensationalismLevel,
    credibilityScore: Math.round(credScore),
    credibilityRisk,
    framingType,
    manipulationRisk,
    flags: cleanFlags,
    emotionalTriggers,
    attribution: {
      status: attributionStatus,
      detail: attributionDetail,
      identifiedSources: foundSources
    },
    capsRatio: Math.round(capsRatio * 100),
    punctuationFlags,
    neutralReframe,
    verificationSteps,
    factCheckLinks
  };
}

export const SAMPLE_HEADLINES = [
  {
    category: "Health Misinformation",
    badge: "Medical Myth",
    text: "SHOCKING: Secret spice cures diabetes in 48 hours but doctors refuse to tell you!"
  },
  {
    category: "Financial Panic",
    badge: "Clickbait Alarm",
    text: "BREAKING: Government quietly approves immediate tax on all student bank accounts!"
  },
  {
    category: "Political Hyperbole",
    badge: "Loaded Rhetoric",
    text: "Opposition leader SLAMS government, DESTROYS minister in furious debate!"
  },
  {
    category: "Science Journalism",
    badge: "Objective / Measured",
    text: "NASA's James Webb Telescope detects carbon-bearing molecules on habitable-zone exoplanet."
  },
  {
    category: "Civic Announcement",
    badge: "Institutional Record",
    text: "Ministry of Railways announces revised timetable for suburban express services starting Monday."
  },
  {
    category: "AI & Synthetic Media",
    badge: "Deepfake Hoax",
    text: "LEAKED VIDEO: Celebrity confesses to secret underground organization in viral clip!"
  }
];
