'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Send,
    Lightbulb,
    ArrowLeft,
    ArrowRight,
    Loader2,
    ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

// Anti-paste protection hook
function useAntiPaste(enabled: boolean = true) {
    const handlePaste = useCallback((e: ClipboardEvent) => {
        if (enabled) {
            e.preventDefault();
            // Show warning
            const target = e.target as HTMLElement;
            if (target) {
                target.classList.add('ring-2', 'ring-red-500');
                setTimeout(() => {
                    target.classList.remove('ring-2', 'ring-red-500');
                }, 1000);
            }
        }
    }, [enabled]);

    const handleDrop = useCallback((e: DragEvent) => {
        if (enabled) {
            e.preventDefault();
        }
    }, [enabled]);

    const handleContextMenu = useCallback((e: MouseEvent) => {
        if (enabled) {
            e.preventDefault();
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('paste', handlePaste);
        document.addEventListener('drop', handleDrop);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('drop', handleDrop);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [enabled, handlePaste, handleDrop, handleContextMenu]);
}

// Types
interface Question {
    id: string;
    content: string;
    type: 'open' | 'multiple_choice' | 'fill_blank' | 'true_false';
    options?: { [key: string]: string };
    points: number;
}

interface Answer {
    questionIndex: number;
    answer: string;
}

// Question Card with anti-paste
const QuestionInput = ({
    question,
    index,
    answer,
    onAnswer,
    feedback,
    showHint,
    onRequestHint,
}: {
    question: Question;
    index: number;
    answer: string;
    onAnswer: (value: string) => void;
    feedback?: { isCorrect: boolean; comment: string } | null;
    showHint: boolean;
    onRequestHint: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            {/* Question Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300">
                        {question.points} pkt
                    </span>
                </div>
                {!feedback && (
                    <button
                        onClick={onRequestHint}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                    >
                        <Lightbulb className="h-4 w-4" />
                        Wskazówka
                    </button>
                )}
            </div>

            {/* Question Content */}
            <p className="text-lg font-medium text-slate-800 dark:text-white">
                {question.content}
            </p>

            {/* Answer Input based on type */}
            {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2">
                    {Object.entries(question.options).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => onAnswer(key)}
                            disabled={!!feedback}
                            className={`
                                w-full p-4 rounded-xl text-left transition-all
                                ${answer === key
                                    ? feedback
                                        ? feedback.isCorrect
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500'
                                            : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                                        : 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                                    : 'bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                }
                            `}
                        >
                            <span className="font-medium mr-3">{key}.</span>
                            {value}
                            {feedback && answer === key && (
                                feedback.isCorrect
                                    ? <CheckCircle2 className="h-5 w-5 text-emerald-500 float-right" />
                                    : <XCircle className="h-5 w-5 text-red-500 float-right" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {question.type === 'true_false' && (
                <div className="flex gap-4">
                    {['Prawda', 'Fałsz'].map((option) => (
                        <button
                            key={option}
                            onClick={() => onAnswer(option.toLowerCase() === 'prawda' ? 'true' : 'false')}
                            disabled={!!feedback}
                            className={`
                                flex-1 p-4 rounded-xl font-medium transition-all
                                ${answer === (option.toLowerCase() === 'prawda' ? 'true' : 'false')
                                    ? feedback
                                        ? feedback.isCorrect
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-red-500 text-white'
                                        : 'bg-blue-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }
                            `}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}

            {(question.type === 'open' || question.type === 'fill_blank') && (
                <div className="relative">
                    <textarea
                        value={answer}
                        onChange={(e) => onAnswer(e.target.value)}
                        disabled={!!feedback}
                        placeholder={question.type === 'fill_blank' ? 'Wpisz brakujące słowo...' : 'Wpisz swoją odpowiedź...'}
                        rows={question.type === 'open' ? 4 : 1}
                        className={`
                            w-full px-4 py-3 rounded-xl border-2 transition-all resize-none
                            ${feedback
                                ? feedback.isCorrect
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                            }
                            text-slate-800 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        `}
                        style={{
                            // Additional anti-paste via CSS
                            userSelect: 'text',
                            WebkitUserSelect: 'text',
                        }}
                        onPaste={(e) => e.preventDefault()}
                        onDrop={(e) => e.preventDefault()}
                    />

                    {/* Anti-paste indicator */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-600 rounded text-xs text-slate-500 dark:text-slate-400">
                        <ShieldAlert className="h-3 w-3" />
                        Zabezpieczony
                    </div>
                </div>
            )}

            {/* Feedback */}
            {feedback && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                        p-4 rounded-xl
                        ${feedback.isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }
                    `}
                >
                    <div className="flex items-start gap-3">
                        {feedback.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        <div>
                            <p className={`font-medium ${feedback.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                                {feedback.isCorrect ? 'Świetnie!' : 'Spróbuj jeszcze raz'}
                            </p>
                            <p className={`text-sm mt-1 ${feedback.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {feedback.comment}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Socratic Hint */}
            {showHint && !feedback && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                >
                    <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-amber-700 dark:text-amber-300">Wskazówka</p>
                            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                                Pomyśl o tym, czego się ostatnio uczyłeś na lekcji. Jak możesz zastosować tę wiedzę tutaj?
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

// Main Homework Execution Page
export default function HomeworkExecutionPage() {
    const params = useParams();
    const homeworkId = params?.id as string;

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    // Enable anti-paste protection
    useAntiPaste(true);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [feedback, setFeedback] = useState<Record<number, { isCorrect: boolean; comment: string } | null>>({});
    const [hints, setHints] = useState<Record<number, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [startTime] = useState(Date.now());
    const [timeSpent, setTimeSpent] = useState(0);

    // Mock homework data
    const homework = {
        title: 'Past Simple - ćwiczenia',
        subject: 'Angielski',
        deadline: 'Jutro, 23:59',
        questions: [
            { id: '1', content: 'Uzupełnij zdanie: "She ___ (go) to school yesterday."', type: 'fill_blank' as const, points: 2 },
            { id: '2', content: 'Które zdanie jest poprawne?', type: 'multiple_choice' as const, options: { A: 'I went to school.', B: 'I goed to school.', C: 'I go to school yesterday.', D: 'I was go to school.' }, points: 2 },
            { id: '3', content: 'Prawda czy fałsz: W Past Simple używamy końcówki -ed dla czasowników regularnych.', type: 'true_false' as const, points: 1 },
            { id: '4', content: 'Napisz 3 zdania w czasie Past Simple opisujące co robiłeś/aś wczoraj.', type: 'open' as const, points: 3 },
        ],
    };

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (questionIndex: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmitAnswer = () => {
        // Simulate AI grading
        const isCorrect = Math.random() > 0.3;
        setFeedback(prev => ({
            ...prev,
            [currentQuestionIndex]: {
                isCorrect,
                comment: isCorrect
                    ? 'Doskonała odpowiedź! Poprawnie zastosowałeś/aś zasady.'
                    : 'Nie do końca. Przypomnij sobie formy nieregularne czasowników.'
            }
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < homework.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleRequestHint = () => {
        setHints(prev => ({ ...prev, [currentQuestionIndex]: true }));
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsCompleted(true);
        }, 1500);
    };

    const currentQuestion = homework.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex] || '';
    const currentFeedback = feedback[currentQuestionIndex];
    const showHint = hints[currentQuestionIndex] || false;

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="min-h-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Praca domowa ukończona! 🎉
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Czas: {formatTime(timeSpent)} | Odpowiedzi: {Object.keys(answers).length}/{homework.questions.length}
                    </p>
                    <Link href="/dashboard/student">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
                        >
                            Wróć do panelu
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/student">
                            <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                                {homework.title}
                            </h1>
                            <p className="text-sm text-slate-500">{homework.subject}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                                {formatTime(timeSpent)}
                            </span>
                        </div>
                        <div className="px-3 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <span className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                                {homework.deadline}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                    {homework.questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentQuestionIndex(i)}
                            className={`
                                flex-1 h-2 rounded-full transition-all
                                ${i === currentQuestionIndex
                                    ? 'bg-blue-500'
                                    : feedback[i]
                                        ? feedback[i]?.isCorrect
                                            ? 'bg-emerald-500'
                                            : 'bg-red-500'
                                        : answers[i]
                                            ? 'bg-slate-400'
                                            : 'bg-slate-200 dark:bg-slate-700'
                                }
                            `}
                        />
                    ))}
                </div>

                {/* Question Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
                    <QuestionInput
                        question={currentQuestion}
                        index={currentQuestionIndex}
                        answer={currentAnswer}
                        onAnswer={(value) => handleAnswer(currentQuestionIndex, value)}
                        feedback={currentFeedback}
                        showHint={showHint}
                        onRequestHint={handleRequestHint}
                    />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Poprzednie
                    </button>

                    {!currentFeedback && currentAnswer && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmitAnswer}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
                        >
                            Sprawdź odpowiedź
                        </motion.button>
                    )}

                    {currentQuestionIndex === homework.questions.length - 1 && currentFeedback ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleFinalSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            Zakończ i wyślij
                        </motion.button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === homework.questions.length - 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                        >
                            Następne
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Anti-paste warning */}
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Kopiowanie i wklejanie jest zablokowane dla uczciwości</span>
                </div>
            </div>
        </div>
    );
}
