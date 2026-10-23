// Educational data and interactive SIFT simulator content for the Learn page

export interface DisinformationTactic {
  id: string;
  name: string;
  shortName: string;
  category:
    | "Psychological Hooks"
    | "Media & AI Manipulation"
    | "Context & Data Distortion";
  severity: "Critical" | "High" | "Moderate";
  iconName: string;
  summary: string;
  howItWorks: string;
  realWorldExample: string;
  countermeasure: string;
  siftTip: string;
}

export const DISINFORMATION_TACTICS: DisinformationTactic[] = [
  {
    id: "rage-farming",
    name: "Rage Farming (Outrage Bait)",
    shortName: "Rage farming",
    category: "Psychological Hooks",
    severity: "Critical",
    iconName: "Flame",
    summary:
      "Deliberately framing stories around moral grievances because moral outrage spreads 200% faster on social feeds than informative news.",
    howItWorks:
      "Algorithms reward comments and quote-retweets. Bad actors craft posts highlighting an injustice (often exaggerated or fictional) to ignite tribal defense reflexes, bypassing critical evaluation.",
    realWorldExample:
      "Headlines like 'School BANNING historic book while giving kids X!' where the book was merely shifted to a different reading list.",
    countermeasure:
      "When a post makes your pulse quicken or blood boil, recognize the emotional cue. Do not share or argue in the comments until you verify the primary policy document.",
    siftTip:
      "Move S (STOP): Strong emotion is the earliest signal that your attention is being monetized.",
  },
  {
    id: "cheapfakes",
    name: "Cheapfakes (Recycled Media)",
    shortName: "Cheapfakes",
    category: "Media & AI Manipulation",
    severity: "Critical",
    iconName: "History",
    summary:
      "Re-using genuine, unaltered old photographs or video footage but slapping a brand new date, location, or conflict label on them.",
    howItWorks:
      "No AI or Photoshop is needed. A real 2016 explosion in Beirut is posted during a 2024 conflict with the caption 'BREAKING RIGHT NOW'. Because the video is real footage, viewers instinctively believe the timestamp.",
    realWorldExample:
      "Viral video of storm clouds captioned 'Hurricane hitting Miami yesterday' which was actually an old CGI art loop from 2019.",
    countermeasure:
      "Perform a Google Reverse Image Search or run keyframes through TinEye / InVID to find the earliest date the video appeared on the internet.",
    siftTip:
      "Move T (TRACE): Find the earliest instance of the media before accepting the current caption.",
  },
  {
    id: "deepfakes-ai",
    name: "Synthetic Media & Deepfakes",
    shortName: "Synthetic media",
    category: "Media & AI Manipulation",
    severity: "High",
    iconName: "Sparkles",
    summary:
      "AI-generated voices, manipulated facial clones, or synthetic images constructed using diffusion and neural rendering models.",
    howItWorks:
      "Generative tools create audio clones from just 3 seconds of reference audio, producing convincing robocall voice memos of politicians or fake crisis photographs.",
    realWorldExample:
      "Viral audio clip of a mayoral candidate allegedly confessing to rigging municipal votes hours before the election.",
    countermeasure:
      "Listen for unnatural breathing cadence, inspect fingers, ear reflections, and background typography. More importantly, verify if accredited news organizations independently corroborate the recording.",
    siftTip:
      "Move F (FIND BETTER COVERAGE): A genuine political confession is covered by all major wires, not just anonymous Telegram channels.",
  },
  {
    id: "impostor-domains",
    name: "Impostor Domains (Typosquatting)",
    shortName: "Impostor domains",
    category: "Context & Data Distortion",
    severity: "High",
    iconName: "Globe",
    summary:
      "Creating clone websites that mimic reputable news organizations using deceptive URLs (e.g., `theguardian-news.co` or `bbc.ltd`).",
    howItWorks:
      "Scammers clone the CSS styling, logo, and layout of a major newspaper. They insert one fake fabricated story amongst real headlines so readers glancing at the design assume it is authentic.",
    realWorldExample:
      "A fake website styled exactly like a government health portal publishing a false announcement about mandated school closures.",
    countermeasure:
      "Check the exact domain in the address bar. Look for `.co`, missing hyphens, extra suffixes, or search Wikipedia to see what the verified official URL is.",
    siftTip:
      "Move I (INVESTIGATE THE SOURCE): Never rely on page appearance alone. Look up the domain reputation in an independent browser tab.",
  },
  {
    id: "cherry-picking",
    name: "Cherry-Picking & Truncated Data",
    shortName: "Cherry-picked data",
    category: "Context & Data Distortion",
    severity: "Moderate",
    iconName: "BarChart3",
    summary:
      "Selecting isolated data points or starting a graph axis at an abnormal baseline to visually exaggerate a microscopic change into a giant leap.",
    howItWorks:
      "A graph with a Y-axis running from 48% to 51% makes a 1% shift look like a 500% spike. Or, selecting a single cold day to argue against decades of climate temperature trends.",
    realWorldExample:
      "Graphs comparing quarterly economic metrics that slice out historical averages to manufacture the appearance of collapse.",
    countermeasure:
      "Inspect the axis baselines: Does the Y-axis start at zero? What is the multi-year trajectory? What is the sample size?",
    siftTip:
      "Move T (TRACE): Download the primary survey or census table rather than relying on an infographic screenshot.",
  },
  {
    id: "false-balance",
    name: "False Balance (Bothsidesism)",
    shortName: "False balance",
    category: "Context & Data Distortion",
    severity: "Moderate",
    iconName: "Scale",
    summary:
      "Giving equal broadcast time or credibility to fringe conspiracies alongside 99.8% peer-reviewed scientific consensus.",
    howItWorks:
      "In the name of 'neutrality', a broadcast features one climate scientist representing thousands of studies debating one industry lobbyist, giving viewers the false impression that scientific opinion is 50/50 divided.",
    realWorldExample:
      "Presenting unproven alternative wellness claims on equal footing with randomized controlled clinical trials.",
    countermeasure:
      "Ask: What does the broad institutional consensus say? Look for systematic reviews and meta-analyses over single contrarian spokespersons.",
    siftTip:
      "Move F (FIND BETTER COVERAGE): Check consensus statements from peak bodies like the National Academy of Sciences or WHO.",
  },
];

export interface SiftStepSimulation {
  step: "S" | "I" | "F" | "T";
  letter: string;
  name: string;
  objective: string;
  scenarioPrompt: string;
  userOptions: {
    id: string;
    text: string;
    shortText?: string;
    isOptimal: boolean;
    feedback: string;
    insight: string;
  }[];
}

export const SIFT_SIMULATION: SiftStepSimulation[] = [
  {
    step: "S",
    letter: "S",
    name: "STOP",
    objective:
      "Recognize your physiological and emotional impulse before acting.",
    scenarioPrompt:
      "You are scrolling your feed during exam season. A post shouts: 'LEAKED CIRCULAR: Final semester board exams CANCELLED nationwide due to infrastructure audit! Schedule revised to next summer.' Your heart immediately leaps with sudden surprise and relief. What is your very first move?",
    userOptions: [
      {
        id: "s-1",
        text: "Forward it immediately to your classroom study group so nobody studies for tomorrow's test.",
        shortText: "Forward",
        isOptimal: false,
        feedback:
          "Impulse Forwarding Hazard! You just accelerated the spread of an unverified rumor during a high-stakes exam period.",
        insight:
          "Disinformation targets periods of stress. When emotion is high, our critical cognitive filters shut down.",
      },
      {
        id: "s-2",
        text: "Pause for 10 seconds. Notice the burst of relief, and decide not to repost or share anything until you verify.",
        shortText: "Pause",
        isOptimal: true,
        feedback:
          "Perfect Stop Move! You broke the viral chain reaction by taking cognitive control over emotional reflex.",
        insight:
          "Stopping gives your prefrontal cortex time to engage before algorithmic viral momentum takes over.",
      },
      {
        id: "s-3",
        text: "Comment 'Is this real??' under the post to ask other commenters.",
        shortText: "Comment",
        isOptimal: false,
        feedback:
          "Algorithmic Boost Trap! Commenting signals high engagement to social media algorithms, boosting the post to thousands more users.",
        insight:
          "Questioning in comments amplifies reach. Instead of commenting, investigate quietly in a separate tab.",
      },
    ],
  },
  {
    step: "I",
    letter: "I",
    name: "INVESTIGATE THE SOURCE",
    objective:
      "Evaluate the creator's identity, credentials, and institutional domain.",
    scenarioPrompt:
      "The post includes a link: 'www.national-exam-board.co.in/circular-89'. The website banner features the national emblem and standard navy-blue colors. How do you evaluate whether this source is authentic?",
    userOptions: [
      {
        id: "i-1",
        text: "Trust it because the national emblem looks crisp and the layout looks like a government portal.",
        shortText: "Trust design",
        isOptimal: false,
        feedback:
          "Surface Visual Fallacy! Any web developer or scammer can copy-paste a logo and CSS style in 5 minutes.",
        insight:
          "Professional styling is no longer a proxy for truth. Aesthetics are easily forged.",
      },
      {
        id: "i-2",
        text: "Open a fresh tab, search for the official examination board on Google or Wikipedia, and compare the official domain extension (`.gov.in` vs `.co.in`).",
        shortText: "Check domain",
        isOptimal: true,
        feedback:
          "Spot On! You discovered that official educational boards end in `.gov.in` or `.nic.in`, while `.co.in` is a privately registered commercial domain.",
        insight:
          "Lateral reading (searching outside the site) always beats vertical reading (inspecting the site's own claims).",
      },
      {
        id: "i-3",
        text: "Read the site's 'About Us' page to see if they state they are official.",
        shortText: "About page",
        isOptimal: false,
        feedback:
          "Self-Attribution Trap! A deceptive website will naturally write a deceptive 'About Us' page.",
        insight:
          "Never trust a suspect site to evaluate itself. Always ask: What do trusted outside authorities say about it?",
      },
    ],
  },
  {
    step: "F",
    letter: "F",
    name: "FIND BETTER COVERAGE",
    objective:
      "Cross-check the claim against independent, established reporting wires.",
    scenarioPrompt:
      "If a nationwide board exam cancellation were real, how would the broader media ecosystem reflect this event?",
    userOptions: [
      {
        id: "f-1",
        text: "Check if your favorite influencer or meme page has mentioned it in their stories.",
        shortText: "Check influencer",
        isOptimal: false,
        feedback:
          "Echo Chamber Risk! Influencers often scrape viral rumors from the same unverified feeds to generate fast clicks.",
        insight:
          "Aggregators and influencers are secondary redistributors, not independent newsgatherers.",
      },
      {
        id: "f-2",
        text: "Open Google News or Reuters / PTI and search for 'exam board cancellation'. Check if major national newspapers are reporting it.",
        shortText: "Check wires",
        isOptimal: true,
        feedback:
          "Master Move! You discover zero major news outlets have reported any cancellation. Instead, PIB Fact Check has already flagged this exact circular as FAKE.",
        insight:
          "National emergencies and policy shifts receive blanket coverage by hundreds of journalists. Silence across credible wires is proof of a hoax.",
      },
      {
        id: "f-3",
        text: "Search Twitter hashtags to see how many people are tweeting about it.",
        shortText: "Search tags",
        isOptimal: false,
        feedback:
          "Popularity Fallacy! Trending hashtags are easily manipulated by coordinated bot swarms and panicked students.",
        insight:
          "High volume does not equal high truth. 100,000 people repeating an unverified rumor are still repeating a rumor.",
      },
    ],
  },
  {
    step: "T",
    letter: "T",
    name: "TRACE TO THE ORIGINAL CONTEXT",
    objective:
      "Follow quotes, statistics, and circular numbers back to the primary source.",
    scenarioPrompt:
      "The fake post mentions: 'Ref: Circular No. CBSE/2024/EXAM-99'. You want to trace where this document originated. How do you find the unedited truth?",
    userOptions: [
      {
        id: "t-1",
        text: "Go directly to the official government board portal (e.g., `cbse.gov.in`), check the public 'Press Releases' archive, and search for circular 99.",
        shortText: "Search archive",
        isOptimal: true,
        feedback:
          "Investigation Complete! You locate Circular 99 on the real government portal: it is an ordinary notice about sports equipment procurement from 6 months ago. The text was photoshopped!",
        insight:
          "Tracing to the primary archive gives you conclusive, primary proof that closes the investigation.",
      },
      {
        id: "t-2",
        text: "Download the PDF from the social media forward and zoom in on the signature.",
        shortText: "Inspect PDF",
        isOptimal: false,
        feedback:
          "Inconclusive Inspection! Digital signatures and stamp images can easily be pasted onto fraudulent PDFs.",
        insight:
          "Examining an isolated document in a silo cannot confirm whether the institution issued it. Primary archives are the gold standard.",
      },
    ],
  },
];
