import Link from "next/link";
import RadarBoard from "./radar-board";

export const metadata = {
  title: "Campus Claim Radar | Sift It",
  description:
    "Explore student-submitted claims reviewed as source-backed media literacy investigations.",
};

export default function RadarPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-sift-md py-sift-xl sm:px-sift-lg sm:py-sift-2xl lg:px-sift-2xl">
      <header className="mb-sift-xl flex flex-col gap-5 border-b border-sift-rule pb-sift-xl sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-sift-accent">
            Student-powered investigations
          </p>
          <h1 className="mt-2 font-sift-display text-sift-display font-bold leading-[0.98] tracking-[-0.055em] text-sift-ink">
            Campus Claim Radar
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-sift-ink-2">
            Students share claims they encounter. Editors check the sources and
            turn selected reports into learning cases about evidence, context,
            and media framing.
          </p>
        </div>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-sift-input bg-sift-accent px-5 text-sm font-semibold text-sift-accent-ink hover:brightness-95 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
          href="/radar/submit"
        >
          Submit a claim
        </Link>
      </header>

      <div className="mb-sift-lg rounded-sift-input border border-sift-rule bg-sift-paper-2 px-4 py-3 text-sm leading-6 text-sift-ink-2">
        Only editor-reviewed investigations appear here. Submissions are private
        until review, and the Radar does not automatically label claims true or
        fake.
      </div>
      <RadarBoard />
    </div>
  );
}
