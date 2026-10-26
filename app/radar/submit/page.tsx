import Link from "next/link";
import ClaimSubmissionForm from "../claim-submission-form";

export const metadata = {
  title: "Submit a claim | Sift It",
  description:
    "Privately suggest a claim for the Campus Claim Radar learning campaign.",
};

export default function SubmitClaimPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-sift-md py-sift-xl sm:px-sift-lg sm:py-sift-2xl">
      <Link
        className="text-sm font-semibold text-sift-accent underline underline-offset-4"
        href="/radar"
      >
        Back to Claim Radar
      </Link>
      <header className="mb-sift-lg mt-6">
        <p className="text-sm font-semibold text-sift-accent">
          Anonymous campaign contribution
        </p>
        <h1 className="mt-2 font-sift-display text-3xl font-bold tracking-tight text-sift-ink sm:text-4xl">
          Suggest a claim to investigate
        </h1>
        <p className="mt-4 text-base leading-7 text-sift-ink-2">
          Your report goes to a private review inbox. An editor chooses whether
          it is suitable for a public learning case.
        </p>
      </header>
      <ClaimSubmissionForm
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
      />
    </div>
  );
}
