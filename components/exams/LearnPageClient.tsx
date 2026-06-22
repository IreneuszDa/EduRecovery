'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    ArrowLeftIcon,
    BookOpenIcon,
    CheckBadgeIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/solid';
import { FileText, Key } from 'lucide-react';
import LearnView from '@/components/exams/LearnView';
import { Question } from './question-types';

import '@/app/print.css';

// ============================================================================
// TYPE DEFINITIONS & CONSTANTS
// ============================================================================

const QuestionType = {
    MultipleChoice: 0,
    TrueFalse: 1,
    OpenEnded: 2,
    FillInTheBlank: 3,
};

interface ClientExam {
    _id: string;
    title: string;
    subject: string;
    questions: Question[];
}

interface LearnPageClientProps {
    exam: ClientExam;
    totalPoints: number;
}

// ============================================================================
// HELPER COMPONENT FOR STATIC QUESTION RENDERING (for PDF)
// ============================================================================

const StaticQuestion = ({ question }: { question: Question }) => {
    const q = question as any;

    return (
        <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-800 break-inside-avoid">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Pytanie {q.questionNumber}</h3>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{q.points}</span>
            </div>

            {/* Question content with Markdown and MathJax */}
            {q.content && (
                <div className="prose prose-slate dark:prose-invert max-w-none mb-4">
                    <MathJax>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {q.content}
                        </ReactMarkdown>
                    </MathJax>
                </div>
            )}
            {q.imageUrl && (
                <div className="my-4">
                    <img src={q.imageUrl} alt={`Ilustracja do pytania ${q.questionNumber}`} className="max-w-md h-auto rounded-lg border dark:border-slate-600" />
                </div>
            )}

            <div className="mt-4 space-y-3">
                {q.questionType === QuestionType.MultipleChoice && (
                    <div>
                        <p className="font-semibold text-sm text-slate-500 dark:text-slate-400">Opcje:</p>
                        <ol className="list-alpha pl-5 mt-2 space-y-2">
                            {Object.entries(q.options).map(([key, value]) => {
                                const isCorrect = q.correctAnswer === key;
                                return (
                                    <li key={key}>
                                        <span className="font-bold">{key}.</span>
                                        <div className="inline-block prose prose-slate dark:prose-invert max-w-none">
                                            <MathJax>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {value as string}
                                                </ReactMarkdown>
                                            </MathJax>
                                        </div>
                                        {isCorrect && (
                                            <span className="print-answer print-answer-mc-indicator"></span>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                )}
                {q.questionType === QuestionType.TrueFalse && (
                    <div>
                        <p className="font-semibold text-sm text-slate-500 dark:text-slate-400">Zdania:</p>
                        <ul className="list-none mt-2 space-y-2">
                            {q.statements.map((stmt: { statementText: string; isCorrect: boolean }, index: number) => (
                                <li key={index} className="flex items-center">
                                    <span className="tf-box"></span>
                                    <span className="print-answer print-answer-inline">
                                        <span className={`font-bold text-xs py-0.5 px-1.5 rounded mr-3 ${stmt.isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                            {stmt.isCorrect ? 'PRAWDA' : 'FAŁSZ'}
                                        </span>
                                    </span>
                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        <MathJax>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {stmt.statementText}
                                            </ReactMarkdown>
                                        </MathJax>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {q.questionType === QuestionType.OpenEnded && (
                    <div className="print-answer">
                        <p className="font-semibold text-sm text-slate-500 dark:text-slate-400">Rozwiązanie:</p>
                        <div className="prose prose-slate dark:prose-invert max-w-none mt-2 p-3 border-l-4 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 rounded">
                            {/* Solution with Markdown and MathJax */}
                            <MathJax>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {q.finalAnswer || 'Nie podano rozwiązania.'}
                                </ReactMarkdown>
                            </MathJax>
                        </div>
                    </div>
                )}
                {q.questionType === QuestionType.FillInTheBlank && (
                    <div className="print-answer">
                        <p className="font-semibold text-sm text-slate-500 dark:text-slate-400">Poprawne odpowiedzi:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            {q.correctAnswers.map((ans: string, index: number) => (
                                <li key={index}>
                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        <MathJax>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {ans}
                                            </ReactMarkdown>
                                        </MathJax>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN CLIENT COMPONENT
// ============================================================================
export default function LearnPageClient({ exam, totalPoints }: LearnPageClientProps) {
    const [headerOpacity, setHeaderOpacity] = useState(1);
    const [headerScale, setHeaderScale] = useState(1);
    const [isPrintMenuOpen, setPrintMenuOpen] = useState(false);
    const printMenuRef = useRef<HTMLDivElement>(null);

    const FADE_END_Y = 200;

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const rawOpacity = 1 - scrollY / FADE_END_Y;
            setHeaderOpacity(Math.max(0, Math.min(1, rawOpacity)));
            setHeaderScale(Math.max(0.95, Math.min(1, 1 - (scrollY / FADE_END_Y) * 0.05)));
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (printMenuRef.current && !printMenuRef.current.contains(event.target as Node)) {
                setPrintMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePrint = (withAnswers: boolean) => {
        const printClass = withAnswers ? 'print-with-answers' : 'print-without-answers';
        document.body.classList.add(printClass);

        const cleanupAfterPrint = () => {
            document.body.classList.remove(printClass);
            window.removeEventListener('afterprint', cleanupAfterPrint);
        };

        window.addEventListener('afterprint', cleanupAfterPrint);
        window.print();
        setPrintMenuOpen(false);
    };

    const mathJaxConfig = {
        loader: { load: ['[tex]/html'] },
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            packages: { '[+]': ['html'] }
        },
    };

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div
                style={{ opacity: headerOpacity, transform: `scale(${headerScale})` }}
                className="transition-all duration-150 ease-out no-print"
            >
                <header className="pt-8 pb-12 space-y-6 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link href="/dashboard/exams" className="group inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                            <ArrowLeftIcon className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Powrót do listy egzaminów
                        </Link>

                        <div className="relative" ref={printMenuRef}>
                            <button
                                onClick={() => setPrintMenuOpen(!isPrintMenuOpen)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-blue-500"
                            >
                                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                                <span>Pobierz jako PDF</span>
                            </button>

                            {isPrintMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-80 z-20 origin-top-right rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-xl ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none animate-in fade-in-0 zoom-in-95">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 px-1 pb-2">Opcje drukowania</p>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handlePrint(false)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left"
                                        >
                                            <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Drukuj test</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Wygeneruj PDF bez odpowiedzi.</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handlePrint(true)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left"
                                        >
                                            <Key className="h-6 w-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Drukuj klucz odpowiedzi</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Wygeneruj PDF z odpowiedziami.</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{exam.title}</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">Tryb Nauki: Sprawdź swoją wiedzę bez presji czasu.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg"><CheckBadgeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Punkty do zdobycia</p>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{totalPoints}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg"><BookOpenIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Przedmiot</p>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{exam.subject}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
                        <p className="text-md text-slate-600 dark:text-slate-400">
                            Przed Tobą zestaw <span className="font-bold text-slate-900 dark:text-slate-100">{exam.questions.length} pytań</span>. Powodzenia!
                        </p>
                    </div>
                </header>
            </div>

            <main className="pb-12 print:hidden">
                <LearnView exam={exam} isEmbedded={false} />
            </main>

            <div className="hidden print:block printable-area p-8 font-sans">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">{exam.title}</h1>
                    <h2 className="text-xl text-slate-600">{exam.subject}</h2>
                    <p className="text-sm text-slate-500 mt-2">Suma punktów: {totalPoints}</p>
                </div>
                <div className="space-y-8">
                    {exam.questions.map((question) => (
                        <StaticQuestion key={question._id} question={question} />
                    ))}
                </div>
            </div>
        </MathJaxContext>
    );
}