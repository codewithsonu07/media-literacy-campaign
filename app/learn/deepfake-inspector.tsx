"use client";

import { useState } from "react";
import { Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";

interface InspectionPoint {
  id: string;
  feature: string;
  shortFeature: string;
  realSignal: string;
  aiArtifactSignal: string;
  forensicClue: string;
}

const INSPECTION_POINTS: InspectionPoint[] = [
  {
    id: "hands",
    feature: "Hand Anatomy & Fingers",
    shortFeature: "Hands",
    realSignal:
      "Natural finger articulation with clear joints, distinct nailbeds, and realistic skin folds.",
    aiArtifactSignal:
      "Fingers often merge, multiply (6 fingers), or lack knuckles; jewelry melts into the skin.",
    forensicClue:
      "Diffusion models struggle with complex 3D skeletal geometry under perspective foreshortening.",
  },
  {
    id: "eyes",
    feature: "Pupils & Light Reflections (Catchlights)",
    shortFeature: "Eyes and light",
    realSignal:
      "Matching specular reflections in both eyes corresponding to the actual light sources in the scene.",
    aiArtifactSignal:
      "Mismatched catchlights (e.g., circular glare in left eye, rectangular glare in right eye); non-circular pupils.",
    forensicClue:
      "Generative AI creates each eye independently, failing physics-based ray-tracing consistency.",
  },
  {
    id: "text",
    feature: "Background Typography & Signage",
    shortFeature: "Text",
    realSignal:
      "Legible, coherent words on road signs, storefronts, and badges with standard typography.",
    aiArtifactSignal:
      "Garbled pseudo-letters, gibberish script, and warped letterforms that look like alien language.",
    forensicClue:
      "Image synthesis models predict visual pixel patches, not actual language semantics.",
  },
  {
    id: "ears",
    feature: "Ear Cartilage & Symmetry",
    shortFeature: "Ears",
    realSignal:
      "Distinct helix, tragus, and earlobe structure with consistent earrings and hair separation.",
    aiArtifactSignal:
      "Asymmetrical or melted ears; earrings on one side that disappear or fuse into the jawline.",
    forensicClue:
      "Ears have high anatomical variation in training sets, leading to blurry, unresolved renders.",
  },
  {
    id: "texture",
    feature: "Skin Porosity vs Plastic Gloss",
    shortFeature: "Skin texture",
    realSignal:
      "Organic micro-textures: pores, fine wrinkles, blemishes, and natural subsurface scattering.",
    aiArtifactSignal:
      "Hyper-smooth, airbrushed, plastic-like sheen resembling ceramic figurines or video-game CGI.",
    forensicClue:
      "Denoising algorithms average out high-frequency texture details, creating artificial smoothness.",
  },
];

export default function DeepfakeInspector() {
  const [selectedPointId, setSelectedPointId] = useState<string>("hands");
  const [activeView, setActiveView] = useState<"ai" | "real">("ai");

  const currentPoint =
    INSPECTION_POINTS.find((p) => p.id === selectedPointId) ||
    INSPECTION_POINTS[0];

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-[var(--color-rule)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="max-w-3xl text-sift-title font-semibold leading-tight tracking-[-0.035em]">Spotting Synthetic &amp; AI-Generated Media</h3>
        </div>
        <div className="flex w-fit flex-wrap gap-2 rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-1">
          <button
            className={`inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 ${
              activeView === "ai"
                ? "bg-[var(--color-coral-ink)] text-[var(--color-paper-2)]"
                : "text-[var(--color-muted)] hover:bg-[var(--color-paper-3)]"
            }`}
            onClick={() => setActiveView("ai")}
            type="button"
          >
            <Sparkles size={13} /> AI artifacts
          </button>
          <button
            className={`inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 ${
              activeView === "real"
                ? "bg-[var(--color-success)] text-[var(--color-paper-2)]"
                : "text-[var(--color-muted)] hover:bg-[var(--color-paper-3)]"
            }`}
            onClick={() => setActiveView("real")}
            type="button"
          >
            <CheckCircle2 size={13} /> Real photo
          </button>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
        While AI image generators (Midjourney, DALL-E, Flux) produce stunning
        compositions, they routinely fail microscopic physical and anatomical
        tests. Select a forensic check below:
      </p>

      {/* Point Selector Chips */}
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choose a forensic check">
        {INSPECTION_POINTS.map((pt) => (
          <button
            key={pt.id}
            aria-label={pt.feature}
            className={`min-h-10 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 ${
              selectedPointId === pt.id
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-2)] hover:border-[var(--color-accent)]"
            }`}
            onClick={() => setSelectedPointId(pt.id)}
            type="button"
          >
            {pt.shortFeature}
          </button>
        ))}
      </div>

      {/* Visual Diagnostic Display */}
      <div className="mt-7 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-h-[27rem] rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-green)] p-5 text-[var(--color-paper)] sm:p-7">
          <div
            className={`flex h-full min-h-[23rem] flex-col justify-between rounded-[var(--radius-input)] border p-4 sm:p-6 ${
              activeView === "ai"
                ? "border-[var(--color-coral)]"
                : "border-[var(--color-success)]"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 self-start rounded-full border border-[var(--color-paper-3)] px-3 py-2 text-xs font-semibold">
              {activeView === "ai" ? (
                <>
                  <ShieldAlert size={14} className="text-[var(--color-coral)]" />
                  <span>Synthetic media anomaly</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="text-[var(--color-lime)]" />
                  <span>Authentic photojournalism</span>
                </>
              )}
            </div>

            <div className="mx-auto flex aspect-square w-full max-w-[18rem] flex-col items-center justify-center rounded-full border border-[var(--color-paper-3)] p-5 text-center">
              <span className="relative mb-5 block h-7 w-7 rounded-full border border-[var(--color-lime)] before:absolute before:left-1/2 before:top-[-0.5rem] before:h-10 before:w-px before:-translate-x-1/2 before:bg-[var(--color-lime)] after:absolute after:left-[-0.5rem] after:top-1/2 after:h-px after:w-10 after:-translate-y-1/2 after:bg-[var(--color-lime)]" />
              <div className="text-sm leading-relaxed text-[var(--color-paper-2)]">
                {activeView === "ai"
                  ? currentPoint.aiArtifactSignal
                  : currentPoint.realSignal}
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--color-paper-3)] pt-4 font-mono text-xs leading-relaxed text-[var(--color-paper-3)]">
              <span>Forensic test: {currentPoint.feature}</span>
              <span>Magnification: 400%</span>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-5 sm:p-7">
          <h4 className="text-xl font-semibold leading-tight tracking-[-0.025em]">Forensic principle: {currentPoint.feature}</h4>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{currentPoint.forensicClue}</p>

          <div className="mt-6 grid gap-3">
              <div className="border-l-2 border-[var(--color-coral)] bg-[var(--color-paper-2)] p-4">
                <strong className="text-sm font-semibold text-[var(--color-coral-ink)]">AI generative weakness:</strong>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-2)]">{currentPoint.aiArtifactSignal}</p>
              </div>
              <div className="border-l-2 border-[var(--color-success)] bg-[var(--color-paper-2)] p-4">
                <strong className="text-sm font-semibold text-[var(--color-success)]">Real camera physics:</strong>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-2)]">{currentPoint.realSignal}</p>
              </div>
          </div>

          <div className="mt-6 border-t border-[var(--color-rule)] pt-5">
              <strong className="text-sm font-semibold text-[var(--color-accent)]">SIFT lateral move:</strong>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                Never rely solely on visual inspection! Reverse-search the image
                using Google Lens or TinEye. If world leaders were truly
                captured in a crisis, established wire photographers (AP,
                Reuters, AFP) would have published hundreds of verified frames.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}
