'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Wand2,
    CheckCircle2,
    RefreshCw,
    Send,
    ArrowLeft,
    Loader2,
    AlertCircle,
    BookOpen,
    Users,
    Calendar,
    Edit2,
    Trash2,
    Plus
} from 'lucide-react';
import Link from 'next/link';

// Types
interface GeneratedQuestion {
    id: string;
    content: string;
    type: 'open' | 'multiple_choice' | 'fill_blank' | 'true_false';
    options?: { [key: string]: string };
    correctAnswer?: string;
    points: number;
    aiHint?: string;
}

// Premium Card
const PremiumCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`
        bg-white dark:bg-slate-800 
        rounded-2xl 
        border border-slate-200/60 dark:border-slate-700/60
        shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
        ${className}
    `}>
        {children}
    </div>
);

// Question Card Component
const QuestionCard = ({
    question,
    index,
    onEdit,
    onDelete,
    onRegenerateHint
}: {
    question: GeneratedQuestion;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    onRegenerateHint: () => void;
}) => {
    const typeLabels = {
        'open': 'Pytanie otwarte',
        'multiple_choice': 'Wielokrotny wybór',
        'fill_blank': 'Uzupełnij lukę',
        'true_false': 'Prawda/Fałsz',
    };

    const typeColors = {
        'open': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        'multiple_choice': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'fill_blank': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        'true_false': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[question.type]}`}>
                        {typeLabels[question.type]}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {question.points} pkt
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <Edit2 className="h-4 w-4 text-slate-500" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                </div>
            </div>

            <p className="text-slate-800 dark:text-white font-medium mb-3">
                {question.content}
            </p>

            {question.options && (
                <div className="space-y-2 mb-3">
                    {Object.entries(question.options).map(([key, value]) => (
                        <div
                            key={key}
                            className={`p-2 rounded-lg text-sm ${key === question.correctAnswer
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}
                        >
                            <span className="font-medium mr-2">{key}.</span>
                            {value}
                            {key === question.correctAnswer && (
                                <CheckCircle2 className="h-4 w-4 ml-2 inline-block" />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {question.aiHint && (
                <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                        💡 Wskazówka dla ucznia (metoda sokratejska):
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        {question.aiHint}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

// Main AI Homework Generator Page
export default function NewHomeworkPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const router = useRouter();

    // Form state
    const [topic, setTopic] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [questionCount, setQuestionCount] = useState(10);
    const [deadline, setDeadline] = useState('');

    // Generation state
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
    const [isApproved, setIsApproved] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    // Mock classes
    const classes = [
        { id: '1', name: 'Angielski GR1', subject: 'Angielski', studentCount: 12 },
        { id: '2', name: 'Matematyka 2A', subject: 'Matematyka', studentCount: 8 },
        { id: '3', name: 'Angielski GR2', subject: 'Angielski', studentCount: 15 },
    ];

    // Generate homework with AI
    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Podaj temat pracy domowej');
            return;
        }

        setError('');
        setIsGenerating(true);
        setGeneratedQuestions([]);
        setIsApproved(false);

        // Simulate AI generation (in real implementation, call API)
        setTimeout(() => {
            const mockQuestions: GeneratedQuestion[] = [
                {
                    id: '1',
                    content: `Uzupełnij zdanie poprawną formą czasownika w czasie ${topic}: "She ___ (go) to school yesterday."`,
                    type: 'fill_blank',
                    correctAnswer: 'went',
                    points: 2,
                    aiHint: 'Przypomnij sobie, jak tworzymy zdania twierdzące w tym czasie. Jaka jest nieregularna forma czasownika "go"?'
                },
                {
                    id: '2',
                    content: `Które zdanie jest poprawne w czasie ${topic}?`,
                    type: 'multiple_choice',
                    options: {
                        'A': 'I was watching TV when he arrived.',
                        'B': 'I watched TV when he was arriving.',
                        'C': 'I was watch TV when he arrived.',
                        'D': 'I watching TV when he arrived.'
                    },
                    correctAnswer: 'A',
                    points: 2,
                    aiHint: 'Pomyśl o dwóch czynnościach: jednej dłuższej (trwającej) i jednej krótszej (przerywa tę pierwszą). Który czas wyrażamy którym?'
                },
                {
                    id: '3',
                    content: `Napisz krótkie zdanie (5-10 słów) używając czasu ${topic}, opisujące co robiłeś/aś wczoraj wieczorem.`,
                    type: 'open',
                    points: 3,
                    aiHint: 'Pamiętaj o budowie zdania: podmiot + czasownik w odpowiedniej formie + reszta zdania. Sprawdź, czy użyłeś poprawnej formy czasownika.'
                },
                {
                    id: '4',
                    content: `Prawda czy fałsz: W czasie ${topic} używamy końcówki -ing dla czasowników głównych.`,
                    type: 'true_false',
                    correctAnswer: 'true',
                    points: 1,
                    aiHint: 'Przypomnij sobie budowę czasu ciągłego. Co składa się na pełną formę czasownika?'
                },
            ];

            // Repeat to get more questions
            const allQuestions = Array.from({ length: questionCount }, (_, i) => ({
                ...mockQuestions[i % mockQuestions.length],
                id: String(i + 1),
            }));

            setGeneratedQuestions(allQuestions.slice(0, questionCount));
            setIsGenerating(false);
        }, 2000);
    };

    // Regenerate single question
    const handleRegenerateQuestion = (index: number) => {
        // In real implementation, call API to regenerate
        console.log('Regenerating question', index);
    };

    // Delete question
    const handleDeleteQuestion = (index: number) => {
        setGeneratedQuestions(prev => prev.filter((_, i) => i !== index));
    };

    // Approve and send
    const handleApproveAndSend = async () => {
        if (!selectedClass || !deadline) {
            setError('Wybierz klasę i ustaw termin oddania');
            return;
        }

        setIsSending(true);

        // Simulate API call
        setTimeout(() => {
            setIsSending(false);
            router.push('/dashboard/teacher?success=homework_sent');
        }, 1500);
    };

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/teacher">
                        <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-purple-500" />
                            Generator Prac Domowych AI
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Wygeneruj interaktywne zadania w kilka sekund
                        </p>
                    </div>
                </div>

                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3"
                        >
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <p className="text-red-700 dark:text-red-300">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Generation Form */}
                <PremiumCard className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        1. Opisz temat pracy domowej
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Temat / zagadnienie
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="np. Past Simple - zdania twierdzące i pytające"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Liczba pytań
                                </label>
                                <select
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {[5, 10, 15, 20].map(n => (
                                        <option key={n} value={n}>{n} pytań</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Klasa
                                </label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Wybierz klasę...</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} ({cls.studentCount} uczniów)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Termin oddania
                            </label>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleGenerate}
                            disabled={isGenerating || !topic.trim()}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-3 transition-all"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Generuję pytania...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="h-5 w-5" />
                                    Generuj pytania AI
                                </>
                            )}
                        </motion.button>
                    </div>
                </PremiumCard>

                {/* Generated Questions */}
                <AnimatePresence>
                    {generatedQuestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <PremiumCard className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                        2. Przejrzyj i zatwierdź pytania ({generatedQuestions.length})
                                    </h2>
                                    <button
                                        onClick={handleGenerate}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Wygeneruj ponownie
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {generatedQuestions.map((question, index) => (
                                        <QuestionCard
                                            key={question.id}
                                            question={question}
                                            index={index}
                                            onEdit={() => console.log('Edit', index)}
                                            onDelete={() => handleDeleteQuestion(index)}
                                            onRegenerateHint={() => handleRegenerateQuestion(index)}
                                        />
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={handleApproveAndSend}
                                        disabled={isSending || !selectedClass || !deadline}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all"
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Wysyłam do uczniów...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                Zatwierdź i wyślij do klasy
                                            </>
                                        )}
                                    </motion.button>
                                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
                                        Uczniowie otrzymają powiadomienie o nowej pracy domowej
                                    </p>
                                </div>
                            </PremiumCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
