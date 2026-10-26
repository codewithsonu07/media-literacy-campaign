import Link from "next/link";
import AdminLoginForm from "./admin-login-form";
import { isSupabaseConfigured } from "../../lib/supabase/server";
import { getModeratorEmails } from "../../lib/supabase/server";

export const metadata = {
  title: "Moderator sign in | Sift It",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured =
    isSupabaseConfigured() && getModeratorEmails().length > 0;

  return (
    <div className="mx-auto w-full max-w-xl px-sift-md py-sift-xl sm:px-sift-lg sm:py-sift-2xl">
      <Link
        className="text-sm font-semibold text-sift-accent underline underline-offset-4"
        href="/radar"
      >
        Back to Claim Radar
      </Link>
      <header className="mb-sift-lg mt-6">
        <p className="text-sm font-semibold text-sift-accent">Editor access</p>
        <h1 className="mt-2 font-sift-display text-3xl font-bold tracking-tight text-sift-ink">
          Review student reports
        </h1>
        <p className="mt-3 text-sm leading-6 text-sift-ink-2">
          Only approved moderator accounts can open the private submission
          queue.
        </p>
      </header>
      <AdminLoginForm configured={configured} />
    </div>
  );
}
