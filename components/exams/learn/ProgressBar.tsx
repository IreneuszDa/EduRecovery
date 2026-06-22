// components/exams/learn/ProgressBar.tsx
'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number; // A value between 0 and 100
}

export function ProgressBar({ progress }: ProgressBarProps) {
    return (
        // --- ZMIANA: Użycie zmiennych CSS do kontroli maksymalnej szerokości i marginesu. ---
        // Te zmienne są dziedziczone z komponentu LearnView.
        <div className="w-full max-w-[var(--main-max-width)] mb-[var(--margin-lg)]">

            {/* --- ZMIANA: Użycie zmiennej CSS do kontroli wysokości paska postępu. --- */}
            {/* Domyślna wartość '0.75rem' jest używana jako fallback. */}
            <div className="w-full bg-slate-200/70 dark:bg-slate-700 rounded-full h-[var(--progress-bar-height,'0.75rem')] shadow-inner overflow-hidden">
                <motion.div
                    className="bg-blue-500 h-[var(--progress-bar-height,'0.75rem')] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                />
            </div>
        </div>
    );
}