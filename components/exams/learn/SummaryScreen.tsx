// components/exams/learn/SummaryScreen.tsx
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface SummaryResults {
    score: number;
    totalPoints: number;
    correctCount: number;
    autoScorableCount: number;
}

interface SummaryScreenProps {
    results: SummaryResults;
    onRestart: () => void;
    animationDirection: number;
    animationVariants: any;
}

export function SummaryScreen({ results, onRestart, animationDirection, animationVariants }: SummaryScreenProps) {
    const router = useRouter();

    const handleFinish = () => {
        router.push('/dashboard/exams');
    };

    const percentage = results.totalPoints > 0 ? (results.score / results.totalPoints) * 100 : 0;

    return (
        <motion.div
            key="summary"
            custom={animationDirection}
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700 rounded-[var(--radius-card)] shadow-lg flex flex-col flex-grow items-center justify-center p-4 text-center"
        >
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 15 }}
                    className="mb-6"
                >
                    <TrophyIcon className="mx-auto h-20 w-20 text-yellow-400 drop-shadow-lg" />
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, ease: 'easeOut' }}
                    className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl"
                >
                    Quiz Zakończony!
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, ease: 'easeOut' }}
                    className="mt-4 max-w-md text-lg text-slate-600 dark:text-slate-400"
                >
                    Świetna robota! Zobaczmy, jak Ci poszło.
                </motion.p>

                {/* --- Stats Container --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-8 rounded-xl border border-slate-200 bg-white/50 p-6 dark:border-slate-700 dark:bg-slate-800/50"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Twój Wynik</span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                    <div className="mt-2 text-left text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {results.score}<span className="text-base font-medium text-slate-500 dark:text-slate-400"> / {results.totalPoints} pkt</span>
                    </div>
                    <p className="mt-1 text-left text-xs text-slate-500 dark:text-slate-400">
                        {results.correctCount} z {results.autoScorableCount} poprawnych odpowiedzi
                    </p>
                </motion.div>

                {/* --- Action Buttons --- */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, ease: 'easeOut' }}
                    className="mt-8 flex flex-col items-center gap-3"
                >
                    <button
                        onClick={onRestart}
                        className="h-12 w-full max-w-xs rounded-lg bg-blue-600 px-10 text-base font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 active:scale-[0.98] dark:focus-visible:ring-blue-500/70"
                    >
                        Spróbuj ponownie
                    </button>

                </motion.div>
            </div>
        </motion.div>
    );
}