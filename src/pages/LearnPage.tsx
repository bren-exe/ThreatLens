import { useRouter } from '@/components/Router';
import { PhishingQuiz } from '@/components/PhishingQuiz';
import { FAQ } from '@/components/FAQ';

export function LearnPage() {
  const { navigate } = useRouter();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-white">Learn Digital Safety</h1>
        <p className="mt-1 text-sm text-slate-400">Test your phishing awareness and find answers to common questions.</p>
      </div>

      <div className="mb-10">
        <p className="section-eyebrow">Interactive Quiz</p>
        <h2 className="mt-2 font-display text-lg font-semibold text-white">Test Your Phishing Awareness</h2>
        <p className="mt-1 text-sm text-slate-400">A quick quiz to sharpen your scam-spotting skills.</p>
        <div className="mt-5">
          <PhishingQuiz />
        </div>
      </div>

      <div>
        <p className="section-eyebrow">FAQ</p>
        <h2 className="mt-2 font-display text-lg font-semibold text-white">Frequently Asked Questions</h2>
        <div className="mt-5">
          <FAQ />
        </div>
      </div>

      <div className="mt-10 surface rounded-xl p-6 text-center">
        <p className="text-sm text-slate-400">Want to learn more about staying safe online?</p>
        <button onClick={() => navigate('safety')} className="btn-ghost mt-4">
          Visit the Safety Center
        </button>
      </div>
    </div>
  );
}
