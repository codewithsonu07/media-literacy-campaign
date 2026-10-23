import QuizPractice from "./quiz-practice";

export const metadata = {
  title: "News Detective: Forensic Simulation Lab | Sift It",
  description:
    "Practice investigating simulated social posts, manipulated charts, spoofed accounts, and synthetic media.",
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-sift-paper text-sift-ink">
      <div className="mx-auto w-full max-w-7xl px-sift-md py-7 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-5 border-b border-sift-rule pb-5 sm:mb-7 sm:pb-6">
          <h1 className="font-sift-display text-balance text-sift-section font-semibold tracking-[-0.04em]">
            News Detective
          </h1>
        </header>

        <section
          aria-label="News detective simulation"
          className="[&_button:active]:translate-y-px"
        >
          <QuizPractice />
        </section>
      </div>
    </div>
  );
}
