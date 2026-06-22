'use client';

import { useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';

interface GenerateExamAiModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: { title: string; topic: string; numberOfQuestions: number }) => Promise<void>;
    isCreating: boolean;
}

export function GenerateExamAiModal({ isOpen, onClose, onGenerate, isCreating }: GenerateExamAiModalProps) {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);

    const handleClose = () => {
        if (isCreating) return; // Prevent closing while generating
        onClose();
    };

    const handleGenerateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !topic || isCreating) return;
        await onGenerate({ title, topic, numberOfQuestions });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0" onClick={handleClose}>
            <div
                className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl relative animate-in fade-in-0 zoom-in-95 border dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        Generuj egzamin z AI
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        disabled={isCreating}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleGenerateSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="exam-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Tytuł egzaminu
                            </label>
                            <input
                                id="exam-title"
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="np. Egzamin z Algebry Liniowej"
                                className="w-full pl-3 pr-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="exam-topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Temat/zakres pytań
                            </label>
                            <textarea
                                id="exam-topic"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                required
                                rows={3}
                                placeholder="np. Macierze, układy równań liniowych i przestrzenie wektorowe."
                                className="w-full pl-3 pr-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Opisz, co mają zawierać pytania. Im dokładniej, tym lepiej.
                            </p>
                        </div>
                        <div>
                            <label htmlFor="exam-count" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Liczba pytań
                            </label>
                            <input
                                id="exam-count"
                                type="number"
                                value={numberOfQuestions}
                                onChange={e => setNumberOfQuestions(parseInt(e.target.value))}
                                min="1"
                                max="50"
                                className="w-full pl-3 pr-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isCreating || !title.trim() || !topic.trim()}
                            className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-all"
                        >
                            {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {isCreating ? 'Generowanie...' : `Generuj egzamin (${numberOfQuestions} pytań)`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}