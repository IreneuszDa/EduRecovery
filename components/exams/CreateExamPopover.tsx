'use client';

import { useState } from 'react';
import { Sparkles, FilePlus2, ArrowLeft, Loader2 } from 'lucide-react';

interface CreateExamPopoverProps {
    onClose: () => void;
    onCreateEmpty: (title: string) => Promise<void>;
    onGenerate: (data: { title: string; topic: string; numberOfQuestions: number }) => Promise<void>;
    isCreating: boolean;
}

export function CreateExamPopover({ onClose, onCreateEmpty, onGenerate, isCreating }: CreateExamPopoverProps) {
    const [step, setStep] = useState<'initial' | 'empty_form' | 'ai_form'>('initial');
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);

    const handleGenerateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !topic || isCreating) return;
        await onGenerate({ title, topic, numberOfQuestions });
    };

    const handleEmptySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || isCreating) return;
        await onCreateEmpty(title);
    }

    const goBack = () => {
        setTitle('');
        setTopic('');
        setNumberOfQuestions(10);
        setStep('initial');
    }

    return (
        <div
            className="absolute top-full right-0 mt-2 w-80 z-20 origin-top-right rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-xl ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Step 1: Initial selection */}
            {step === 'initial' && (
                <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 px-1 pb-2">Stwórz nowy egzamin</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => setStep('empty_form')}
                            disabled={isCreating}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-60 disabled:cursor-wait text-left"
                        >
                            <FilePlus2 className="h-6 w-6 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Pusty egzamin</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Dodawaj pytania ręcznie.</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setStep('ai_form')}
                            disabled={isCreating}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-60 disabled:cursor-wait text-left"
                        >
                            <Sparkles className="h-6 w-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Generuj z AI</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Opisz temat, a my zrobimy resztę.</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2a: Form for an empty exam */}
            {step === 'empty_form' && (
                <form onSubmit={handleEmptySubmit} className="animate-in fade-in-0">
                    <div className="flex items-center mb-3">
                        <button type="button" onClick={goBack} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Stwórz pusty egzamin</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="empty-exam-title" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tytuł egzaminu</label>
                            <input id="empty-exam-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="np. Egzamin z biologii" className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={isCreating || !title.trim()}
                            className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-all"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus2 className="w-4 h-4" />}
                            {isCreating ? 'Tworzenie...' : 'Stwórz egzamin'}
                        </button>
                    </div>
                </form>
            )}

            {/* Step 2b: Form for AI generation */}
            {step === 'ai_form' && (
                <form onSubmit={handleGenerateSubmit} className="animate-in fade-in-0">
                    <div className="flex items-center mb-3">
                        <button type="button" onClick={goBack} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Generuj z AI</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="exam-title-ai" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tytuł egzaminu</label>
                            <input id="exam-title-ai" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="np. Algebra Liniowa" className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="exam-topic-ai" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Temat/zakres pytań</label>
                            <textarea id="exam-topic-ai" value={topic} onChange={e => setTopic(e.target.value)} required rows={3} placeholder="np. Macierze, układy równań i przestrzenie wektorowe." className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="exam-count-ai" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Liczba pytań</label>
                            <input id="exam-count-ai" type="number" value={numberOfQuestions} onChange={e => setNumberOfQuestions(parseInt(e.target.value))} min="1" max="50" className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={isCreating || !title.trim() || !topic.trim()}
                            className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-all"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            {isCreating ? 'Generowanie...' : 'Generuj'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}