// components/exams/learn/QuestionCard.tsx
'use client';

import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { Question, QuestionType } from '../question-types';
import { QuestionViewRenderer } from './QuestionViews';
import { ActionFooter } from './ActionFooter';

type UserAnswer = string | boolean[] | string[] | null;

// --- POCZĄTEK ZMIANY ---
interface QuestionCardProps {
    examId: string;
    isEmbedded: boolean; // Dodano właściwość do kontrolowania widoczności przycisku
    question: Question;
    currentIndex: number;
    totalQuestions: number;
    userAnswer: UserAnswer;
    isAnswerChecked: boolean;
    isAnswerProvided: boolean;
    isAnswerCorrect: boolean | null;
    animationDirection: number;
    animationVariants: any;
    onAnswer: (questionId: string, answer: UserAnswer) => void;
    onCheckAnswer: () => void;
    onAiEvaluate: () => void;
    onContinue: () => void;
    onPrevious: () => void;
    onGoBackToQuestion: () => void;
    isCheckingAi: boolean;
}
// --- KONIEC ZMIANY ---

export function QuestionCard({
    examId,
    isEmbedded, // Dodano do propsów
    question,
    currentIndex,
    totalQuestions,
    userAnswer,
    isAnswerChecked,
    isAnswerProvided,
    isAnswerCorrect,
    animationDirection,
    animationVariants,
    onAnswer,
    onCheckAnswer,
    onAiEvaluate,
    onContinue,
    onPrevious,
    onGoBackToQuestion,
    isCheckingAi,
}: QuestionCardProps) {
    const router = useRouter();

    return (
        <motion.div
            key={currentIndex}
            custom={animationDirection}
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700 rounded-[var(--radius-card)] shadow-lg flex flex-col flex-grow"
        >
            <div className="p-[var(--space-lg)] md:p-[var(--space-xl)] flex-grow">
                <div className="flex justify-between items-start mb-[var(--margin-lg)] gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[var(--font-size-lg)] font-bold text-slate-800 dark:text-slate-100 leading-tight">
                            Pytanie {currentIndex + 1} <span className="text-slate-400 dark:text-slate-500 font-medium">/ {totalQuestions}</span>
                        </h3>
                        {/* --- POCZĄTEK ZMIANY: Warunkowe renderowanie przycisku --- */}
                        {isEmbedded && (
                            <button
                                onClick={() => router.push(`/dashboard/exams/learn/${examId}`)}
                                className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors duration-200"
                                aria-label="Otwórz egzamin w pełnym widoku"
                                title="Otwórz w pełnym widoku"
                            >
                                <ExternalLink className="w-[var(--icon-size-xs)] h-[var(--icon-size-xs)]" />
                            </button>
                        )}
                        {/* --- KONIEC ZMIANY --- */}
                    </div>

                    {question.points && (
                        <span className="text-[var(--font-size-sm)] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] rounded-[var(--radius-badge)]">
                            {question.points}
                        </span>
                    )}
                </div>

                {'content' in question && question.content && (
                    <div className="text-slate-800 dark:text-slate-200 text-[var(--font-size-base)] mb-[var(--margin-lg)] leading-relaxed">
                        <MathJax>{question.content}</MathJax>
                    </div>
                )}

                {question.imageUrl && (
                    <div className="my-[var(--margin-lg)] flex justify-center">
                        <img src={question.imageUrl} alt={`Ilustracja do pytania ${currentIndex + 1}`} className="max-w-full max-h-[var(--image-max-height)] object-contain rounded-[var(--radius-image)] shadow-md" />
                    </div>
                )}

                <QuestionViewRenderer
                    q={question}
                    userAnswer={userAnswer}
                    onAnswer={onAnswer}
                    isAnswerChecked={isAnswerChecked}
                />
            </div>

            <ActionFooter
                isAnswerChecked={isAnswerChecked}
                isAnswerCorrect={isAnswerCorrect}
                isAnswerProvided={isAnswerProvided}
                isLastQuestion={currentIndex === totalQuestions - 1}
                currentIndex={currentIndex}
                onCheckAnswer={onCheckAnswer}
                onAiEvaluate={onAiEvaluate}
                onContinue={onContinue}
                onPrevious={onPrevious}
                onGoBackToQuestion={onGoBackToQuestion}
                isCheckingAi={isCheckingAi}
                questionType={question.questionType}
            />
        </motion.div>
    );
}