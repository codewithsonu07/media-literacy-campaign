"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

interface AdminLoginFormProps {
  configured: boolean;
}

export default function AdminLoginForm({
  configured,
}: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSigningIn(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !publicKey) {
        throw new Error("Moderator sign-in is not configured.");
      }
      const supabase = createBrowserClient(url, publicKey);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        throw new Error("Sign-in failed. Check your moderator credentials.");
      }
      router.replace("/admin");
      router.refresh();
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Moderator sign-in failed.",
      );
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <form
      className="space-y-4 rounded-sift-card border border-sift-rule bg-sift-paper-2 p-5 sm:p-7"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          className="block text-sm font-semibold text-sift-ink"
          htmlFor="moderator-email"
        >
          Moderator email
        </label>
        <input
          autoComplete="username"
          className="mt-2 min-h-11 w-full rounded-sift-input border border-sift-rule bg-sift-paper px-3 text-sm text-sift-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
          id="moderator-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div>
        <label
          className="block text-sm font-semibold text-sift-ink"
          htmlFor="moderator-password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className="mt-2 min-h-11 w-full rounded-sift-input border border-sift-rule bg-sift-paper px-3 text-sm text-sift-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
          id="moderator-password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>

      {!configured && (
        <p className="rounded-sift-input border border-sift-coral px-3 py-2 text-sm text-sift-ink" role="alert">
          Configure Supabase and MODERATOR_EMAILS before enabling the review
          inbox.
        </p>
      )}
      {error && (
        <p className="rounded-sift-input border border-sift-coral px-3 py-2 text-sm text-sift-ink" role="alert">
          {error}
        </p>
      )}
      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-sift-input bg-sift-accent px-5 text-sm font-semibold text-sift-accent-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sift-accent"
        disabled={!configured || isSigningIn}
        type="submit"
      >
        {isSigningIn ? "Signing in..." : "Sign in to review"}
      </button>
    </form>
  );
}
