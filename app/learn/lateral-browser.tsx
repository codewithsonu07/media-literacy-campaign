"use client";

import { useState } from "react";
import { Globe, Search, BookOpen, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function LateralBrowser() {
  const [activeTab, setActiveTab] = useState<"site" | "search" | "wiki">("site");

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
      <div className="p-5 sm:p-8">
        <h3 className="text-sift-title font-semibold leading-tight tracking-[-0.035em]">Lateral vs. vertical reading simulator</h3>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          Untrained readers read <em>vertically</em>: they scroll down a suspect website, inspecting its sleek logo and testimonials.
          Professional fact-checkers read <em>laterally</em>: they immediately open new browser tabs to see what outside sources say.
        </p>
      </div>

      {/* Simulated Browser Chrome */}
      <div className="border-t border-[var(--color-rule)] bg-[var(--color-paper)]">
        {/* Browser Top Tab Bar */}
        <div className="flex flex-wrap items-start gap-1 border-b border-[var(--color-rule)] bg-[var(--color-paper-3)] px-3 pt-3 sm:px-5">
          <button
            className={`flex min-h-11 items-center gap-2 rounded-t-[var(--radius-input)] border border-b-0 px-4 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 ${
              activeTab === "site"
                ? "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)]"
                : "border-transparent bg-transparent text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
            }`}
            onClick={() => setActiveTab("site")}
            type="button"
          >
            <Globe size={13} className="text-[var(--color-ink-2)]" />
            <span>Suspect blog</span>
          </button>
          <button
            className={`flex min-h-11 items-center gap-2 rounded-t-[var(--radius-input)] border border-b-0 px-4 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 ${
              activeTab === "search"
                ? "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)]"
                : "border-transparent bg-transparent text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
            }`}
            onClick={() => setActiveTab("search")}
            type="button"
          >
            <Search size={13} className="text-[var(--color-coral)]" />
            <span>Lateral search</span>
          </button>
          <button
            className={`flex min-h-11 items-center gap-2 rounded-t-[var(--radius-input)] border border-b-0 px-4 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-sift-accent focus-visible:outline-offset-2 ${
              activeTab === "wiki"
                ? "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)]"
                : "border-transparent bg-transparent text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
            }`}
            onClick={() => setActiveTab("wiki")}
            type="button"
          >
            <BookOpen size={13} className="text-[var(--color-accent)]" />
            <span>Wikipedia</span>
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex flex-col gap-3 border-b border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0 break-all rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 font-[var(--font-outlier)] text-xs leading-relaxed">
            <span className="text-[var(--color-muted)]">https://</span>
            <span className="text-[var(--color-ink)]">
              {activeTab === "site"
                ? "www.miracle-health-remediez.co/cure-all-cancer"
                : activeTab === "search"
                ? "www.google.com/search?q=miracle+health+remediez+fda+warning+scam"
                : "en.wikipedia.org/wiki/Miracle_Health_Remediez_Controversies"}
            </span>
          </div>
          <span className={`inline-flex min-h-8 shrink-0 items-center self-start rounded-full px-3 py-1 font-mono text-xs sm:self-auto ${
            activeTab === "site"
              ? "bg-[var(--color-coral)] text-[var(--color-ink)]"
              : "bg-[var(--color-accent-soft)] text-[var(--color-accent-soft-ink)]"
          }`}>
            {activeTab === "site" ? "Suspect site" : "Lateral fact check"}
          </span>
        </div>

        {/* Browser Viewport Content */}
        <div className="min-h-[28rem] p-4 sm:p-6">
          {/* TAB 1: Suspect Blog */}
          {activeTab === "site" && (
            <div className="mx-auto max-w-5xl">
              <div className="border-y-4 border-[var(--color-coral)] bg-[var(--color-paper-2)] px-5 py-7 sm:px-8 sm:py-10">
                <p className="mb-4 text-sm font-medium text-[var(--color-coral-ink)]">Exclusive natural medicine discovery</p>
                <h2 className="max-w-4xl text-sift-section text-balance font-bold leading-tight tracking-[-0.04em]">Ancient Himalayan Root Extract Proven to Cure 98% of Illnesses Doctors Won&apos;t Mention!</h2>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-ink-2)] sm:text-base">
                  Big Pharma has suppressed this natural compound for 40 years. Our certified wellness clinic reveals the truth.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-xs font-semibold">★ 100% Guaranteed</span>
                  <span className="rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-xs font-semibold">✓ Clinically Tested</span>
                  <span className="rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-xs font-semibold">Certified lab verified</span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 border-l-2 border-[var(--color-coral)] bg-[var(--color-paper-2)] p-4 sm:p-5">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--color-coral-ink)]" />
                <div>
                  <strong className="text-sm font-semibold">The Vertical Reading Trap:</strong>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
                    If you only stay on this page, the badges and confident claims look convincing.
                    Now switch to <strong>Tab 2 (Lateral Search)</strong> above to see what independent regulators discovered!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Lateral Google Search */}
          {activeTab === "search" && (
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-5 sm:p-6">
                  <span className="font-mono text-xs text-sift-accent">fda.gov / regulatory-actions / warnings</span>
                  <h4 className="mt-3 text-lg font-semibold leading-snug">FDA Warning Letter: Miracle Health Remediez LLC</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    Agency cites company for marketing unapproved new drugs with false curative claims regarding cancer and diabetes. Civil injunction initiated.
                  </p>
                </div>

                <div className="border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-5 sm:p-6">
                  <span className="font-mono text-xs text-sift-accent">ftc.gov / consumer-enforcement</span>
                  <h4 className="mt-3 text-lg font-semibold leading-snug">FTC Orders $2.4M Restitution for Deceptive Medical Advertising</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    Federal Trade Commission penalizes product founder for fabricated clinical trial claims and fake doctor endorsements.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 border-l-2 border-[var(--color-success)] bg-[var(--color-accent-soft)] p-4 sm:p-5">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                <div>
                  <strong className="text-sm font-semibold">Lateral Reading Victory:</strong>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-2)]">
                    In 15 seconds, you discovered regulatory injunctions that the original website deliberately hid.
                    Now check <strong>Tab 3 (Wikipedia)</strong> for who owns the company.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Wikipedia Background (No Floats) */}
          {activeTab === "wiki" && (
            <div className="mx-auto max-w-5xl">
              <div className="border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-5 sm:p-8">
                <div className="border-b border-[var(--color-rule)] pb-5">
                  <h2 className="text-sift-title text-balance font-semibold leading-tight tracking-[-0.035em]">Miracle Health Remediez (Commercial Enterprise)</h2>
                  <span className="mt-2 block font-mono text-xs text-sift-muted">From Wikipedia, the free encyclopedia</span>
                </div>

                <div className="mt-5 grid gap-6 md:grid-cols-[0.65fr_1.35fr]">
                  <div className="h-fit border border-[var(--color-rule)] bg-[var(--color-paper)]">
                    <div className="border-b border-[var(--color-rule)] p-3 text-sm font-semibold">Miracle Health Remediez LLC</div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-[var(--color-rule)] p-3 text-xs">
                      <span className="text-[var(--color-muted)]">Type:</span>
                      <strong className="font-semibold">Private LLC</strong>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-[var(--color-rule)] p-3 text-xs">
                      <span className="text-[var(--color-muted)]">Founded:</span>
                      <strong className="font-semibold">2021</strong>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 p-3 text-xs">
                      <span className="text-[var(--color-muted)]">Medical Consensus:</span>
                      <strong className="font-semibold text-[var(--color-coral-ink)]">Debunked / Ineffective</strong>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed text-[var(--color-ink-2)]">
                    <p>
                      <strong>Miracle Health Remediez</strong> is an e-commerce dietary supplement brand.
                      Multiple medical watchdog organizations and oncology societies have published position statements
                      warning patients against substituting prescribed chemotherapy with unverified herbal powders.
                    </p>
                    <p>
                      In 2023, independent investigative journalists revealed that the founder possessed no medical degree
                      and had previously been fined for selling unauthorized weight-loss concoctions online.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 border-l-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4 text-sm leading-relaxed text-[var(--color-ink-2)] sm:p-5">
                <ShieldAlert size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <span>
                  <strong>The Media Literacy Rule:</strong> Lateral reading turns a 10-minute argument into a 30-second verification.
                  Never ask a suspect website if it is honest; ask the wider web.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
