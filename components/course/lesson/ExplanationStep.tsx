'use client';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface ExplanationStepProps {
    title: string;
    content: string;
    onContinue: () => void;
}

export function ExplanationStep({ title, content, onContinue }: ExplanationStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl text-center"
        >
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg">{content}</p>
            </div>
            <button
                onClick={onContinue}
                className="mt-8 w-full max-w-xs flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-md font-semibold text-white transition-all bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <Rocket className="h-5 w-5" />
                <span>Zrozumiano, zaczynamy ćwiczenia!</span>
            </button>
        </motion.div>
    );
}