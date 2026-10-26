import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-50 border-b border-sift-rule bg-sift-paper">
      <div className="mx-auto flex w-[calc(100%_-_2*var(--gutter))] max-w-[var(--container)] flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            className="inline-flex min-h-11 shrink-0 items-center gap-2 font-bold text-sift-ink no-underline"
            href="/"
            aria-label="Sift It home"
          >
            <span
              className="grid size-9 place-items-center rounded-md bg-sift-lime text-lg font-bold text-sift-ink"
              aria-hidden="true"
            >
              S
            </span>
            <span className="text-lg">SIFT IT</span>
          </Link>
          <span className="hidden max-w-52 text-sm leading-snug text-sift-muted md:block">
            Digital media literacy and forensic claim analysis
          </span>
        </div>
        <nav
          className="flex min-h-11 items-center justify-between gap-2 text-sm font-semibold sm:justify-end sm:gap-5"
          aria-label="Main navigation"
        >
          <Link
            className="inline-flex min-h-11 items-center whitespace-nowrap text-sift-ink-2 underline decoration-transparent underline-offset-4 transition-colors hover:text-sift-accent hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-accent motion-reduce:transition-none"
            href="/learn"
          >
            SIFT guide
          </Link>
          <Link
            className="inline-flex min-h-11 items-center whitespace-nowrap text-sift-ink-2 underline decoration-transparent underline-offset-4 transition-colors hover:text-sift-accent hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-accent motion-reduce:transition-none"
            href="/quiz"
          >
            News cases
          </Link>
          <Link
            className="inline-flex min-h-11 items-center whitespace-nowrap text-sift-ink-2 underline decoration-transparent underline-offset-4 transition-colors hover:text-sift-accent hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-accent motion-reduce:transition-none"
            href="/radar"
          >
            Claim Radar
          </Link>
          <Link
            href="/checker"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-sift-input bg-sift-accent px-3 font-semibold text-sift-accent-ink no-underline transition-colors hover:bg-sift-accent-soft-ink hover:text-sift-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-accent motion-reduce:transition-none sm:px-4"
          >
            Analyze
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-sift-ink text-sift-paper-2">
      <div className="mx-auto w-[calc(100%_-_2*var(--gutter))] max-w-[var(--container)] py-12 sm:py-16">
        <p className="mb-10 max-w-[13ch] text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
          Pause. Check context. Read laterally.
        </p>
        <div className="flex flex-col gap-6 border-t border-sift-paper-2/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-sift-paper-2 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-lime"
            href="/"
            aria-label="Sift It home"
          >
            <span
              className="grid size-8 place-items-center rounded-md bg-sift-lime font-bold text-sift-ink"
              aria-hidden="true"
            >
              S
            </span>
            <span>SIFT IT</span>
          </Link>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold"
            aria-label="Footer navigation"
          >
            <Link className="inline-flex min-h-11 items-center text-sift-paper-2 underline decoration-transparent underline-offset-4 hover:text-sift-lime hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-lime" href="/learn#sift-title">
              The 4 SIFT Moves
            </Link>
            <Link className="inline-flex min-h-11 items-center text-sift-paper-2 underline decoration-transparent underline-offset-4 hover:text-sift-lime hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-lime" href="/learn#resources">
              Fact-checkers
            </Link>
            <Link className="inline-flex min-h-11 items-center text-sift-paper-2 underline decoration-transparent underline-offset-4 hover:text-sift-lime hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-lime" href="/checker">
              Headline Analyzer
            </Link>
            <Link className="inline-flex min-h-11 items-center text-sift-paper-2 underline decoration-transparent underline-offset-4 hover:text-sift-lime hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-lime" href="/quiz">
              Forensic Quiz
            </Link>
            <Link className="inline-flex min-h-11 items-center text-sift-paper-2 underline decoration-transparent underline-offset-4 hover:text-sift-lime hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sift-lime" href="/radar">
              Campus Claim Radar
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
