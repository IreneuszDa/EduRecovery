'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, PlusCircle, Sparkles, FilePlus2, X, ArrowLeft } from 'lucide-react';

interface CreateExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    isCreating: boolean;
    onCreateEmpty: (title: string) => Promise<void>;
    onStartGenerate: () => void;
}

export function CreateExamModal({ isOpen, onClose, isCreating, onCreateEmpty, onStartGenerate }: CreateExamModalProps) {
    const [step, setStep] = useState<'initial' | 'empty_form' | 'ai_form'>('initial');
    const [title, setTitle] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setStep('initial');
            setTitle('');
        }, 300);
    };

    const handleCreateClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onCreateEmpty(title);
            handleClose();
        }
    };

    const handleGenerateClick = () => {
        onStartGenerate();
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in-0"
            onClick={handleClose}
        >
            <div
                ref={modalRef}
                className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl relative animate-in fade-in-0 zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {(step === 'empty_form' || step === 'ai_form') && (
                            <button type="button" onClick={() => setStep('initial')} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        )}
                        {step === 'initial' && 'Stwórz nowy egzamin'}
                        {step === 'empty_form' && 'Stwórz pusty egzamin'}
                        {step === 'ai_form' && 'Generuj z AI'}
                    </h2>
                    <button onClick={handleClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div>
                    {step === 'initial' && (
                        <div className="space-y-4">
                            <button
                                onClick={() => setStep('empty_form')}
                                disabled={isCreating}
                                className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-wait text-left"
                            >
                                <FilePlus2 className="h-10 w-10 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">Stwórz pusty egzamin</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Zacznij od zera i dodawaj pytania ręcznie.</p>
                                </div>
                            </button>
                            <button
                                onClick={handleGenerateClick}
                                className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 text-left"
                            >
                                <Sparkles className="h-10 w-10 text-blue-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">Generuj z AI</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Opisz temat, a my stworzymy egzamin za Ciebie.</p>
                                </div>
                            </button>
                        </div>
                    )}
                    {step === 'empty_form' && (
                        <form onSubmit={handleCreateClick} className="animate-in fade-in-0">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="exam-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tytuł egzaminu</label>
                                    <input id="exam-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="np. Egzamin z biologii" className="w-full pl-3 pr-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={isCreating || !title.trim()}
                                    className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all"
                                >
                                    {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                                    {isCreating ? 'Tworzenie...' : 'Stwórz egzamin'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}