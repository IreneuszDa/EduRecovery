'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { TrashIcon, EyeIcon, EyeSlashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { AcademicCapIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { Loader2 } from 'lucide-react';
import { IFlashcardSet } from './types';
import { getCategoryIcon, timeAgo } from './utils';

interface FlashcardSetCardProps {
    set: IFlashcardSet;
    onDelete: (id: string) => void;
    isDeleting: boolean;
    onToggleVisibility: (id: string, currentStatus: boolean) => void;
    isUpdatingVisibility: boolean;
    isSelected: boolean;
    isSelectModeActive: boolean;
    onToggleSelection: (id: string) => void;
}

export function FlashcardSetCard({
    set,
    onDelete,
    isDeleting,
    onToggleVisibility,
    isUpdatingVisibility,
    isSelected,
    isSelectModeActive,
    onToggleSelection,
}: FlashcardSetCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="group relative flex flex-col h-full">
            <div className={clsx("absolute -inset-2 rounded-3xl bg-blue-100/60 dark:bg-blue-900/40 transition-opacity duration-300", isSelectModeActive && isSelected ? "opacity-100" : "opacity-0")} />
            <div
                className={clsx(
                    "relative bg-white dark:bg-slate-800 border rounded-2xl flex flex-col transition-all duration-300 ease-in-out h-full",
                    isSelectModeActive ? "hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer" : "hover:shadow-lg hover:-translate-y-1.5 hover:border-blue-400 dark:hover:border-blue-500",
                    isSelected ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20" : "border-slate-200/70 dark:border-slate-700"
                )}
                onClick={() => { if (isSelectModeActive) onToggleSelection(set._id); }}
            >
                <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 pt-1">{getCategoryIcon(set.category)}</div>
                            <div>
                                <p className="inline-flex bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-xs px-2.5 py-1 rounded-full mb-2">
                                    {set.category || 'Bez kategorii'}
                                </p>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight break-words">
                                    {set.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {(set.cards ?? []).length} kart • Utworzono {timeAgo(set.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className={clsx("relative flex-shrink-0", isSelectModeActive && "pointer-events-none")} ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(prev => !prev)}
                                className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <EllipsisVerticalIcon className="h-5 w-5" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200/80 dark:border-slate-700 z-10 py-1">
                                    <button
                                        onClick={() => { onToggleVisibility(set._id, set.isPublic); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        {isUpdatingVisibility ? <Loader2 className="h-4 w-4 animate-spin" /> : (set.isPublic ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />)}
                                        <span>{set.isPublic ? 'Ustaw jako prywatny' : 'Ustaw jako publiczny'}</span>
                                    </button>
                                    <button
                                        onClick={() => { onDelete(set._id); setIsMenuOpen(false); }}
                                        disabled={isDeleting}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                                    >
                                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
                                        <span>Usuń</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-auto border-t border-slate-200/70 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href={`/dashboard/fiszki/edit/${set._id}`}
                            className={clsx("flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors", isSelectModeActive && "pointer-events-none")}
                        >
                            <PencilSquareIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            <span>Edytuj</span>
                        </Link>
                        <Link
                            href={`/dashboard/fiszki/learn/${set._id}`}
                            className={clsx("flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600", isSelectModeActive && "pointer-events-none")}
                        >
                            <AcademicCapIcon className="h-5 w-5" />
                            <span>Ucz się</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}