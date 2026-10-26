import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import ClaimReviewDashboard from "./claim-review-dashboard";
import {
  createSupabaseServerClient,
  getModeratorEmails,
  isSupabaseConfigured,
} from "../lib/supabase/server";

export const metadata = {
  title: "Claim review queue | Sift It",
  robots: { index: false, follow: false },
};

function ModeratorLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-sift-md py-sift-xl sm:px-sift-lg">
      <p className="text-sm text-sift-muted" role="status">
        Checking moderator access...
      </p>
    </div>
  );
}

async function AdminContent() {
  await connection();
  const emails = getModeratorEmails();
  const configured = isSupabaseConfigured() && emails.length > 0;
  if (!configured) {
    return (
      <div className="mx-auto w-full max-w-5xl px-sift-md py-sift-xl sm:px-sift-lg">
        <h1 className="font-sift-display text-2xl font-semibold text-sift-ink">
          Moderator access is not configured
        </h1>
        <p className="mt-3 text-sm leading-6 text-sift-ink-2">
          Set up Supabase authentication and the MODERATOR_EMAILS server
          variable before opening this private workspace.
        </p>
      </div>
    );
  }

  let authorized = false;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authorized = Boolean(
      user?.email && emails.includes(user.email.toLowerCase()),
    );
  } catch (error) {
    console.error(
      "Could not authorize moderator page:",
      error instanceof Error ? error.message : "unknown error",
    );
    return (
      <div className="mx-auto w-full max-w-5xl px-sift-md py-sift-xl sm:px-sift-lg">
        <p className="rounded-sift-input border border-sift-coral px-4 py-3 text-sm text-sift-ink" role="alert">
          Moderator access is temporarily unavailable. Please try again.
        </p>
      </div>
    );
  }

  if (!authorized) redirect("/admin/login");

  return (
    <div className="mx-auto w-full max-w-7xl px-sift-md py-sift-xl sm:px-sift-lg sm:py-sift-2xl lg:px-sift-2xl">
      <ClaimReviewDashboard
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<ModeratorLoading />}>
      <AdminContent />
    </Suspense>
  );
}
