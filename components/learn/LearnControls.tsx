// app/components/learn/LearnControls.tsx

"use client";

import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { LearnMode } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface LearnControlsProps {
    learnMode: LearnMode;
    isRevealed: boolean;
    isFirstCard: boolean;
    isLastCard: boolean;
    answerState: 'idle' | 'correct' | 'incorrect'; // NEW: For typed mode feedback
    onReveal: () => void;
    onNext: () => void;
    onPrev: () => void;
    onMarkKnown: () => void;
    onMarkUnknown: () => void;
    onCheckAnswer: () => void; // NEW: For typed mode
}

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -10 },
};

const layoutTransition = {
    stiffness: 300,
    damping: 30,
};

export function LearnControls({
    learnMode,
    isRevealed,
    isFirstCard,
    isLastCard,
    answerState,
    onReveal,
    onNext,
    onPrev,
    onMarkKnown,
    onMarkUnknown,
    onCheckAnswer,
}: LearnControlsProps) {
    const renderContent = () => {
        // --- NEW: Typed Mode Controls ---
        if (learnMode === 'typed') {
            if (!isRevealed) {
                return (
                    <motion.div key="typed-check" layout transition={layoutTransition} initial="hidden" animate="visible" exit="exit">
                        <motion.button
                            layoutId="main-action-button"
                            transition={layoutTransition}
                            onClick={onCheckAnswer}
                            className="w-64 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-1"
                        >
                            Sprawdź
                        </motion.button>
                    </motion.div>
                );
            }
            // After revealing in typed mode
            if (answerState === 'correct') {
                return (
                    <motion.div key="typed-correct" layout variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                        <button onClick={onNext} className="w-64 flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold text-white bg-green-500 rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-1">
                            <CheckCircle className="w-6 h-6" />
                            <span>Dobrze!</span>
                        </button>
                    </motion.div>
                );
            }
            return (
                <motion.div key="typed-incorrect" layout variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                    <button onClick={onNext} className="w-64 flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold text-white bg-red-500 rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:-translate-y-1">
                        <XCircle className="w-6 h-6" />
                        <span>Dalej</span>
                    </button>
                </motion.div>
            );
        }

        // --- Vanilla Mode Controls ---
        if (learnMode === 'vanilla') {
            return (
                <motion.div key="vanilla-controls" layout transition={layoutTransition} className="flex items-center justify-center gap-4" initial="hidden" animate="visible" exit="exit">
                    <motion.button variants={itemVariants} onClick={onPrev} disabled={isFirstCard} className="p-3 text-gray-500 rounded-full hover:bg-slate-200 disabled:text-gray-300 disabled:bg-transparent transition-colors" aria-label="Poprzednia karta">
                        <ChevronLeft className="w-8 h-8" />
                    </motion.button>
                    <motion.button layoutId="main-action-button" transition={layoutTransition} onClick={isRevealed ? onNext : onReveal} disabled={isRevealed && isLastCard} className="w-64 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-1 disabled:bg-blue-400 disabled:transform-none disabled:shadow-none">
                        {isRevealed ? "Następna" : "Odkryj"}
                    </motion.button>
                    <motion.button variants={itemVariants} onClick={onNext} disabled={isLastCard} className="p-3 text-gray-500 rounded-full hover:bg-slate-200 disabled:text-gray-300 disabled:bg-transparent transition-colors" aria-label="Następna karta">
                        <ChevronRight className="w-8 h-8" />
                    </motion.button>
                </motion.div>
            );
        }

        // --- Active Mode Controls ---
        if (learnMode === 'active') {
            return (
                <motion.div key="active-controls" layout transition={layoutTransition} className="flex items-center justify-center w-full max-w-md gap-4" initial="hidden" animate="visible" exit="exit">
                    {!isRevealed ? (
                        <motion.button layoutId="main-action-button" transition={layoutTransition} onClick={onReveal} className="w-64 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-1">
                            Odkryj odpowiedź
                        </motion.button>
                    ) : (
                        <motion.div layout variants={itemVariants} className="flex items-center justify-center w-full gap-4">
                            <button onClick={onMarkUnknown} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold text-white bg-red-500 rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:-translate-y-1"><XCircle className="w-6 h-6" /><span>Nie wiem</span></button>
                            <button onClick={onMarkKnown} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold text-white bg-green-500 rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-1"><CheckCircle className="w-6 h-6" /><span>Wiem</span></button>
                        </motion.div>
                    )}
                </motion.div>
            );
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-24">
            <AnimatePresence mode="wait" initial={false}>
                {renderContent()}
            </AnimatePresence>
        </div>
    );
}