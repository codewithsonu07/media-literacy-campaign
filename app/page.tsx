import Link from "next/link";
import HomeScanner from "./components/home-scanner";
import BiasComparator from "./components/bias-comparator";
import {
  ArrowRight,
  FileSearch,
  Flame,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Sift It | Digital Media Literacy & Forensic Analysis Hub",
  description:
    "Learn to spot fake news, decode clickbait, inspect media framing, and practice lateral reading with interactive simulations and AI linguistic tools.",
};

export default function Home() {
  return (
    <div className="bg-sift-paper text-sift-ink">
      <section className="mx-auto grid w-full max-w-site grid-cols-1 items-center gap-sift-xl px-sift-lg py-sift-xl sm:px-columns sm:py-sift-xl lg:grid-cols-[0.82fr_1.18fr] lg:gap-columns lg:px-gutter lg:py-sift-2xl">
        <div className="max-w-[38rem]">
          <h1 className="font-sift-display text-sift-display font-bold leading-[0.94] tracking-[-0.065em] text-balance text-sift-ink">
            Read past
            <br />
            the headline.
          </h1>
          <p className="mt-sift-lg max-w-[31rem] text-sift-lead leading-8 text-sift-ink-2">
            Scan a headline, then choose how you want to investigate it.
          </p>
          <div className="mt-sift-xl flex flex-wrap gap-sift-sm">
            <Link className="inline-flex min-h-12 items-center justify-center gap-sift-xs rounded-sift-input bg-sift-accent px-sift-lg py-sift-sm text-sift-small font-semibold text-sift-accent-ink transition-colors hover:bg-sift-accent-soft-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sift-accent motion-reduce:transition-none" href="/checker">
              <Search size={14} /> Analyze
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center gap-sift-xs rounded-sift-input border border-sift-rule bg-sift-paper-2 px-sift-lg py-sift-sm text-sift-small font-semibold text-sift-ink transition-colors hover:border-sift-accent hover:bg-sift-accent-soft focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sift-accent motion-reduce:transition-none" href="/quiz">
              <FileSearch size={14} /> Try the cases
            </Link>
          </div>
        </div>
        <div className="min-w-0">
          <HomeScanner />
        </div>
      </section>

      <section
        className="mx-auto grid w-full max-w-site gap-columns border-y border-sift-rule px-sift-lg py-sift-xl sm:px-columns lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-gutter lg:px-gutter lg:py-sift-xl"
        aria-label="Why verification matters"
      >
        <p className="max-w-[42rem] text-sift-body leading-7 text-sift-ink-2 sm:leading-8">
          Viral misinformation travels <strong>6 times faster</strong> than
          verified facts because it is engineered to provoke rapid emotional
          reactions. Sift It equips students, researchers, and citizens with the
          forensic instincts to slow down, analyze linguistic manipulation, and
          verify evidence.
        </p>
        <dl className="grid grid-cols-1 divide-y divide-sift-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="py-4 sm:px-4 sm:py-0">
            <dt className="font-sift-display text-3xl font-bold tracking-[-0.05em] text-sift-accent">
              6x
            </dt>
            <dd className="mt-1 text-sm leading-5 text-sift-muted">Faster spread of false claims over truth (MIT Study)</dd>
          </div>
          <div className="py-4 sm:px-4 sm:py-0">
            <dt className="font-sift-display text-3xl font-bold tracking-[-0.05em] text-sift-accent">
              70%
            </dt>
            <dd className="mt-1 text-sm leading-5 text-sift-muted">Of viral hoaxes are out-of-context cheapfakes, not AI</dd>
          </div>
          <div className="py-4 sm:px-4 sm:py-0">
            <dt className="font-sift-display text-3xl font-bold tracking-[-0.05em] text-sift-accent">
              30s
            </dt>
            <dd className="mt-1 text-sm leading-5 text-sift-muted">Average lateral reading time to debunk 90% of hoaxes</dd>
          </div>
        </dl>
      </section>

      <section
        className="mx-auto grid w-full max-w-site gap-columns px-sift-lg py-sift-2xl sm:px-columns sm:py-sift-2xl lg:grid-cols-[0.72fr_1.28fr] lg:gap-columns lg:px-gutter lg:py-section-s"
        aria-labelledby="pathways-title"
      >
        <div className="max-w-[26rem]">
          <h2 id="pathways-title" className="font-sift-display text-sift-section font-bold leading-[1.05] tracking-[-0.055em] text-balance text-sift-ink">
            Three ways to get sharper.
          </h2>
          <p className="mt-sift-md text-sift-body font-semibold text-sift-accent">
            Interactive verification toolkits.
          </p>
          <p className="mt-sift-md text-sift-body leading-7 text-sift-ink-2">
            Master the SIFT methodology, challenge yourself in the forensic
            newsroom, or analyze any live headline with our linguistic
            intelligence engine.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-sift-md md:grid-cols-2">
          <Link className="group flex min-h-[22rem] flex-col rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md transition-colors hover:border-sift-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sift-accent motion-reduce:transition-none sm:p-sift-lg" href="/learn">
            <div className="mb-sift-lg flex min-h-24 items-center justify-center gap-sift-sm rounded-sift-input bg-sift-accent-soft font-sift-display text-4xl font-bold tracking-[-0.06em] text-sift-accent-soft-ink" aria-hidden="true">
              <span>S</span><span>I</span><span>F</span><span>T</span>
            </div>
            <h3 className="font-sift-display text-sift-title font-bold tracking-[-0.035em] text-sift-ink">SIFT field guide &amp; simulator</h3>
            <span className="mt-sift-md text-sift-small leading-6 text-sift-ink-2">
              Interactive 4-step lateral reading simulator, Disinformation
              Tactics Decoder, and a directory of certified fact-checking
              organizations.
            </span>
            <span className="mt-auto flex min-h-11 items-end gap-sift-xs pt-sift-md text-sift-small font-semibold text-sift-accent">
              SIFT guide <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="group flex min-h-[22rem] flex-col rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md transition-colors hover:border-sift-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sift-accent motion-reduce:transition-none sm:p-sift-lg" href="/quiz">
            <div className="relative mb-sift-lg flex min-h-24 items-center justify-center rounded-sift-input bg-sift-paper-3" aria-hidden="true">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sift-paper-2 text-[var(--color-coral-ink)]">
                <FileSearch size={36} />
              </span>
              <span
                className="absolute bottom-3 right-3 rounded-sift-pill bg-sift-lime px-sift-sm py-1 font-mono text-xs font-semibold text-sift-ink"
                aria-label="8 investigative cases"
              >
                8 cases
              </span>
            </div>
            <h3 className="font-sift-display text-sift-title font-bold tracking-[-0.035em] text-sift-ink">
              News Detective:
              <br />
              spot the hoax
            </h3>
            <span className="mt-sift-md text-sift-small leading-6 text-sift-ink-2">
              Inspect real-world social posts, fake Twitter handles, deceptive
              truncated charts, and AI deepfakes. Earn your Investigator Rank
              dossier.
            </span>
            <span className="mt-auto flex min-h-11 items-end gap-sift-xs pt-sift-md text-sift-small font-semibold text-sift-accent">
              Start Investigation <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="group flex min-h-[22rem] flex-col rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md transition-colors hover:border-sift-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sift-accent motion-reduce:transition-none md:col-span-2 md:min-h-0 sm:p-sift-lg" href="/checker">
            <div className="mb-sift-lg flex min-h-24 items-center justify-center gap-sift-md rounded-sift-input bg-sift-ink font-mono text-sift-small font-semibold text-sift-paper-2" aria-hidden="true">
              <span>“URGENT”</span>
              <b className="font-sift-display text-5xl leading-none text-sift-lime">!</b>
            </div>
            <h3 className="font-sift-display text-sift-title font-bold tracking-[-0.035em] text-sift-ink">Headline &amp; claim analyzer</h3>
            <span className="mt-sift-md text-sift-small leading-6 text-sift-ink-2">
              Paste any headline to evaluate sensationalism, psychological
              outrage hooks, and receive an objective neutral reframe with
              one-click verification links.
            </span>
            <span className="mt-auto flex min-h-11 items-end gap-sift-xs pt-sift-md text-sift-small font-semibold text-sift-accent">
              Inspect a Headline <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </section>

      <section className="border-y border-sift-rule bg-sift-paper-3 px-sift-lg py-sift-2xl sm:px-columns sm:py-sift-2xl lg:px-gutter lg:py-sift-3xl" aria-labelledby="bias-title">
        <div className="mx-auto w-full max-w-[1440px]">
          <h2 id="bias-title" className="mb-sift-lg max-w-[46rem] font-sift-display text-sift-section font-bold leading-[1.05] tracking-[-0.055em] text-balance text-sift-ink">See how framing changes a story.</h2>
          <BiasComparator />
        </div>
      </section>

      <section className="mx-auto w-full max-w-site px-sift-lg py-sift-2xl sm:px-columns sm:py-sift-2xl lg:px-gutter lg:py-section-s">
        <div className="mb-sift-xl grid gap-sift-md md:grid-cols-[1fr_0.7fr] md:items-end sm:mb-sift-xl">
          <div>
            <h2 className="font-sift-display text-sift-section font-bold leading-[1.05] tracking-[-0.055em] text-balance text-sift-ink">The anatomy of a viral hoax.</h2>
          </div>
          <div>
            <p className="mb-sift-xs text-sift-small font-semibold text-sift-accent">Psychology and algorithms.</p>
            <p className="max-w-[32rem] text-sift-body leading-7 text-sift-ink-2">
              Understanding why our brains fall for fake news is the first step
              toward digital immunity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-sift-md md:grid-cols-2">
          <article className="rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md sm:p-sift-lg">
            <div className="mb-3 flex items-center gap-3">
              <span className="shrink-0 text-sift-small font-medium text-sift-muted">Stage 1</span>
              <Flame size={20} className="text-[var(--color-coral-ink)]" />
              <h3 className="font-sift-display text-sift-title font-bold text-sift-ink">The Emotional Hook</h3>
            </div>
            <p className="text-sift-small leading-6 text-sift-ink-2">
              Bad actors craft a headline targeting moral outrage, fear, or
              tribal grievance. Strong emotion floods your brain with dopamine
              and adrenaline, turning off critical doubts.
            </p>
          </article>

          <article className="rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md sm:p-sift-lg">
            <div className="mb-3 flex items-center gap-3">
              <span className="shrink-0 text-sift-small font-medium text-sift-muted">Stage 2</span>
              <TrendingUp size={20} className="text-sift-accent" />
              <h3 className="font-sift-display text-sift-title font-bold text-sift-ink">Algorithmic Rocket Fuel</h3>
            </div>
            <p className="text-sift-small leading-6 text-sift-ink-2">
              Social media algorithms optimize for engagement, not accuracy.
              Every angry comment, quote-tweet, and forward boosts the post onto
              thousands of new recommendation feeds.
            </p>
          </article>

          <article className="rounded-sift-card border border-sift-rule bg-sift-paper-2 p-sift-md sm:p-sift-lg">
            <div className="mb-3 flex items-center gap-3">
              <span className="shrink-0 text-sift-small font-medium text-sift-muted">Stage 3</span>
              <ShieldAlert size={20} className="text-[var(--color-coral-ink)]" />
              <h3 className="font-sift-display text-sift-title font-bold text-sift-ink">The Illusion of Consensus</h3>
            </div>
            <p className="text-sift-small leading-6 text-sift-ink-2">
              Once a rumor is shared by trusted friends or family in WhatsApp
              groups, the Bandwagon Effect takes hold: &ldquo;If everyone is
              talking about it, it must have some truth.&rdquo;
            </p>
          </article>

          <article className="rounded-sift-card border border-sift-accent bg-sift-accent-soft p-sift-md sm:p-sift-lg">
            <div className="mb-3 flex items-center gap-3">
              <span className="shrink-0 text-sift-small font-medium text-sift-ink-2">The intervention</span>
              <ShieldCheck size={20} className="text-sift-accent" />
              <h3 className="font-sift-display text-sift-title font-bold text-sift-ink">The 30-Second SIFT Pause</h3>
            </div>
            <p className="text-sift-small leading-6 text-sift-ink-2">
              Taking a single 30-second breath to search the claim laterally in
              an independent browser tab breaks the viral chain reaction and
              stops the spread cold.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-sift-ink px-5 py-14 text-sift-paper-2 sm:px-8 sm:py-16 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1440px] gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8">
          <span className="font-sift-display text-7xl leading-none text-sift-lime" aria-hidden="true">
            “
          </span>
          <blockquote className="max-w-[54rem] font-sift-display text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">
            When a story makes you feel something fast, give the evidence a
            chance to catch up.
          </blockquote>
          <Link className="inline-flex min-h-12 items-center gap-2 self-start text-sm font-semibold text-sift-lime underline decoration-sift-accent underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sift-lime sm:self-center" href="/learn">
            SIFT guide <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
