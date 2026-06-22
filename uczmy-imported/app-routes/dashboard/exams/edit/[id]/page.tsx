'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Question, QuestionType, BLANK_MULTIPLE_CHOICE, BLANK_TRUE_FALSE, BLANK_OPEN_ENDED, BLANK_FILL_IN_THE_BLANK } from '@/components/exams/question-types';
import QuestionCard from '@/components/exams/QuestionCard';
import AIGenerator from '@/components/exams/AIGenerator';
import { Loader2, ArrowLeft, Pencil, Sparkles } from 'lucide-react'; // ArrowRight removed

export type IExamClient = {
    _id?: string;
    title: string;
    subject: string;
    isPublic: boolean;
    questions: Question[];
    createdAt?: string;
    updatedAt?: string;
};

type ActiveTab = 'editor' | 'ai-generator';

export default function EditExamPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { data: session, status: sessionStatus } = useSession();

    const [exam, setExam] = useState<IExamClient | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<ActiveTab>('editor');

    // --- Data fetching and other logic... (No changes in this section) ---
    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            if (id === 'new') {
                setExam({ title: 'Nowy Egzamin', subject: 'Przedmiot', isPublic: false, questions: [] });
                setLoading(false);
                return;
            }

            const fetchExam = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const res = await fetch(`/api/exams/${id}`);
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || 'Nie udało się wczytać egzaminu. Być może nie masz uprawnień lub egzamin nie istnieje.');
                    }
                    const data = await res.json();
                    setExam(data.exam);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchExam();

        } else if (sessionStatus === 'unauthenticated') {
            router.push('/');
        }
    }, [id, sessionStatus, router]);

    const appendAndRenumberQuestions = (newQuestions: Question[]) => {
        setExam(prevExam => {
            if (!prevExam) return null;
            const allQuestions = [...prevExam.questions, ...newQuestions];
            const renumberedQuestions = allQuestions.map((q, index) => ({
                ...q,
                questionNumber: (index + 1).toString(),
            }));
            return { ...prevExam, questions: renumberedQuestions };
        });
        setActiveTab('editor');
    };

    const handleExamDetailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!exam) return;
        setExam({ ...exam, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index: number, updatedQuestion: Question) => {
        if (!exam) return;
        const updatedQuestions = exam.questions.map((q, i) => (i === index ? { ...updatedQuestion } : { ...q }));
        setExam({ ...exam, questions: updatedQuestions });
    };

    const handleAddQuestion = (type: QuestionType) => {
        if (!exam) return;
        const questionNumber = (exam.questions.length + 1).toString();
        let blankTemplate;
        switch (type) {
            case QuestionType.MultipleChoice: blankTemplate = BLANK_MULTIPLE_CHOICE; break;
            case QuestionType.TrueFalse: blankTemplate = BLANK_TRUE_FALSE; break;
            case QuestionType.OpenEnded: blankTemplate = BLANK_OPEN_ENDED; break;
            case QuestionType.FillInTheBlank: blankTemplate = BLANK_FILL_IN_THE_BLANK; break;
            default: return;
        }
        const newQuestion: Question = { ...blankTemplate, questionNumber };
        setExam({ ...exam, questions: [...exam.questions, newQuestion] });
        setCurrentQuestionIndex(exam.questions.length);
    };

    const handleDeleteQuestion = (indexToDelete: number) => {
        if (!exam) return;
        const updatedQuestions = exam.questions.filter((_, index) => index !== indexToDelete);
        const renumberedQuestions = updatedQuestions.map((q, index) => ({
            ...q,
            questionNumber: (index + 1).toString(),
        }));
        setExam({ ...exam, questions: renumberedQuestions });

        if (currentQuestionIndex >= renumberedQuestions.length) {
            setCurrentQuestionIndex(Math.max(0, renumberedQuestions.length - 1));
        }
    };

    const handleSaveChanges = async (e: FormEvent) => {
        e.preventDefault();
        if (!exam) return;
        setIsSaving(true);
        setError(null);

        const isNewExam = !exam._id;
        const method = isNewExam ? 'POST' : 'PATCH';
        const url = isNewExam ? '/api/exams' : `/api/exams/${id}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exam),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save changes.');
            }
            alert(`Egzamin został ${isNewExam ? 'utworzony' : 'zaktualizowany'} pomyślnie!`);
            router.push('/dashboard/exams');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // <<< USUNIĘTO NIEPOTRZEBNE FUNKCJE handleNextQuestion i handlePreviousQuestion

    if (sessionStatus === 'loading' || loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" /></div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-full"><div className="text-center p-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg shadow-sm text-red-700 dark:text-red-300 max-w-lg"><p className="font-semibold text-lg mb-2">Wystąpił błąd:</p><p>{error}</p><button onClick={() => router.refresh()} className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400/50 rounded-md hover:bg-red-200 dark:hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:ring-offset-gray-900">Spróbuj ponownie</button></div></div>;
    }
    if (!exam) {
        return <div className="text-center p-10 dark:text-slate-400">Nie znaleziono egzaminu.</div>;
    }

    const currentQuestion = exam.questions[currentQuestionIndex];
    // <<< USUNIĘTO NIEPOTRZEBNĄ ZMIENNĄ arrowButtonClasses

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto py-8 px-4">
                    {/* Header */}
                    <button type="button" onClick={() => router.push('/dashboard/exams')} className="flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 font-medium group">
                        <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                        Powrót do egzaminów
                    </button>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{!exam._id ? 'Stwórz Nowy Egzamin' : 'Edytuj Egzamin'}</h1>
                            <p className="text-slate-600 dark:text-slate-400">{!exam._id ? 'Stwórz nowy egzamin ręcznie lub wygeneruj go przy pomocy AI.' : 'Wprowadź zmiany w szczegółach egzaminu i jego pytaniach.'}</p>
                        </div>
                        <div className="flex justify-end">
                            <button form="exam-form" type="submit" className="btn-primary w-full sm:w-auto" disabled={isSaving}>
                                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Zapisywanie...</> : (!exam._id ? 'Stwórz Egzamin' : 'Zapisz wszystkie zmiany')}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button onClick={() => setActiveTab('editor')} className={`${activeTab === 'editor' ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                                    <Pencil className="mr-2 h-5 w-5" />
                                    Edytor Ręczny
                                </button>
                                <button onClick={() => setActiveTab('ai-generator')} className={`${activeTab === 'ai-generator' ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Generator AI
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'ai-generator' && (
                            <AIGenerator existingQuestions={exam.questions} onQuestionsGenerated={appendAndRenumberQuestions} disabled={isSaving} />
                        )}

                        {activeTab === 'editor' && (
                            <form id="exam-form" onSubmit={handleSaveChanges}>
                                {/* Exam Details */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200/70 dark:border-slate-700 mb-8">
                                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">Szczegóły Arkusza</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tytuł Egzaminu</label>
                                            <input type="text" name="title" id="title" value={exam.title} onChange={handleExamDetailChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="np. Matura Próbna 2024" required />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Przedmiot</label>
                                            <input type="text" name="subject" id="subject" value={exam.subject} onChange={handleExamDetailChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="np. MATEMATYKA" required />
                                        </div>
                                    </div>
                                </div>

                                {/* <<< USUNIĘTO BLOK NAWIGACJI ZE STRZAŁKAMI */}
                                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Pytania</h2>

                                {/* Question Grid Navigator */}
                                {exam.questions.length > 1 && (
                                    <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200/70 dark:border-slate-700/80">
                                        <div className="flex flex-wrap gap-2">
                                            {exam.questions.map((_, index) => (
                                                <button
                                                    key={`grid-nav-${index}`}
                                                    type="button"
                                                    onClick={() => setCurrentQuestionIndex(index)}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-md font-semibold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500 ${currentQuestionIndex === index
                                                            ? 'bg-blue-600 text-white shadow-lg'
                                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                                                        }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Question Card */}
                                <div className="min-h-[300px]">
                                    {currentQuestion ? (
                                        <QuestionCard key={currentQuestion._id ? String(currentQuestion._id) : `gen-${currentQuestionIndex}`} index={currentQuestionIndex} question={currentQuestion} onQuestionChange={handleQuestionChange} onDeleteQuestion={handleDeleteQuestion} />
                                    ) : (
                                        <div className="text-center text-slate-500 dark:text-slate-400 py-10 px-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Brak pytań w egzaminie</h3>
                                            <p className="mt-1">Dodaj pytanie ręcznie poniżej lub przejdź do zakładki <strong className="font-semibold">Generator AI</strong>, aby stworzyć je automatycznie.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Add Question Box */}
                                <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200/70 dark:border-slate-700">
                                    <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Dodaj nowe pytanie (ręcznie)</h3>
                                    <div className="flex flex-wrap gap-4">
                                        <button type="button" onClick={() => handleAddQuestion(QuestionType.MultipleChoice)} className="btn-secondary">Dodaj Zamknięte</button>
                                        <button type="button" onClick={() => handleAddQuestion(QuestionType.TrueFalse)} className="btn-secondary">Dodaj Prawda/Fałsz</button>
                                        <button type="button" onClick={() => handleAddQuestion(QuestionType.OpenEnded)} className="btn-secondary">Dodaj Otwarte</button>
                                        <button type="button" onClick={() => handleAddQuestion(QuestionType.FillInTheBlank)} className="btn-secondary">Dodaj Lukę</button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}