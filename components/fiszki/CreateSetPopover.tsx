'use client';

import { useState } from 'react';
import { Sparkles, FilePlus2, ArrowLeft, Loader2 } from 'lucide-react';

interface CreateSetPopoverProps {
    onClose: () => void;
    onCreateEmpty: (title: string) => Promise<void>; // Now accepts a title
    onGenerate: (data: { title: string; topic: string; numberOfCards: number }) => Promise<void>;
    isCreating: boolean;
}

export function CreateSetPopover({ onClose, onCreateEmpty, onGenerate, isCreating }: CreateSetPopoverProps) {
    const [step, setStep] = useState<'initial' | 'ai_form' | 'empty_form'>('initial');
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [numberOfCards, setNumberOfCards] = useState<number>(10);

    const handleGenerateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !topic || isCreating) return;
        await onGenerate({ title, topic, numberOfCards });
    };

    const handleEmptySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || isCreating) return;
        await onCreateEmpty(title);
    }

    const goBack = () => {
        setTitle(''); // Reset title when switching forms
        setStep('initial');
    }

    return (
        <div
            className="absolute top-full right-0 mt-2 w-80 z-20 origin-top-right rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
        >
            {step === 'initial' && (
                <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 px-1 pb-2">Stwórz nowy zestaw</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => setStep('empty_form')}
                            disabled={isCreating}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-wait text-left"
                        >
                            <FilePlus2 className="h-6 w-6 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Pusty zestaw</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Dodawaj fiszki ręcznie.</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setStep('ai_form')}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                        >
                            <Sparkles className="h-6 w-6 text-blue-500 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Generuj z AI</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Opisz temat, a my zrobimy resztę.</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {step === 'empty_form' && (
                <form onSubmit={handleEmptySubmit} className="animate-in fade-in-0">
                    <div className="flex items-center mb-3">
                        <button type="button" onClick={goBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Stwórz pusty zestaw</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="empty-set-title" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tytuł zestawu</label>
                            <input id="empty-set-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="np. Stolice Europy" className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={isCreating || !title.trim()}
                            className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus2 className="w-4 h-4" />}
                            {isCreating ? 'Tworzenie...' : 'Stwórz zestaw'}
                        </button>
                    </div>
                </form>
            )}

            {step === 'ai_form' && (
                <form onSubmit={handleGenerateSubmit} className="animate-in fade-in-0">
                    <div className="flex items-center mb-3">
                        <button type="button" onClick={goBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Generuj z AI</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="set-title" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tytuł zestawu</label>
                            <input id="set-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="np. Stolice Europy" className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="set-topic" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Temat fiszek</label>
                            <textarea id="set-topic" value={topic} onChange={e => setTopic(e.target.value)} required rows={2} placeholder="np. Kraje i ich stolice" className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="set-count" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Liczba fiszek</label>
                            <input id="set-count" type="number" value={numberOfCards} onChange={e => setNumberOfCards(parseInt(e.target.value))} min="1" max="20" className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={isCreating || !title.trim() || !topic.trim()}
                            className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all"
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