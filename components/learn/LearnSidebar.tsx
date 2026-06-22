// app/components/learn/LearnSidebar.tsx

"use client";

import Link from "next/link";
import { Edit, LayoutGrid, RefreshCw, Shuffle, Star, Target, Type } from "lucide-react";
import { LearnMode } from "@/lib/types";

interface LearnSidebarProps {
    learnMode: LearnMode;
    isReversed: boolean;
    setId: string;
    starredCount: number;
    onStartVanilla: () => void;
    onStartActive: () => void;
    onStartTyped: () => void;
    onToggleReversed: () => void;
    onShuffle: () => void;
    onStudyStarred: () => void;
}

export function LearnSidebar({
    learnMode,
    isReversed,
    setId,
    starredCount,
    onStartVanilla,
    onStartActive,
    onStartTyped,
    onToggleReversed,
    onShuffle,
    onStudyStarred,
}: LearnSidebarProps) {

    const pillTransform = {
        vanilla: 'translateY(0%)',
        active: 'translateY(100%)',
        typed: 'translateY(200%)',
    };

    const modeButtonStyles = "relative z-10 flex flex-1 items-center w-full px-4 py-3 text-sm transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-offset-slate-100 focus-visible:ring-blue-500 rounded-lg";

    const optionButtonStyles = "flex items-center w-full p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed";

    return (
        <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col p-8 pl-0">
            <div className="p-4 h-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl shadow-sm">

                <h3 className="px-1 pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tryby Nauki</h3>

                <div className="relative flex flex-col bg-slate-100 dark:bg-slate-900 rounded-xl">
                    <span
                        className="absolute top-0 left-0 w-full h-1/3 p-1 transition-transform duration-300 ease-in-out"
                        style={{ transform: pillTransform[learnMode] }}
                        aria-hidden="true"
                    >
                        <span className="block w-full h-full bg-white dark:bg-slate-700 rounded-lg shadow-md" />
                    </span>

                    <button
                        onClick={onStartVanilla}
                        className={`${modeButtonStyles} ${learnMode === 'vanilla' ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400'}`}
                    >
                        <LayoutGrid className={`w-5 h-5 mr-3 transition-colors ${learnMode === 'vanilla' ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span>Standard</span>
                    </button>
                    <button
                        onClick={onStartActive}
                        className={`${modeButtonStyles} ${learnMode === 'active' ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400'}`}
                    >
                        <Target className={`w-5 h-5 mr-3 transition-colors ${learnMode === 'active' ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span>Aktywna</span>
                    </button>
                    <button
                        onClick={onStartTyped}
                        className={`${modeButtonStyles} ${learnMode === 'typed' ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400'}`}
                    >
                        <Type className={`w-5 h-5 mr-3 transition-colors ${learnMode === 'typed' ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span>Pisanie</span>
                    </button>
                </div>

                <div className="my-6 border-t border-slate-200/80 dark:border-slate-700 -mx-4" />

                <h3 className="px-1 pb-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Opcje</h3>
                <div className="space-y-1.5">
                    <button onClick={onStudyStarred} className={optionButtonStyles} disabled={starredCount === 0}>
                        <span className="flex items-center justify-center w-9 h-9 bg-yellow-100 dark:bg-yellow-500/10 rounded-lg mr-3"><Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400" /></span>
                        <span className="text-sm font-medium">Ucz się oznaczonych ({starredCount})</span>
                    </button>
                    <button onClick={onShuffle} className={optionButtonStyles}>
                        <span className="flex items-center justify-center w-9 h-9 bg-blue-100 dark:bg-blue-500/10 rounded-lg mr-3"><Shuffle className="w-5 h-5 text-blue-600 dark:text-blue-400" /></span>
                        <span className="text-sm font-medium">Pomieszaj</span>
                    </button>
                    <button onClick={onToggleReversed} className={optionButtonStyles}>
                        <span className="flex items-center justify-center w-9 h-9 bg-purple-100 dark:bg-purple-500/10 rounded-lg mr-3"><RefreshCw className={`w-5 h-5 text-purple-600 dark:text-purple-400 transition-transform duration-300 ${isReversed ? 'rotate-180' : ''}`} /></span>
                        <span className="text-sm font-medium">Odwróć karty</span>
                    </button>
                    <Link href={`/dashboard/fiszki/edit/${setId}`} className={optionButtonStyles}>
                        <span className="flex items-center justify-center w-9 h-9 bg-orange-100 dark:bg-orange-500/10 rounded-lg mr-3"><Edit className="w-5 h-5 text-orange-600 dark:text-orange-400" /></span>
                        <span className="text-sm font-medium">Edytuj zestaw</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}