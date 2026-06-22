'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { AcademicCapIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Exam, getSubjectIcon, timeAgo } from './shared';

interface ExamCardProps {
    exam: Exam;
    onDelete: (id: string) => void;
    isDeleting: boolean;
    onToggleVisibility: (id: string, currentStatus: boolean) => void;
    isUpdatingVisibility: boolean;
    isSelected: boolean;
    isSelectModeActive: boolean;
    onToggleSelection: (id: string) => void;
}

export function ExamCard({
    exam,
    onDelete,
    isDeleting,
    onToggleVisibility,
    isUpdatingVisibility,
    isSelected,
    isSelectModeActive,
    onToggleSelection,
}: ExamCardProps) {
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
        <div className="group relative flex flex-col h-full py-2">
            {/* --- SELECTION INDICATOR --- */}
            <div className={clsx("absolute -inset-2 rounded-3xl bg-blue-100/60 dark:bg-blue-900/40 transition-opacity duration-300", isSelectModeActive && isSelected ? "opacity-100" : "opacity-0")} />

            <div
                className={clsx(
                    "relative bg-white dark:bg-slate-800 border rounded-2xl flex flex-col transition-all duration-300 ease-in-out h-full",
                    isSelectModeActive
                        ? "hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer"
                        : "hover:shadow-lg hover:-translate-y-1.5 hover:border-blue-400 dark:hover:border-blue-500",
                    isSelected
                        ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20 dark:border-blue-500"
                        : "border-slate-200/70 dark:border-slate-700"
                )}
                onClick={() => { if (isSelectModeActive) onToggleSelection(exam._id); }}
            >
                <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                            <div className="flex-shrink-0 pt-1">{getSubjectIcon(exam.subject)}</div>
                            <div className="min-w-0">
                                <p className="inline-flex bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold text-xs px-2.5 py-1 rounded-full mb-2">
                                    {exam.subject || "Bez przedmiotu"}
                                </p>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight break-words truncate">
                                    {exam.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Utworzono {timeAgo(exam.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER BUTTONS --- */}
                <div className="mt-auto border-t border-slate-200/70 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href={`/dashboard/exams/edit/${exam._id}`}
                            className={clsx("flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors", isSelectModeActive && "pointer-events-none")}
                        >
                            <PencilSquareIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            <span>Edytuj</span>
                        </Link>
                        <Link
                            href={`/dashboard/exams/learn/${exam._id}`}
                            className={clsx("flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600", isSelectModeActive && "pointer-events-none")}
                        >
                            <AcademicCapIcon className="h-5 w-5" />
                            <span>Rozwiąż</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}