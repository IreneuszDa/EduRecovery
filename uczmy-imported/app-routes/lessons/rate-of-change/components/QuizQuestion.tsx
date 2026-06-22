"use client";

import { useState, FormEvent } from "react";
import { MathJax } from "better-react-mathjax";
import { motion } from "framer-motion";

interface QuizQuestionProps { onCorrectAnswer: () => void; }

export default function QuizQuestion({ onCorrectAnswer }: QuizQuestionProps) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{type: 'correct' | 'incorrect', message: string} | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (parseInt(answer) === 50) {
      setFeedback({ type: 'correct', message: "Doskonale! To jest właśnie tempo zmian. W ciągu każdej sekundy przybywa 50ml wody." });
      setTimeout(onCorrectAnswer, 1500);
    } else {
      setFeedback({ type: 'incorrect', message: "Jeszcze raz! Przyjrzyj się wzorowi i spróbuj ponownie. O ile wzrasta 'v', gdy 't' rośnie o 1?" });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-slate-600 dark:text-slate-300">
        Wiesz już, że objętość wody po `t` sekundach opisuje wzór: <MathJax inline>{"$v(t) = 50t$"}</MathJax>.
      </p>
      <p className="font-semibold text-slate-800 dark:text-slate-200">
        Ile mililitrów wody jest dodawane do butelki w ciągu każdej sekundy?
      </p>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-4">
        <input
          type="number" value={answer} onChange={(e) => setAnswer(e.target.value)}
          className="w-40 rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          placeholder="Odpowiedź"
        />
        <span className="text-slate-500 dark:text-slate-400">ml/s</span>
        <button type="submit" className="rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition-all transform hover:scale-[1.02] hover:bg-blue-600 shadow-lg">
          Sprawdź
        </button>
      </form>
      {feedback && (
        <motion.div
         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
         className={`mt-4 text-sm p-3 rounded-xl ${
            feedback.type === 'correct' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-700/50' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-700/50'
         }`}
        >
          {feedback.message}
        </motion.div>
      )}
    </div>
  );
}