// components/exams/LearnView.tsx (ZMODYFIKOWANY)
'use client';

import { useState, useMemo, useEffect, CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Question, QuestionType } from './question-types';

import { ProgressBar } from './learn/ProgressBar';
import { QuestionCard } from './learn/QuestionCard';
import { SummaryScreen } from './learn/SummaryScreen';

// --- POCZĄTEK: CENTRALNY OBIEKT KONFIGURACJI ROZMIARU ---

const sizeProfiles = {
    /**
     * Standardowy, przestronny wygląd.
     */
    default: {
        // === 1. Layout & Container ===
        '--main-max-width': '42rem',        // max-w-3xl
        '--main-min-height': '650px',
        '--main-padding-x': '1.5rem',       // sm:px-6
        '--progress-bar-height': '1rem',    // h-4

        // === 2. Sizing & Spacing ===
        '--space-xs': '0.5rem',             // gap-2
        '--space-sm': '0.75rem',            // gap-3
        '--space-md': '1rem',               // p-4
        '--space-lg': '1.5rem',             // p-6
        '--space-xl': '2rem',               // p-8
        '--space-xxl': '3rem',              // p-12
        '--margin-sm': '1rem',              // mb-4
        '--margin-lg': '1.5rem',            // mb-6
        '--margin-xl': '3rem',              // mt-12

        // === 3. Borders & Radii ===
        '--radius-card': '1.5rem',          // rounded-3xl for main cards
        '--radius-container': '1rem',       // rounded-2xl for inner containers
        '--radius-button': '0.75rem',       // rounded-xl for buttons
        '--radius-badge': '9999px',         // rounded-full
        '--radius-image': '0.5rem',         // rounded-lg

        // === 4. Fonts ===
        '--font-size-sm': '0.875rem',       // text-sm
        '--font-size-base': '1rem',         // text-base
        '--font-size-lg': '1.125rem',       // text-lg
        '--font-size-xl': '1.25rem',        // text-xl
        '--font-size-header-summary': '3rem',// text-5xl

        // === 5. Icons & Images ===
        '--icon-size-xs': '1.25rem',        // h-5
        '--icon-size-sm': '1.5rem',         // h-6
        '--icon-size-md': '1.75rem',        // h-7
        '--icon-size-lg': '2rem',           // h-8
        '--icon-size-xl': '7rem',           // h-28 (Trophy Icon)
        '--image-max-height': '20rem',      // max-h-80

        // === 6. Component-Specific Button Paddings & Sizes ===
        '--badge-padding-x': '0.75rem',
        '--badge-padding-y': '0.25rem',
        '--mcq-key-size': '2rem',
        '--tf-button-px': '2rem',
        '--tf-button-py': '0.75rem',
        '--button-p-arrow': '1rem',
        '--button-px-main': '1.5rem',
        '--button-py-main': '0.875rem',
        '--button-px-back': '1.25rem',
        '--button-py-back': '0.75rem',
        '--button-px-continue': '2rem',
        '--button-py-continue': '0.75rem',
        '--button-h-summary-lg': '4rem',    // h-16
        '--button-h-summary-md': '3rem',    // h-12

    } as CSSProperties,

    /**
     * Mniejszy, bardziej zwarty wygląd.
     */
    compact: {
        // === 1. Layout & Container ===
        '--main-max-width': '36rem',        // max-w-2xl
        '--main-min-height': '580px',
        '--main-padding-x': '1rem',
        '--progress-bar-height': '0.75rem', // h-3

        // === 2. Sizing & Spacing ===
        '--space-xs': '0.375rem',
        '--space-sm': '0.5rem',
        '--space-md': '0.75rem',
        '--space-lg': '1.25rem',
        '--space-xl': '1.5rem',
        '--space-xxl': '2.5rem',
        '--margin-sm': '0.75rem',
        '--margin-lg': '1rem',
        '--margin-xl': '2.5rem',

        // === 3. Borders & Radii ===
        '--radius-card': '1.25rem',
        '--radius-container': '0.75rem',
        '--radius-button': '0.625rem',
        '--radius-badge': '9999px',
        '--radius-image': '0.375rem',

        // === 4. Fonts ===
        '--font-size-sm': '0.8rem',
        '--font-size-base': '0.9rem',
        '--font-size-lg': '1rem',
        '--font-size-xl': '1.125rem',
        '--font-size-header-summary': '2.25rem', // text-4xl

        // === 5. Icons & Images ===
        '--icon-size-xs': '1.1rem',
        '--icon-size-sm': '1.25rem',
        '--icon-size-md': '1.5rem',
        '--icon-size-lg': '1.75rem',
        '--icon-size-xl': '5rem',           // h-20 (Trophy Icon)
        '--image-max-height': '16rem',      // max-h-64

        // === 6. Component-Specific Button Paddings & Sizes ===
        '--badge-padding-x': '0.625rem',
        '--badge-padding-y': '0.125rem',
        '--mcq-key-size': '1.75rem',
        '--tf-button-px': '1.5rem',
        '--tf-button-py': '0.5rem',
        '--button-p-arrow': '0.75rem',
        '--button-px-main': '1.25rem',
        '--button-py-main': '0.625rem',
        '--button-px-back': '1rem',
        '--button-py-back': '0.5rem',
        '--button-px-continue': '1.5rem',
        '--button-py-continue': '0.625rem',
        '--button-h-summary-lg': '3rem',    // h-12
        '--button-h-summary-md': '2.75rem', // h-11

    } as CSSProperties,
};

// --- KONIEC: CENTRALNY OBIEKT KONFIGURACJI ROZMIARU ---


// Definicje typów bez zmian
interface Exam {
    _id: string;
    title: string;
    questions: Question[];
}

// --- POCZĄTEK ZMIANY ---
interface LearnViewProps {
    exam: Exam;
    isEmbedded?: boolean; // Dodajemy opcjonalną właściwość
}
// --- KONIEC ZMIANY ---

type UserAnswer = string | boolean[] | string[] | null;
type UserAnswers = {
    [questionId: string]: UserAnswer;
};
type AiEvaluationResult = {
    [questionId: string]: boolean | null;
}

// --- POCZĄTEK ZMIANY ---
export default function LearnView({ exam, isEmbedded = false }: LearnViewProps) {
    // --- KONIEC ZMIANY ---
    // --- ZMIANA: Wybierz aktywny profil rozmiaru. Zmień 'compact' na 'default', aby powiększyć komponent. ---
    const activeProfile = sizeProfiles.compact;

    // Stan komponentu bez zmian
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>(() =>
        exam.questions.reduce((acc, q) => ({ ...acc, [q._id!]: null }), {} as UserAnswers)
    );
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [animationDirection, setAnimationDirection] = useState(1);
    const [isCheckingAi, setIsCheckingAi] = useState(false);
    const [aiEvaluationResult, setAiEvaluationResult] = useState<AiEvaluationResult>({});

    const currentQuestion = exam.questions[currentIndex];
    const currentAnswer = userAnswers[currentQuestion?._id!] ?? null;
    const progressPercentage = showSummary ? 100 : (currentIndex / exam.questions.length) * 100;

    useEffect(() => {
        exam.questions.forEach(q => {
            if (q.imageUrl) {
                const img = new Image();
                img.src = q.imageUrl;
            }
        });
    }, [exam.questions]);

    // Cała logika (isAnswerCorrect, results, handle*) pozostaje bez zmian.
    const isAnswerCorrect = useMemo(() => { if (!currentQuestion || !isAnswerChecked) return null; const aiResult = aiEvaluationResult[currentQuestion._id!]; if (currentQuestion.questionType === QuestionType.OpenEnded || currentQuestion.questionType === QuestionType.FillInTheBlank) { return aiResult; } switch (currentQuestion.questionType) { case QuestionType.MultipleChoice: return currentAnswer === currentQuestion.correctAnswer; case QuestionType.TrueFalse: return Array.isArray(currentAnswer) && currentQuestion.statements.every((stmt, i) => currentAnswer[i] === stmt.isCorrect); default: return false; } }, [currentQuestion, currentAnswer, isAnswerChecked, aiEvaluationResult]);
    const isAnswerProvided = useMemo(() => { if (currentAnswer === null) return false; if (currentQuestion.questionType === QuestionType.OpenEnded || currentQuestion.questionType === QuestionType.FillInTheBlank) { return typeof currentAnswer === 'string' && currentAnswer.trim() !== ''; } if (currentQuestion.questionType === QuestionType.TrueFalse && Array.isArray(currentAnswer)) { return currentAnswer.every(a => a !== null); } return true; }, [currentAnswer, currentQuestion?.questionType]);
    const results = useMemo(() => { if (!showSummary) return { score: 0, totalPoints: 0, correctCount: 0, autoScorableCount: 0 }; let score = 0, correctCount = 0; const scorableQuestions = exam.questions.filter(q => q.questionType === QuestionType.MultipleChoice || q.questionType === QuestionType.TrueFalse || ((q.questionType === QuestionType.OpenEnded || q.questionType === QuestionType.FillInTheBlank) && aiEvaluationResult[q._id!] !== undefined && aiEvaluationResult[q._id!] !== null)); const totalPoints = scorableQuestions.reduce((sum, q) => sum + parseInt(q.points?.split('-').pop() || '0', 10), 0); scorableQuestions.forEach(q => { const userAnswer = userAnswers[q._id!]; const maxPoints = parseInt(q.points?.split('-').pop() || '0', 10); let isCorrectFlag = false; if (q.questionType === QuestionType.MultipleChoice && userAnswer === q.correctAnswer) { isCorrectFlag = true; } else if (q.questionType === QuestionType.TrueFalse && Array.isArray(userAnswer) && q.statements.every((stmt, i) => userAnswer[i] === stmt.isCorrect)) { isCorrectFlag = true; } else if (aiEvaluationResult[q._id!] === true) { isCorrectFlag = true; } if (isCorrectFlag) { score += maxPoints; correctCount++; } }); return { score, totalPoints, correctCount, autoScorableCount: scorableQuestions.length }; }, [showSummary, userAnswers, exam.questions, aiEvaluationResult]);
    const handleAnswerSelect = (questionId: string, answer: UserAnswer) => { if (isAnswerChecked || isCheckingAi) return; setUserAnswers(prev => ({ ...prev, [questionId]: answer })); };
    const handleCheckAnswer = () => { const isAiQuestion = currentQuestion.questionType === QuestionType.OpenEnded || currentQuestion.questionType === QuestionType.FillInTheBlank; if (!isAiQuestion && !isAnswerProvided) { return; } setAiEvaluationResult(prev => ({ ...prev, [currentQuestion._id!]: null })); setIsAnswerChecked(true); };
    const handleAiEvaluation = async () => { if (!isAnswerProvided || isCheckingAi) return; setIsCheckingAi(true); try { const response = await fetch('/api/evaluate-answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: currentQuestion, userAnswer: currentAnswer, }), }); if (!response.ok) throw new Error(`API call failed: ${response.statusText}`); const result = await response.json(); setAiEvaluationResult(prev => ({ ...prev, [currentQuestion._id!]: result.isCorrect })); } catch (error) { console.error("Failed to evaluate answer:", error); setAiEvaluationResult(prev => ({ ...prev, [currentQuestion._id!]: false })); } finally { setIsCheckingAi(false); setIsAnswerChecked(true); } };
    const handleContinue = () => { setAnimationDirection(1); if (currentIndex < exam.questions.length - 1) { setCurrentIndex(prev => prev + 1); setIsAnswerChecked(false); } else { setShowSummary(true); } };
    const handlePrevious = () => { if (currentIndex > 0) { setAnimationDirection(-1); setCurrentIndex(prev => prev - 1); setIsAnswerChecked(false); } };
    const handleGoBackToQuestion = () => { setIsAnswerChecked(false); };
    const handleRestart = () => { setAnimationDirection(-1); setShowSummary(false); setTimeout(() => { setCurrentIndex(0); setUserAnswers(exam.questions.reduce((acc, q) => ({ ...acc, [q._id!]: null }), {} as UserAnswers)); setAiEvaluationResult({}); setIsAnswerChecked(false); }, 300); };

    const variants = {
        hidden: (direction: number) => ({ opacity: 0, x: direction > 0 ? 100 : -100 }),
        visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } },
        exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -100 : 100, transition: { type: 'spring', damping: 25, stiffness: 120 } }),
    };

    return (
        // --- ZMIANA: Używamy zmiennych CSS do ustawienia stylu. ---
        // Wszystkie komponenty potomne odziedziczą te zmienne.
        <div
            style={activeProfile}
            className="w-full max-w-[var(--main-max-width)] min-h-[var(--main-min-height)] flex flex-col mx-auto px-[var(--main-padding-x)] sm:px-[var(--main-padding-x-sm)] bg-gray-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200"
        >
            <ProgressBar progress={progressPercentage} />
            <div className="flex-grow flex flex-col">
                <AnimatePresence initial={false} custom={animationDirection} mode="wait">
                    {showSummary ? (
                        <SummaryScreen
                            key="summary"
                            results={results}
                            onRestart={handleRestart}
                            animationDirection={animationDirection}
                            animationVariants={variants}
                        />
                    ) : (
                        currentQuestion && (
                            <QuestionCard
                                key={currentIndex}
                                examId={exam._id}
                                // --- POCZĄTEK ZMIANY ---
                                isEmbedded={isEmbedded} // Przekazujemy właściwość w dół
                                // --- KONIEC ZMIANY ---
                                question={currentQuestion}
                                currentIndex={currentIndex}
                                totalQuestions={exam.questions.length}
                                userAnswer={currentAnswer}
                                isAnswerChecked={isAnswerChecked}
                                isAnswerProvided={isAnswerProvided}
                                isAnswerCorrect={isAnswerCorrect}
                                animationDirection={animationDirection}
                                animationVariants={variants}
                                onAnswer={handleAnswerSelect}
                                onCheckAnswer={handleCheckAnswer}
                                onAiEvaluate={handleAiEvaluation}
                                onContinue={handleContinue}
                                onPrevious={handlePrevious}
                                onGoBackToQuestion={handleGoBackToQuestion}
                                isCheckingAi={isCheckingAi}
                            />
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}