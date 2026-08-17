import { useState } from 'react';
import { CircleCheck as CheckCircle2, Circle as XCircle, Circle as HelpCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: 'Which of these URLs looks suspicious?',
    options: [
      'https://www.amazon.in/gp/css/order-history',
      'http://amaz0n-verify.xyz/login?account=update',
      'https://www.flipkart.com/account/orders',
      'https://paytm.com/cashback',
    ],
    correct: 1,
    explanation: 'The URL uses "amaz0n" (zero instead of o), an unusual .xyz TLD, an insecure http:// connection, and suspicious keywords like "verify" and "update". These are classic phishing indicators.',
  },
  {
    question: 'A message says "Your account will be suspended in 1 hour. Click here to verify." What should you do?',
    options: [
      'Click the link immediately to save your account',
      'Reply with your account details to verify',
      'Ignore the message and check your account through the official app',
      'Forward it to all your contacts',
    ],
    correct: 2,
    explanation: 'Urgency and suspension threats are social engineering tactics. Never click links in such messages. Always check your account status through the official app or website.',
  },
  {
    question: 'Someone calls claiming to be from your bank and asks for your OTP to "verify your identity." What do you do?',
    options: [
      'Share the OTP since they said they are from the bank',
      'Refuse and hang up — banks never ask for OTPs',
      'Share only the last 4 digits of the OTP',
      'Ask them to call back later',
    ],
    correct: 1,
    explanation: 'No legitimate organization will ever ask for your OTP — not even customer support. Treat every OTP like your ATM PIN. Hang up immediately and report the call.',
  },
];

export function PhishingQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 < QUESTIONS.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="surface rounded-xl p-6 text-center">
        <HelpCircle className="mx-auto h-10 w-10 text-brand" />
        <p className="mt-4 font-display text-2xl font-bold text-white">{score} / {QUESTIONS.length}</p>
        <p className="mt-1 text-sm text-slate-400">
          {score === QUESTIONS.length ? 'Perfect score! You can spot phishing attempts.' : 'Keep practicing — phishing gets more sophisticated every day.'}
        </p>
        <button onClick={restart} className="btn-ghost mt-4">Try Again</button>
      </div>
    );
  }

  return (
    <div className="surface rounded-xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="label">Question {current + 1} of {QUESTIONS.length}</p>
        <p className="text-xs text-slate-500">Score: {score}</p>
      </div>
      <p className="mb-4 text-sm font-medium text-slate-200">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isSelected = i === selected;
          let style = 'surface-2 text-slate-300 hover:bg-ink-700';
          if (answered && isCorrect) style = 'bg-safe/10 text-safe border border-safe/30';
          else if (answered && isSelected && !isCorrect) style = 'bg-critical/10 text-critical border border-critical/30';
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`flex w-full items-center justify-between gap-3 rounded-lg p-3 text-left text-sm transition ${style}`}
            >
              <span>{opt}</span>
              {answered && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
              {answered && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-4 animate-fade-in">
          <div className={`rounded-lg p-3 text-sm ${selected === q.correct ? 'bg-safe/5 text-safe' : 'bg-critical/5 text-critical'}`}>
            <p className="font-medium">{selected === q.correct ? 'Correct!' : 'Incorrect'}</p>
            <p className="mt-1 text-slate-400">{q.explanation}</p>
          </div>
          <button onClick={next} className="btn-primary mt-4">
            {current + 1 < QUESTIONS.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
