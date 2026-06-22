'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Loader2, Sparkles, UploadCloud, XCircle } from 'lucide-react';
import { Question } from '@/components/exams/question-types';

type AIGeneratorProps = {
    existingQuestions: Question[];
    onQuestionsGenerated: (newQuestions: Question[]) => void;
    disabled: boolean;
};

export default function AIGenerator({ existingQuestions, onQuestionsGenerated, disabled }: AIGeneratorProps) {
    const [generationPrompt, setGenerationPrompt] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedModelName, setSelectedModelName] = useState<string>(''); // Jeśli chcesz go używać

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleGenerateWithAI = async (e: FormEvent) => {
        e.preventDefault();
        if (!generationPrompt && !file) {
            setError("Proszę wpisać instrukcję lub wgrać plik, aby wygenerować pytania.");
            return;
        }
        const isConfirmed = window.confirm("Spowoduje to dodanie nowych pytań wygenerowanych przez AI do bieżącego egzaminu. Czy chcesz kontynuwać?");
        if (!isConfirmed) return;

        setIsGenerating(true);
        setError(null);

        const formData = new FormData();
        formData.append('existingQuestions', JSON.stringify(existingQuestions));
        if (generationPrompt) formData.append('prompt', generationPrompt);
        if (file) formData.append('file', file);
        if (selectedModelName) {
            formData.append('modelName', selectedModelName);
        }

        try {
            const res = await fetch('/api/exams/generate', { method: 'POST', body: formData });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'AI failed to generate questions.');
            }
            const generatedData: { questions: Question[] } = await res.json();
            if (generatedData.questions) {
                onQuestionsGenerated(generatedData.questions);
            }
            setGenerationPrompt('');
            setFile(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const isDisabled = isGenerating || disabled;

    return (
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:bg-slate-800/60 dark:from-slate-800/60 dark:via-slate-800/80 dark:to-slate-900/70 p-6 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/60 mb-8 transition-all duration-300">
            <div className="flex items-center mb-2">
                <Sparkles className="h-7 w-7 mr-3 text-blue-500 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Generator AI (Google Gemini)
                </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-5 text-sm">
                Opisz co wygenerować, wgraj plik (PDF/obraz), lub zrób obie rzeczy naraz.
            </p>
            <form onSubmit={handleGenerateWithAI} className="flex flex-col gap-4">
                <textarea
                    name="prompt"
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 text-slate-900 dark:text-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200"
                    placeholder="Np. 'Stwórz 5 pytań zamkniętych (ABCD) z historii Polski na podstawie załączonego pliku PDF'..."
                    rows={3}
                    disabled={isDisabled}
                />

                {/* Sekcja przesyłania pliku */}
                {!file ? (
                    <label htmlFor="file-upload" className={`relative flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-300/80 dark:border-slate-600/80 border-dashed rounded-lg transition-colors ${isDisabled ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-700/50' : 'cursor-pointer bg-white/50 dark:bg-slate-700/50 hover:border-blue-400 dark:hover:border-blue-500'}`}>
                        <div className="space-y-1 text-center">
                            <UploadCloud className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" />
                            <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                <span className="relative font-medium text-blue-600 dark:text-blue-400">
                                    Wybierz plik
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf,image/png,image/jpeg" disabled={isDisabled} />
                                </span>
                                <p className="pl-1">lub przeciągnij i upuść</p>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500">PDF, PNG, JPG</p>
                        </div>
                    </label>
                ) : (
                    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-600">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate pr-2">{file.name}</p>
                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                            disabled={isDisabled}
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {error && <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{error}</p>}

                <button type="submit" className="btn-primary w-full mt-2 text-base py-2.5" disabled={isDisabled || (!generationPrompt && !file)}>
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generowanie...
                        </>
                    ) : (
                        'Generuj Pytania z AI'
                    )}
                </button>
            </form>
        </div>
    );
}