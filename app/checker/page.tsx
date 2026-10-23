import HeadlineCheck from "./headline-check";
import {
  AlertOctagon,
  BookOpen,
  Flame,
  Layers,
  Search,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Headline & Claim Intelligence Engine | Sift It",
  description:
    "Evaluate headline sensationalism, emotional triggers, attribution quality, and generate objective reframes with one-click fact-checking queries.",
};

export default function CheckerPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-sift-md py-sift-lg font-sans text-sift-ink sm:px-sift-lg sm:py-sift-2xl lg:px-sift-2xl">
      <header className="mb-sift-lg max-w-3xl sm:mb-sift-xl">
        <h1 className="font-sift-display text-balance text-3xl font-semibold tracking-tight text-sift-ink sm:text-4xl">
          Headline analysis
        </h1>
        <p className="mt-sift-md max-w-2xl text-sift-body leading-7 text-sift-ink-2 sm:text-lg sm:leading-8">
          Some headlines are engineered to win clicks, provoke emotion, and
          shape perception before you reach the article. Inspect their language,
          assess manipulation risk, and compare them with objective journalism.
        </p>
      </header>

      <section
        className="mb-sift-xl rounded-sift-card border border-sift-rule bg-sift-paper-2/85 p-sift-sm shadow-[var(--shadow-card)] backdrop-blur-md sm:mb-sift-2xl sm:p-sift-md lg:p-sift-lg"
        aria-label="Headline intelligence analyzer"
      >
        <HeadlineCheck />
      </section>

      <section
        className="mb-sift-xl border-t border-sift-rule pt-sift-lg sm:mb-sift-2xl sm:pt-sift-xl"
        aria-labelledby="checker-methodology-title"
      >
        <h2
          className="font-sift-display text-balance text-sift-title font-semibold tracking-tight text-sift-ink sm:text-3xl"
          id="checker-methodology-title"
        >
          How the analysis works
        </h2>
        <ol className="mt-sift-lg grid gap-sift-sm sm:grid-cols-2 xl:grid-cols-4">
          <li className="flex items-start gap-sift-md rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md">
            <span
              className="font-mono text-xs font-semibold text-sift-accent"
              aria-hidden="true"
            >
              01
            </span>
            <Layers
              size={16}
              className="mt-0.5 shrink-0 text-sift-accent"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-sift-ink">
                Linguistic deconstruction
              </h3>
              <p className="mt-2 text-sm leading-6 text-sift-muted">
                Scans for emotional hyperbole, loaded verbs, and weasel
                attribution.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-sift-md rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md">
            <span
              className="font-mono text-xs font-semibold text-sift-accent"
              aria-hidden="true"
            >
              02
            </span>
            <Flame
              size={16}
              className="mt-0.5 shrink-0 text-sift-coral"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-sift-ink">
                Manipulation vectors
              </h3>
              <p className="mt-2 text-sm leading-6 text-sift-muted">
                Diagnoses cognitive exploitation, context splicing, and
                virality pressure.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-sift-md rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md">
            <span
              className="font-mono text-xs font-semibold text-sift-accent"
              aria-hidden="true"
            >
              03
            </span>
            <ShieldCheck
              size={16}
              className="mt-0.5 shrink-0 text-sift-accent"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-sift-ink">
                Neutral wire reframe
              </h3>
              <p className="mt-2 text-sm leading-6 text-sift-muted">
                Rewrites sensationalized phrasing to sober, objective wire
                standards.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-sift-md rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md">
            <span
              className="font-mono text-xs font-semibold text-sift-accent"
              aria-hidden="true"
            >
              04
            </span>
            <Search
              size={16}
              className="mt-0.5 shrink-0 text-sift-accent"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-semibold text-sift-ink">
                Lateral fact-checking
              </h3>
              <p className="mt-2 text-sm leading-6 text-sift-muted">
                Generates targeted search queries for Alt News, BOOM, Google
                Fact Check, and PIB.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section
        className="border-t border-sift-rule pt-sift-lg sm:pt-sift-xl"
        aria-labelledby="checker-reminders-title"
      >
        <h2
          className="font-sift-display text-balance text-sift-title font-semibold tracking-tight text-sift-ink sm:text-3xl"
          id="checker-reminders-title"
        >
          Reading reminders
        </h2>
        <div className="mt-sift-lg grid gap-sift-md lg:grid-cols-2">
          <article className="rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md sm:p-sift-lg">
            <h3 className="flex items-start gap-3 font-semibold leading-6 text-sift-ink">
              <BookOpen
                size={16}
                className="mt-1 shrink-0 text-sift-accent"
                aria-hidden="true"
              />
              The 30-second lateral reading rule
            </h3>
            <p className="mt-3 text-sm leading-6 text-sift-ink-2">
              Before sharing any breaking story, spend 30 seconds reading
              laterally in a second tab. 90% of viral hoaxes are debunked within
              the first two search results of established fact-checkers.
            </p>
          </article>

          <article className="rounded-sift-card border border-sift-coral bg-sift-coral/10 p-sift-md sm:p-sift-lg">
            <h3 className="flex items-start gap-3 font-semibold leading-6 text-sift-ink">
              <AlertOctagon
                size={16}
                className="mt-1 shrink-0 text-sift-coral"
                aria-hidden="true"
              />
              Critical thinking reminder
            </h3>
            <p className="mt-3 text-sm leading-6 text-sift-ink-2">
              An emotional headline doesn&apos;t automatically make a claim
              false, and a calm headline doesn&apos;t make it true. Always
              follow claims back to primary documents, clinical trials, or
              official gazettes.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
