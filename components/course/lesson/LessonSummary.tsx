'use client';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

interface LessonSummaryProps {
    onFinish: () => void;
}

export function LessonSummary({ onFinish }: LessonSummaryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-xl"
        >
            <PartyPopper className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Lekcja ukończona!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Dobra robota! Kolejny krok na Twojej ścieżce nauki został zrobiony.</p>
            <button
                onClick={onFinish}
                className="mt-8 w-full rounded-lg py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-600"
            >
                Wróć do planu nauki
            </button>
        </motion.div>
    );
}