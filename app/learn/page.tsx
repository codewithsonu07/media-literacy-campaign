import Link from "next/link";
import SiftSimulator from "./sift-simulator";
import TacticsDecoder from "./tactics-decoder";
import DecisionFlowchart from "./decision-flowchart";
import DeepfakeInspector from "./deepfake-inspector";
import LateralBrowser from "./lateral-browser";
import { ExternalLink, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Learn SIFT & Forensics | Sift It",
  description:
    "Master the 4 SIFT moves with interactive simulators, decode manipulation tactics, and test lateral reading with hands-on tools.",
};

const posters = [
  {
    letter: "S",
    title: "Stop",
    prompt: "What did this make me feel?",
    description:
      "Pause before reacting or sharing. Strong emotional reflex (anger, fear, sudden excitement) is an intentional cue to slow down.",
  },
  {
    letter: "I",
    title: "Investigate the source",
    prompt: "Who is really behind this?",
    description:
      "Read laterally. Open a new tab, search Wikipedia or verified registries to evaluate the creator's credentials and institutional funding.",
  },
  {
    letter: "F",
    title: "Find better coverage",
    prompt: "Who else reports this?",
    description:
      "Look for independent consensus across recognized news wires. If a major story is only on anonymous feeds, caution is warranted.",
  },
  {
    letter: "T",
    title: "Trace to the original",
    prompt: "Where did this begin?",
    description:
      "Follow quotes, statistics, and images back to the primary research DOI, official circular, or unedited raw video recording.",
  },
];

const factCheckers = [
  {
    name: "Alt News",
    href: "https://www.altnews.in/",
    desc: "Pioneering Indian fact-checking service debunking communal hoaxes, doctored videos, and social media misinformation.",
  },
  {
    name: "BOOM Live",
    href: "https://www.boomlive.in/",
    desc: "IFCN-certified fact-checking organization tracking political claims, viral WhatsApp medical rumors, and financial scams.",
  },
  {
    name: "PIB Fact Check",
    href: "https://factcheck.pib.gov.in/",
    desc: "Government of India's official portal countering rumors, fraudulent circulars, and fake recruitment notices.",
  },
  {
    name: "Snopes Fact Archive",
    href: "https://www.snopes.com/",
    desc: "The world's oldest digital fact-checking archive tracking urban legends, viral claims, and internet hoaxes.",
  },
];

export default function LearnPage() {
  return (
    <main className="bg-sift-paper font-sans text-sift-ink">
      <section
        className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 sm:px-8 md:gap-16 md:pb-28 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-12"
        aria-labelledby="learn-title"
      >
        <div className="w-full min-w-0 max-w-3xl self-center">
          <h1
            id="learn-title"
            className="max-w-3xl text-sift-display text-balance font-bold leading-[0.98] tracking-[-0.055em] text-sift-ink"
          >
            Four moves for a sharper read.
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-[var(--color-ink-2)] sm:text-2xl">
            Check credibility with four SIFT habits in under 60 seconds.
          </p>
          <p className="mt-8 max-w-2xl border-l-2 border-[var(--color-coral)] pl-5 text-base leading-relaxed text-[var(--color-ink-2)]">
            <strong>Start with Stop.</strong> Pause before reacting or sharing,
            and notice what the information makes you feel.
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
            Digital literacy scholar Mike Caulfield created the SIFT method.
            Five interactive workbenches include an AI deepfake lab and a
            decision flow engine.
          </p>
        </div>
        <div className="flex items-center">
          <ol
            className="w-full divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]"
            aria-label="The SIFT sequence"
          >
            <li className="flex items-center gap-5 py-5 sm:gap-7">
              <span className="font-[var(--font-outlier)] text-4xl font-medium text-[var(--color-coral)] sm:text-5xl" aria-hidden="true">S</span>
              <strong className="text-lg font-semibold sm:text-xl">Stop</strong>
            </li>
            <li className="flex items-center gap-5 py-5 sm:gap-7">
              <span className="font-[var(--font-outlier)] text-4xl font-medium text-[var(--color-accent)] sm:text-5xl" aria-hidden="true">I</span>
              <strong className="text-lg font-semibold sm:text-xl">Investigate the source</strong>
            </li>
            <li className="flex items-center gap-5 py-5 sm:gap-7">
              <span className="font-[var(--font-outlier)] text-4xl font-medium text-[var(--color-ink-2)] sm:text-5xl" aria-hidden="true">F</span>
              <strong className="text-lg font-semibold sm:text-xl">Find better coverage</strong>
            </li>
            <li className="flex items-center gap-5 py-5 sm:gap-7">
              <span className="font-[var(--font-outlier)] text-4xl font-medium text-[var(--color-success)] sm:text-5xl" aria-hidden="true">T</span>
              <strong className="text-lg font-semibold sm:text-xl">Trace to the original</strong>
            </li>
          </ol>
        </div>
      </section>

      <section
        className="border-y border-sift-rule bg-sift-paper-2 px-5 py-16 sm:px-8 md:py-24 lg:px-12"
        aria-labelledby="sift-title"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <h2 id="sift-title" className="text-sift-section text-balance font-semibold tracking-[-0.04em]">
              The Four SIFT Moves.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)] md:justify-self-end">
            Four instinctive questions to ask whenever information surprises,
            alarms, or flatters your existing beliefs.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {posters.map((poster) => (
            <article
              className={`flex min-h-72 flex-col justify-between rounded-[var(--radius-card)] border border-[var(--color-rule)] border-t-4 bg-[var(--color-paper)] p-6 sm:p-7 ${
                poster.letter === "S"
                  ? "border-t-[var(--color-coral)]"
                  : poster.letter === "I"
                    ? "border-t-[var(--color-accent)]"
                    : poster.letter === "F"
                      ? "border-t-[var(--color-ink-2)]"
                      : "border-t-[var(--color-success)]"
              }`}
              key={poster.letter}
            >
              <span
                className={`font-[var(--font-outlier)] text-6xl leading-none ${
                  poster.letter === "S"
                    ? "text-[var(--color-coral)]"
                    : poster.letter === "I"
                      ? "text-[var(--color-accent)]"
                      : poster.letter === "F"
                        ? "text-[var(--color-ink-2)]"
                        : "text-[var(--color-success)]"
                }`}
                aria-hidden="true"
              >
                {poster.letter}
              </span>
              <div className="mt-8">
                <h3 className="text-xl font-semibold tracking-[-0.025em]">{poster.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--color-accent-soft-ink)]">
                  {poster.prompt}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{poster.description}</p>
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <LateralBrowser />
      </section>

      <section className="bg-[var(--color-green)] px-5 py-16 text-[var(--color-paper)] sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 grid gap-4 md:mb-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <h2 className="text-sift-section text-balance font-semibold tracking-[-0.04em]">Interactive SIFT Simulator.</h2>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--color-paper-3)] md:justify-self-end">
            Step through a viral exam-cancellation breaking rumor in real time.
            Practice the right forensic moves at each phase.
            </p>
          </div>
          <SiftSimulator />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <DecisionFlowchart />
      </section>

      <section className="border-y border-sift-rule bg-sift-paper-2 px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
        <DeepfakeInspector />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mb-9 grid gap-4 md:mb-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <h2 className="text-sift-section text-balance font-semibold tracking-[-0.04em]">Disinformation Tactics Decoder.</h2>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)] md:justify-self-end">
            Learn how bad actors engineer viral deception. Filter by category,
            inspect the psychological mechanism, and learn the countermeasure.
          </p>
        </div>
        <TacticsDecoder />
      </section>

      <section className="bg-[var(--color-accent-soft)] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="w-full min-w-0 max-w-xl">
            <h2 className="text-sift-section text-balance font-semibold leading-tight tracking-[-0.04em]">A headline is a prompt to question, not a conclusion.</h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--color-ink-2)]">
              Notice how the urgency marker &ldquo;BREAKING&rdquo; triggers a
              rush to share. Tracing the primary municipal bulletin reveals that
              the schedule was an ordinary routine revision announced two weeks
              earlier.
            </p>
            <Link
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
              href="/checker"
            >
              Launch Headline Analyzer
            </Link>
          </div>
          <figure className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 sm:p-9">
            <div className="flex flex-wrap justify-between gap-3 border-b border-[var(--color-rule)] pb-4 font-mono text-xs text-sift-muted">
              <span>Classroom forensic study</span>
              <span>Analysis example</span>
            </div>
            <blockquote className="py-8 text-2xl font-semibold leading-snug tracking-[-0.035em] sm:py-10 sm:text-3xl">
              BREAKING: City announces new Saturday library hours.
            </blockquote>
            <div className="border-l-2 border-[var(--color-coral)] pl-4">
              <p className="text-sm leading-relaxed text-[var(--color-ink-2)]">
                BREAKING signals artificial urgency. Check the library&apos;s
                official website schedule rather than reposting the social
                announcement.
              </p>
            </div>
            <div className="mt-7 grid gap-2 border-t border-[var(--color-rule)] pt-4 text-sm sm:grid-cols-[0.35fr_1fr] sm:gap-6">
              <span className="font-semibold text-[var(--color-accent)]">The lateral move</span>
              <span className="break-words font-[var(--font-outlier)] text-xs leading-relaxed text-[var(--color-muted)]">
                Search: [City Library official weekend hours 2024]
              </span>
            </div>
          </figure>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24 lg:px-12"
        aria-labelledby="checklist-title"
      >
        <div className="mb-8 flex flex-col gap-4 border-b border-[var(--color-rule)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="checklist-title" className="text-sift-section text-balance font-semibold tracking-[-0.04em]">The 30-Second Field Checklist</h2>
        </div>
        <div className="grid gap-0 md:grid-cols-3">
          <p className="border-b border-[var(--color-rule)] py-6 md:border-b-0 md:border-r md:pr-6">
            <span className="mb-4 block font-[var(--font-outlier)] text-sm text-[var(--color-coral)]">01</span>
            <strong className="block text-lg font-semibold">Who published this?</strong>
            <span className="mt-2 block text-sm leading-relaxed text-[var(--color-muted)]">Search their name outside their
            own site. Are they an accredited newsroom or an anonymous handle?</span>
          </p>
          <p className="border-b border-[var(--color-rule)] py-6 md:border-b-0 md:border-r md:px-6">
            <span className="mb-4 block font-[var(--font-outlier)] text-sm text-[var(--color-accent)]">02</span>
            <strong className="block text-lg font-semibold">What is the date &amp; location?</strong>
            <span className="mt-2 block text-sm leading-relaxed text-[var(--color-muted)]">Reverse-search
            suspicious photos. Often, the footage is real but five years old.</span>
          </p>
          <p className="py-6 md:pl-6">
            <span className="mb-4 block font-[var(--font-outlier)] text-sm text-[var(--color-success)]">03</span>
            <strong className="block text-lg font-semibold">Who else reports it?</strong>
            <span className="mt-2 block text-sm leading-relaxed text-[var(--color-muted)]">If a major national disaster
            or policy leak is true, every global wire will have it within 20
            minutes.</span>
          </p>
        </div>
      </section>

      <section className="border-y border-sift-rule bg-sift-paper-2 px-5 py-16 sm:px-8 md:py-24 lg:px-12" id="resources">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 grid gap-4 md:mb-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <h2 className="text-sift-section text-balance font-semibold tracking-[-0.04em]">Trusted Fact-Checking Directory.</h2>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)] md:justify-self-end">
            Bookmark these independent, IFCN-certified organizations for
            reliable debunkings and deep dives.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {factCheckers.map((fc) => (
            <a
              key={fc.name}
              href={fc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-52 flex-col rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-5 transition-colors hover:border-[var(--color-accent)] focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <strong className="text-lg font-semibold tracking-[-0.02em]">{fc.name}</strong>
                <ExternalLink
                  size={14}
                  className="shrink-0 text-[var(--color-accent)]"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">{fc.desc}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)]">
                Visit Fact-Checker <ArrowRight size={14} aria-hidden="true" />
              </span>
            </a>
          ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between md:py-20 lg:px-12" aria-label="Continue learning">
        <p className="max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">Ready to put these skills to the test in the newsroom?</p>
        <Link
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-input)] bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-ink)] transition-colors hover:bg-[var(--color-accent-soft-ink)] focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
          href="/quiz"
        >
          Play News Detective Game <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
