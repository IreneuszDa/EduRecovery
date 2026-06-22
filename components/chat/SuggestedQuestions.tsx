// file: components/chat/SuggestedQuestions.tsx (poprawiona wersja z wyrównaniem do lewej)
'use client';

import { motion, Variants } from 'framer-motion';

interface SuggestedQuestionsProps {
  questions: string[];
  onSuggestionClick: (prompt: string) => void;
}

// Warianty animacji dla kontenera, który zarządza pojawianiem się dzieci
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
    }
  }
};

// Warianty animacji dla każdego przycisku z sugestią
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.2, 
      ease: "easeOut" 
    } 
  }
};

export function SuggestedQuestions({ questions, onSuggestionClick }: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    // Główny kontener. Usunięto 'w-full', aby blok mógł być poprawnie wyrównany do lewej przez swojego rodzica.
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-5 mb-2 max-w-4xl" // Usunięto klasę 'w-full'
    >
      {/* Elastyczny kontener wyrównuje przyciski do lewej (justify-start to domyślne zachowanie) */}
      <div className="flex flex-wrap justify-start gap-2 md:gap-3">
        {questions.map((question, index) => (
          <motion.button
            key={index}
            variants={itemVariants}
            onClick={() => onSuggestionClick(question)}
            // Subtelna animacja uniesienia przy najechaniu i wciśnięciu
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            // Nowe, minimalistyczne style przycisku
            className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
          >
            {question}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}