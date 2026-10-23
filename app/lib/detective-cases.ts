// Case studies and forensic simulation data for News Detective Lab

export interface ForensicCase {
  id: string;
  caseNumber: string;
  category: "Social Media Impersonation" | "Health Rumor / WhatsApp" | "Out-of-Context Media" | "Verified Journalism" | "Misleading Data & Graphs" | "AI Synthetic Media" | "Satire vs Disinformation" | "Selective Quotation";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  postType: "tweet" | "whatsapp" | "breaking-banner" | "chart" | "ai-image" | "quote-card";
  headline: string;
  author: {
    name: string;
    handle: string;
    isVerified: boolean;
    avatarInitials: string;
    accountAgeNote: string;
  };
  content: string;
  mediaNote?: string;
  metrics: {
    reposts: string;
    likes: string;
    comments: string;
  };
  simulatedForensics: {
    domainCheck: string;
    imageAudit: string;
    lateralWireCoverage: string;
  };
  clues: {
    id: string;
    label: string;
    target: "handle" | "media" | "url" | "timing" | "tone";
    hotspotTag: "USER_HANDLE" | "MEDIA_ATTACHMENT" | "TIMESTAMP_METRIC" | "HEADLINE_TONE";
    hint: string;
  }[];
  correctVerdict: "Fabricated / Hoax" | "Misleading Context" | "Manipulated Media" | "Legitimate Verified News" | "Satire / Parody";
  options: ("Fabricated / Hoax" | "Misleading Context" | "Manipulated Media" | "Legitimate Verified News" | "Satire / Parody")[];
  forensicDebrief: {
    summary: string;
    keyRedFlags: string[];
    siftMoveApplied: {
      letter: "S" | "I" | "F" | "T";
      step: string;
      actionTaken: string;
    };
    realWorldLesson: string;
  };
}

export const DETECTIVE_CASES: ForensicCase[] = [
  {
    id: "case-1",
    caseNumber: "CASE-801",
    category: "Social Media Impersonation",
    difficulty: "Beginner",
    postType: "tweet",
    headline: "Imminent Emergency Power Grid Shutdown",
    author: {
      name: "BBC Breaking News",
      handle: "@BBCNews_0ffcial",
      isVerified: true,
      avatarInitials: "BBC",
      accountAgeNote: "Account registered 3 days ago"
    },
    content: "URGENT: National grid failures reported across northern sector. Total blackout expected in 45 minutes across 8 states. Turn off major electrical appliances IMMEDIATELY.",
    metrics: {
      reposts: "14.2K",
      likes: "28.5K",
      comments: "3.1K"
    },
    simulatedForensics: {
      domainCheck: "WHOIS / Profile Check: Registered 72h ago via prepaid credit card. Official BBC feed is @BBCBreaking.",
      imageAudit: "No photo attached. Avatar uses cropped 2018 BBC logo without brand guidelines compliance.",
      lateralWireCoverage: "Zero corroborating coverage on Reuters, AP, Press Trust of India, or Ministry of Power emergency feeds."
    },
    clues: [
      {
        id: "clue-handle",
        label: "Inspect Handle Spelling",
        target: "handle",
        hotspotTag: "USER_HANDLE",
        hint: "Notice the spelling: '@BBCNews_0ffcial' uses the number '0' instead of 'O' and misspells 'official'. Impostor accounts buy blue checkmarks to mimic legitimate news wires."
      },
      {
        id: "clue-tone",
        label: "Tone & Urgency Hook",
        target: "tone",
        hotspotTag: "HEADLINE_TONE",
        hint: "Heavy use of ALL-CAPS ('IMMEDIATELY') and a 45-minute countdown clock are engineered to trigger panic reposts before lateral checking."
      },
      {
        id: "clue-timing",
        label: "Lateral Wire Check",
        target: "timing",
        hotspotTag: "TIMESTAMP_METRIC",
        hint: "A nationwide grid shutdown would be declared simultaneously by the Power Ministry and verified wire agencies (AP, Reuters, PIB), not solely an unconfirmed account."
      }
    ],
    correctVerdict: "Fabricated / Hoax",
    options: ["Fabricated / Hoax", "Misleading Context", "Manipulated Media", "Legitimate Verified News"],
    forensicDebrief: {
      summary: "This is a classic Impostor Account Hoax designed to induce public panic and harvest engagement.",
      keyRedFlags: [
        "Typo-squatted username with '0' for 'O' in '@BBCNews_0ffcial'",
        "Manufactured panic deadline ('in 45 minutes')",
        "Absence of corroborating emergency advisories on government or power authority channels"
      ],
      siftMoveApplied: {
        letter: "I",
        step: "Investigate the Source",
        actionTaken: "Search for the verified official account handle or look up the organization's verified domain website."
      },
      realWorldLesson: "Paid checkmarks mean an identity is verified to a credit card, NOT that the user is who they claim to be. Always inspect the exact letters in the handle."
    }
  },
  {
    id: "case-2",
    caseNumber: "CASE-802",
    category: "Health Rumor / WhatsApp",
    difficulty: "Beginner",
    postType: "whatsapp",
    headline: "Nighttime Radiation Water Warning",
    author: {
      name: "Forwarded Many Times",
      handle: "WhatsApp Viral Broadcast",
      isVerified: false,
      avatarInitials: "WA",
      accountAgeNote: "Forwarded message chain"
    },
    content: "🚨 CRITICAL HEALTH ADVISORY: World Health Organization (WHO) has issued emergency circular #4092. Tonight between 11:30 PM and 3:30 AM, cosmic radiation levels will peak. Do not drink tap water or keep phones near your bed. Forward to all family groups immediately to save lives!!",
    metrics: {
      reposts: "Viral Forward",
      likes: "Chain message",
      comments: "Shared across 100+ groups"
    },
    simulatedForensics: {
      domainCheck: "No link provided. Cites fictitious 'Circular #4092'. Official WHO portal has no advisory on cosmic tap-water radiation.",
      imageAudit: "Text-only broadcast with excessive alert emojis (🚨, ‼️).",
      lateralWireCoverage: "Debunked by Alt News, Snopes, and PIB Fact Check as an annual copypasta hoax circulating since 2014."
    },
    clues: [
      {
        id: "clue-weasel",
        label: "Anonymous Authority Code",
        target: "tone",
        hotspotTag: "HEADLINE_TONE",
        hint: "Cites 'WHO circular #4092' without a valid link or institutional document. Hoaxes often invent pseudo-official numbers to sound scientific."
      },
      {
        id: "clue-forward",
        label: "Double-Arrow Forwarded Tag",
        target: "timing",
        hotspotTag: "TIMESTAMP_METRIC",
        hint: "WhatsApp marks messages forwarded multiple times with a double-arrow icon, indicating mass automated propagation without primary attribution."
      },
      {
        id: "clue-science",
        label: "Scientific Plausibility",
        target: "media",
        hotspotTag: "MEDIA_ATTACHMENT",
        hint: "Cosmic rays do not selectively irradiate municipal tap water at scheduled hours between 11:30 PM and 3:30 AM."
      }
    ],
    correctVerdict: "Fabricated / Hoax",
    options: ["Fabricated / Hoax", "Misleading Context", "Manipulated Media", "Legitimate Verified News"],
    forensicDebrief: {
      summary: "A recurring copypasta rumor that resurfaces every year with minor date and organization alterations.",
      keyRedFlags: [
        "'Forwarded many times' viral broadcast with no author name or date",
        "Invented circular code (#4092) with no paper trail on who.int",
        "Classic panic call-to-action: 'Forward to all family groups immediately'"
      ],
      siftMoveApplied: {
        letter: "T",
        step: "Trace to the Original Context",
        actionTaken: "Check the official WHO website (who.int) or search the exact text on Snopes or Alt News to see previous debunkings."
      },
      realWorldLesson: "Whenever a message explicitly instructs you to 'forward immediately to all groups', treat it as a deliberate psychological trigger."
    }
  },
  {
    id: "case-3",
    caseNumber: "CASE-803",
    category: "Out-of-Context Media",
    difficulty: "Intermediate",
    postType: "breaking-banner",
    headline: "Massive Coastal Highway Collapse Claim",
    author: {
      name: "Global Climate Eye",
      handle: "@ClimateEyeReport",
      isVerified: false,
      avatarInitials: "CE",
      accountAgeNote: "Active since 2021"
    },
    content: "PHOTO: Yesterday's unprecedented downpour completely washed away the southern coastal expressway! Thousands of commuters stranded as emergency teams struggle to reach the site.",
    mediaNote: "Attached photo shows a crumpled tarmac highway with sea waves crashing into it.",
    metrics: {
      reposts: "8.7K",
      likes: "19.3K",
      comments: "940"
    },
    simulatedForensics: {
      domainCheck: "Account bio claims to be an environmental watchdog, but has no physical address or accredited journalists.",
      imageAudit: "TinEye / Google Reverse Search: Image first indexed on September 4, 2018 following Typhoon Jebi in Japan.",
      lateralWireCoverage: "Local city traffic police cams and state highway department report traffic moving normally with zero structural damage."
    },
    clues: [
      {
        id: "clue-reverse",
        label: "Reverse Image Search Index",
        target: "media",
        hotspotTag: "MEDIA_ATTACHMENT",
        hint: "Running a reverse image search on Google Images or TinEye reveals this exact photograph was taken in 2018 after a typhoon in Japan, not yesterday's rain."
      },
      {
        id: "clue-local",
        label: "Local Traffic Feeds & Live Cams",
        target: "timing",
        hotspotTag: "TIMESTAMP_METRIC",
        hint: "Live state highway department advisories and traffic police cameras show the southern coastal expressway flowing normally."
      }
    ],
    correctVerdict: "Misleading Context",
    options: ["Fabricated / Hoax", "Misleading Context", "Manipulated Media", "Legitimate Verified News"],
    forensicDebrief: {
      summary: "This photo is 100% genuine and un-edited, but the caption falsely attaches it to a completely different location and date.",
      keyRedFlags: [
        "Genuine historical photograph recycled during a fresh news cycle (called 'Cheapfake')",
        "No local news reporter or emergency agency on the ground confirmed the incident",
        "Reverse image search locates the original photo in a 2018 news archive"
      ],
      siftMoveApplied: {
        letter: "F",
        step: "Find Better Coverage",
        actionTaken: "Search for reverse image results or cross-check local municipal highway feeds for emergency road closures."
      },
      realWorldLesson: "A real, un-photoshoped image can still be complete disinformation when paired with a false location, false date, or deceptive caption."
    }
  },
  {
    id: "case-4",
    caseNumber: "CASE-804",
    category: "AI Synthetic Media",
    difficulty: "Advanced",
    postType: "ai-image",
    headline: "Sensational Photo of Prime Minister Rescuing Flood Victims",
    author: {
      name: "Patriot Daily Wire",
      handle: "@PatriotDailyNow",
      isVerified: false,
      avatarInitials: "PD",
      accountAgeNote: "High posting frequency account"
    },
    content: "TOUCHING MOMENT: Prime minister wading through chest-deep flood waters at 3 AM to personally carry an elderly woman to safety while media ignored it! #Leadership #Hero",
    mediaNote: "Hyper-dramatic, cinematic photo with glowing volumetric light, smooth plastic skin, and muddy water.",
    metrics: {
      reposts: "31.4K",
      likes: "94.2K",
      comments: "5.8K"
    },
    simulatedForensics: {
      domainCheck: "Political partisan aggregator known for sensational memes and engagement bait.",
      imageAudit: "Error Level Analysis (ELA): Noise distribution confirms synthetic diffusion rendering. Six fingers on left hand; earlobe blended into collar.",
      lateralWireCoverage: "Official press pool traveling with prime minister confirms no 3 AM flood rescue occurred. Zero wire photography from Reuters or AP."
    },
    clues: [
      {
        id: "clue-hands",
        label: "Anatomical Artifacts & Hands",
        target: "media",
        hotspotTag: "MEDIA_ATTACHMENT",
        hint: "Inspect the fingers: The subject's left hand has 6 fingers, and the earlobe melts directly into the shirt collar without a natural seam."
      },
      {
        id: "clue-lighting",
        label: "Cinematic Over-Perfection & Texture",
        target: "media",
        hotspotTag: "MEDIA_ATTACHMENT",
        hint: "Notice the glossy, plastic-like skin texture and dramatic cinematic rim lighting that looks like Midjourney/DALL-E rendering rather than candid photojournalism."
      },
      {
        id: "clue-press",
        label: "Absence of Press Pool Coverage",
        target: "timing",
        hotspotTag: "TIMESTAMP_METRIC",
        hint: "World leaders travel with an accredited press corps of dozens of independent photojournalists. A genuine rescue would be documented by Reuters, AP, and official wires from multiple angles."
      }
    ],
    correctVerdict: "Manipulated Media",
    options: ["Fabricated / Hoax", "Misleading Context", "Manipulated Media", "Legitimate Verified News"],
    forensicDebrief: {
      summary: "An AI-generated synthetic deepfake image engineered to elicit emotional hero-worship and viral political praise.",
      keyRedFlags: [
        "Anatomical glitches: unnatural finger count, merged textures between skin and clothing",
        "Hyper-saturated cinematic lighting typical of Midjourney generative models",
        "Zero coverage from the accredited press pool traveling with the leader"
      ],
      siftMoveApplied: {
        letter: "S",
        step: "Stop & Inspect Visuals",
        actionTaken: "Zoom into fine details (fingers, pupils, background text, jewelry) and check if accredited press agencies have published the photograph."
      },
      realWorldLesson: "Generative AI excels at dramatic lighting but struggles with fine spatial details, hands, teeth, reflections, and background typography. Look for surreal glossiness."
    }
  },
  {
    id: "case-5",
    caseNumber: "CASE-805",
    category: "Verified Journalism",
    difficulty: "Intermediate",
    postType: "breaking-banner",
    headline: "ISRO Releases First Lunar South Pole Temperature Readings",
    author: {
      name: "The Hindu Science Desk",
      handle: "@TheHinduScience",
      isVerified: true,
      avatarInitials: "TH",
      accountAgeNote: "Accredited national news daily"
    },
    content: "DATA UPDATE: ISRO scientists publish lunar surface thermophysical experiment (ChaSTE) payload data, documenting a sharp temperature variation from 50°C on surface to -10°C at 8cm depth. Research paper accepted in peer-reviewed journal.",
    mediaNote: "Accompanied by a chart credited to Space Applications Centre / ISRO with axis labels and study DOI link.",
    metrics: {
      reposts: "3.4K",
      likes: "12.8K",
      comments: "140"
    },
    simulatedForensics: {
      domainCheck: "Accredited national broadsheet established in 1878. Adheres to Press Council of India standards.",
      imageAudit: "Scientific chart contains full axis scales (-10°C to 60°C) and credits Space Applications Centre.",
      lateralWireCoverage: "Corroborated by Nature, Science, BBC News, and official ISRO press briefings."
    },
    clues: [
      {
        id: "clue-doi",
        label: "Primary Source Attribution & DOI",
        target: "url",
        hotspotTag: "MEDIA_ATTACHMENT",
        hint: "Includes specific payload name ('ChaSTE'), measurement methodology, and directly links to the peer-reviewed paper and space agency portal."
      },
      {
        id: "clue-tone-neutral",
        label: "Measured, Non-Hyperbolic Language",
        target: "tone",
        hotspotTag: "HEADLINE_TONE",
        hint: "Uses precise scientific figures ('50°C to -10°C at 8cm') without clickbait adjectives like 'SHOCKING' or 'UNBELIEVABLE'."
      }
    ],
    correctVerdict: "Legitimate Verified News",
    options: ["Fabricated / Hoax", "Misleading Context", "Manipulated Media", "Legitimate Verified News"],
    forensicDebrief: {
      summary: "This is verified, high-quality institutional science journalism with clear attribution and primary evidence.",
      keyRedFlags: [
        "None: The report uses sober, measured language",
        "Cites exact scientific instrument and institutional scientific bodies",
        "Corroborated across multiple reputable science journals and agency press releases"
      ],
      siftMoveApplied: {
        letter: "T",
        step: "Trace to the Original Context",
        actionTaken: "The link points directly to the original space agency research data with full methodology disclosed."
      },
      realWorldLesson: "Credible reporting doesn't tell you how to feel. It provides verifiable details, names the researchers, and cites primary data."
    }
  },
  {
    id: "case-6",
    caseNumber: "CASE-806",
    category: "Misleading Data & Graphs",
    difficulty: "Advanced",
    postType: "chart",
    headline: "Unemployment Rate Skyrockets Under New Policy",
    author: {
      name: "Policy Watch Daily",
      handle: "@PolicyWatch_IN",
      isVerified: false,
      avatarInitials: "PW",
      accountAgeNote: "Partisan advocacy outlet"
    },
    content: "GRAPH: Look at this massive spike in unemployment this quarter! The policies are an absolute catastrophe for working families. Graph clearly shows the exponential cliff.",
    mediaNote: "Graph displays a bar soaring 4x higher than the previous bar. However, the Y-axis starts at 5.8% and ends at 6.2%!",
    metrics: {
      reposts: "5.1K",
      likes: "11.2K",
      comments: "820"
    },
    simulatedForensics: {
      domainCheck: "Think tank sponsored by political lobbying group. Editorial board undisclosed.",
      imageAudit: "Data Visualization Audit: Non-zero vertical axis baseline (truncated at 5.8%). Distorts 0.2% change to look like a 400% surge.",
      lateralWireCoverage: "Ministry of Statistics & Labour Bureau reports quarterly unemployment fluctuation remains within standard statistical margin of error (±0.25%)."
    },
    clues: [
      {
        id: "clue-yaxis",
        label: "Truncated Y-Axis Inspection",
        target: "media",
        hotspotTag: "MEDIA_ATTACHMENT",
        hint: "Look at the vertical axis! It does NOT start at 0. It runs from 5.8% to 6.2%. A tiny 0.2% statistical variation is visually distorted to appear 400% taller!"
      },
      {
        id: "clue-hyperbole",
        label: "Loaded Emotional Rhetoric",
        target: "tone",
        hotspotTag: "HEADLINE_TONE",
        hint: "Calls a 0.2% fluctuation an 'exponential cliff' and 'absolute catastrophe' to manipulate visual perception."
      }
    ],
    correctVerdict: "Misleading Context",
    options: ["Fabricated / Hoax", "Misleading Context", "Manipulated Media", "Legitimate Verified News"],
    forensicDebrief: {
      summary: "A classic example of visual data manipulation using a truncated Y-axis to exaggerate a minor fluctuation into an apparent crisis.",
      keyRedFlags: [
        "Non-zero baseline: The Y-axis begins at 5.8%, magnifying a 0.2% change into a giant leap",
        "Extreme emotive rhetoric ('exponential cliff') that contradicts the underlying statistical stability",
        "Selective timeframe chosen without historical multi-year context"
      ],
      siftMoveApplied: {
        letter: "T",
        step: "Trace to the Original Context",
        actionTaken: "Download the original Labor Bureau census report to view the full 5-year timeline with proper zero-baseline charts."
      },
      realWorldLesson: "Graphs can lie without changing a single number. Always check the axes: Does the Y-axis start at zero? Are the intervals equal?"
    }
  },
  {
    id: "case-7",
    caseNumber: "CASE-807",
    category: "Satire vs Disinformation",
    difficulty: "Intermediate",
    postType: "quote-card",
    headline: "Study Finds 92% of Brain Cells Go on Strike During Monday Morning Meetings",
    author: {
      name: "The Daily Mashup",
      handle: "@DailyMashupSatire",
      isVerified: true,
      avatarInitials: "DM",
      accountAgeNote: "Humor & Satire publication"
    },
    content: "REPORT: Neuroscience institute in Switzerland confirms that human neurons enter a temporary hibernation strike immediately when a PowerPoint slides presentation exceeds 5 minutes.",
    mediaNote: "Quote card with doctor in lab coat looking bewildered.",
    metrics: {
      reposts: "18.9K",
      likes: "45.1K",
      comments: "2.3K"
    },
    simulatedForensics: {
      domainCheck: "About Us Page: 'The Daily Mashup is an entertainment satire site producing fictional humorous commentary.'",
      imageAudit: "Stock photography image purchased from Shutterstock tagged 'confused scientist in laboratory'.",
      lateralWireCoverage: "No medical neuroscience journals publish this. Widely shared on LinkedIn and Facebook by users believing it is a real study."
    },
    clues: [
      {
        id: "clue-satire",
        label: "Publication 'About Us' & Bio",
        target: "handle",
        hotspotTag: "USER_HANDLE",
        hint: "The account bio explicitly states: 'India's premier satirical commentary publication. Parody only.' Many users repost the headline believing it's a genuine scientific study."
      },
      {
        id: "clue-premise",
        label: "Absurdity of the Proposition",
        target: "tone",
        hotspotTag: "HEADLINE_TONE",
        hint: "Neurons 'entering a temporary hibernation strike during PowerPoint presentations' is a comedic trope, not medical neuroscience."
      }
    ],
    correctVerdict: "Satire / Parody",
    options: ["Fabricated / Hoax", "Misleading Context", "Manipulated Media", "Satire / Parody"],
    forensicDebrief: {
      summary: "This was created as harmless humor and satire, but frequently gets shared by unsuspecting readers who mistake irony for reality.",
      keyRedFlags: [
        "Published by an established humor/satire site ('The Daily Mashup')",
        "Comedic premise mocking workplace culture rather than reporting medical fact",
        "Disclaimers in the author bio clarifying parody status"
      ],
      siftMoveApplied: {
        letter: "I",
        step: "Investigate the Source",
        actionTaken: "Read the account's bio and homepage footer. Satirical sites explicitly declare their comedic purpose."
      },
      realWorldLesson: "Satire is not malicious fake news, but when stripped of context or bio labels, it often circulates as authentic misinformation."
    }
  },
  {
    id: "case-8",
    caseNumber: "CASE-808",
    category: "Selective Quotation",
    difficulty: "Advanced",
    postType: "breaking-banner",
    headline: "Mayor Confesses: 'We Will Cut Free Public School Meals Next Term'",
    author: {
      name: "Metro Political News",
      handle: "@MetroPoliticWatch",
      isVerified: false,
      avatarInitials: "MP",
      accountAgeNote: "Local political campaign blog"
    },
    content: "SCANDAL: In recorded speech today, City Mayor admitted: 'We will cut free public school meals next term'. Parents voice outrage across the district over callous austerity measures.",
    mediaNote: "6-second audio clip repeating the sentence in quotation marks.",
    metrics: {
      reposts: "7.3K",
      likes: "15.4K",
      comments: "1.9K"
    },
    simulatedForensics: {
      domainCheck: "Registered by opposition political action committee 4 weeks before civic election.",
      imageAudit: "Audio Waveform Inspection: Abrupt audio cut at 5.8s where sentence was spliced mid-breath.",
      lateralWireCoverage: "Official City Hall Verbatim Transcript: Full quote was: 'Critics claim that we will cut free public school meals next term, but I promise that will never happen under our budget.'"
    },
    clues: [
      {
        id: "clue-quote",
        label: "Check Full Transcript Context",
        target: "tone",
        hotspotTag: "HEADLINE_TONE",
        hint: "The full transcript reveals the Mayor actually said: 'Critics claim that we will cut free public school meals next term, but I promise that will never happen under our budget.' The quote was chopped in half!"
      },
      {
        id: "clue-clip",
        label: "Short 6-Second Audio Clip",
        target: "media",
        hotspotTag: "MEDIA_ATTACHMENT",
        hint: "Micro-clips (under 10 seconds) that omit surrounding clauses are the hallmark of deceptive 'quote mining' attacks."
      }
    ],
    correctVerdict: "Misleading Context",
    options: ["Fabricated / Hoax", "Misleading Context", "Manipulated Media", "Legitimate Verified News"],
    forensicDebrief: {
      summary: "Deceptive 'Quote Mining' (Contextomy) where the subject's words are cut mid-sentence to say the exact opposite of their true meaning.",
      keyRedFlags: [
        "A heavily trimmed 6-second clip cutting out the sentence preamble ('Critics claim that...')",
        "Omission of the official verbatim transcript released by city hall",
        "Sensational 'SCANDAL' framing weaponizing public anger against a non-existent policy"
      ],
      siftMoveApplied: {
        letter: "T",
        step: "Trace to the Original Context",
        actionTaken: "Look up the full unedited speech recording or press office transcript to hear the entire uninterrupted sentence."
      },
      realWorldLesson: "Never trust a brief quote or 5-second audio snippet without hearing the full sentence. Splicing can reverse someone's entire message."
    }
  }
];
