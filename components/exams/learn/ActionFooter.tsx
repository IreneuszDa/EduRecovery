// components/exams/learn/ActionFooter.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon, ArrowRightIcon, ArrowPathIcon, SparklesIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { QuestionType } from '../question-types';

interface ActionFooterProps {
    isAnswerChecked: boolean;
    isAnswerCorrect: boolean | null;
    isAnswerProvided: boolean;
    isLastQuestion: boolean;
    currentIndex: number;
    onCheckAnswer: () => void;
    onAiEvaluate: () => void;
    onContinue: () => void;
    onPrevious: () => void;
    onGoBackToQuestion: () => void;
    isCheckingAi: boolean;
    questionType: QuestionType;
}

export function ActionFooter({
    isAnswerChecked,
    isAnswerCorrect,
    isAnswerProvided,
    isLastQuestion,
    currentIndex,
    onCheckAnswer,
    onAiEvaluate,
    onContinue,
    onPrevious,
    onGoBackToQuestion,
    isCheckingAi,
    questionType,
}: ActionFooterProps) {
    const arrowButtonClasses = "p-[var(--button-p-arrow)] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[var(--radius-button)] shadow hover:bg-slate-300 dark:hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-500/50 transform active:scale-95 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none";

    // Main action button classes, now with responsive font size baked in
    const mainButtonClasses = "px-[var(--button-px-main)] py-[var(--button-py-main)] flex justify-center items-center text-white font-bold text-[var(--font-size-sm)] md:text-[var(--font-size-lg)] rounded-[var(--radius-button)] shadow-md transform active:scale-95 transition-all duration-200 ease-in-out disabled:shadow-none disabled:cursor-not-allowed";

    const isAiQuestion = questionType === QuestionType.OpenEnded || questionType === QuestionType.FillInTheBlank;

    let feedbackBannerClass = '';
    let feedbackText = '';
    if (isAnswerCorrect !== null) {
        if (isAnswerCorrect) {
            feedbackBannerClass = 'bg-green-50 dark:bg-green-500/10';
            feedbackText = 'Dobra robota!';
        } else {
            feedbackBannerClass = 'bg-red-50 dark:bg-red-500/10';
            feedbackText = 'Błędna odpowiedź';
        }
    } else {
        feedbackBannerClass = 'bg-slate-50 dark:bg-slate-800/50';
        feedbackText = 'Odpowiedź sprawdzona';
    }

    return (
        <div className="border-t border-slate-200/80 dark:border-slate-700 rounded-b-[var(--radius-card)] overflow-hidden">
            <AnimatePresence mode="wait">
                {isAnswerChecked ? (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        // Forced single-line layout for feedback state
                        className={`p-[var(--space-md)] md:p-[var(--space-lg)] flex flex-row items-center justify-between gap-[var(--space-md)] ${feedbackBannerClass}`}
                        aria-live="polite"
                    >
                        {/* Status text group - allow content to shrink if needed */}
                        <div className="flex items-center gap-[var(--space-sm)] min-w-0">
                            {isAnswerCorrect === true && <CheckCircleIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-green-500" />}
                            {isAnswerCorrect === false && <XCircleIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-red-500" />}
                            {isAnswerCorrect === null && <CheckCircleIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-slate-500 dark:text-slate-400" />}

                            <p className={`font-bold text-[var(--font-size-lg)] text-center md:text-left ${isAnswerCorrect === true ? 'text-green-800 dark:text-green-300' : isAnswerCorrect === false ? 'text-red-800 dark:text-red-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                {feedbackText}
                            </p>
                        </div>
                        {/* Action buttons group - allow content to shrink if needed */}
                        <div className="flex items-center gap-[var(--space-sm)] min-w-0">
                            {isAnswerCorrect === null && (
                                <button
                                    onClick={onGoBackToQuestion}
                                    className="px-[var(--button-px-back)] py-[var(--button-py-back)] flex items-center gap-[var(--space-xs)] text-slate-700 dark:text-slate-200 font-semibold bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-[var(--radius-button)] shadow-sm hover:bg-slate-100 dark:hover:bg-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-500/50 transform active:scale-95 transition-all"
                                >
                                    <ArrowUturnLeftIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                                    <span className="text-[var(--font-size-sm)] md:text-[var(--font-size-base)]">Wróć</span>
                                </button>
                            )}

                            <button
                                onClick={onContinue}
                                className={`px-[var(--button-px-continue)] py-[var(--button-py-continue)] text-white font-semibold text-[var(--font-size-sm)] md:text-[var(--font-size-lg)] rounded-[var(--radius-button)] shadow-md focus-visible:outline-none focus-visible:ring-4 transition-all transform active:scale-95 ${isAnswerCorrect === true ? 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-300' : isAnswerCorrect === false ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-300' : 'bg-slate-600 hover:bg-slate-700 focus-visible:ring-slate-300'}`}
                            >
                                {isLastQuestion ? 'Zakończ' : 'Dalej'}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="check"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        // Forced single-line layout for check state
                        className="p-[var(--space-md)] md:p-[var(--space-lg)] flex flex-row items-center justify-between gap-[var(--space-sm)] bg-white/50 dark:bg-slate-800/30"
                    >
                        {/* Left group: Prev/Next. min-w-0 for shrinking content */}
                        <div className="flex gap-[var(--space-sm)] min-w-0">
                            <button
                                onClick={onPrevious}
                                disabled={currentIndex === 0 || isCheckingAi}
                                className={arrowButtonClasses}
                                aria-label="Poprzednie pytanie"
                            >
                                <ArrowLeftIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />
                            </button>
                            <button
                                onClick={onContinue}
                                disabled={isCheckingAi}
                                className={arrowButtonClasses}
                                aria-label={isLastQuestion ? "Zobacz podsumowanie" : "Następne pytanie"}
                            >
                                {isLastQuestion ? <CheckCircleIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" /> : <ArrowRightIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)]" />}
                            </button>
                        </div>

                        {/* Right group: Action Buttons. min-w-0 for shrinking content */}
                        <div className="flex items-center gap-[var(--space-sm)] min-w-0">
                            {isAiQuestion ? (
                                <>
                                    <button
                                        onClick={onCheckAnswer}
                                        disabled={isCheckingAi}
                                        className={`${mainButtonClasses} bg-slate-500 hover:bg-slate-600 focus-visible:ring-slate-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 dark:disabled:text-slate-400`}
                                    >
                                        {/* Conditionally render text based on screen size */}
                                        <span className="hidden md:inline">Pokaż odp.</span>
                                        <span className="inline md:hidden">Odp.</span>
                                    </button>
                                    <button
                                        onClick={onAiEvaluate}
                                        disabled={!isAnswerProvided || isCheckingAi}
                                        className={`${mainButtonClasses} bg-blue-600 shadow-lg shadow-blue-500/30 hover:bg-blue-700 focus-visible:ring-blue-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 dark:disabled:text-slate-400`}
                                    >
                                        {isCheckingAi ? (
                                            <>
                                                <ArrowPathIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] animate-spin mr-[var(--space-xs)]" />
                                                <span className="hidden md:inline">Oceniam...</span>
                                                <span className="inline md:hidden">AI...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] mr-[var(--space-xs)]" />
                                                <span className="hidden md:inline">Oceń z AI</span>
                                                <span className="inline md:hidden">AI</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onCheckAnswer}
                                    disabled={!isAnswerProvided}
                                    className={`${mainButtonClasses} bg-blue-600 shadow-lg shadow-blue-500/30 hover:bg-blue-700 focus-visible:ring-blue-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 dark:disabled:text-slate-400`}
                                >
                                    <span>Sprawdź</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}