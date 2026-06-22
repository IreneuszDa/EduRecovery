'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, PlusCircle, ArrowUpDown, Rows3, Loader2, X } from 'lucide-react';
import { SortByType } from './shared';
import { CreateExamPopover } from './CreateExamPopover';

interface ExamsToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortBy: SortByType;
    onSortChange: (value: SortByType) => void;
    onCreateEmpty: (title: string) => Promise<void>;
    onGenerate: (data: { title: string; topic: string; numberOfQuestions: number }) => Promise<void>;
    isCreating: boolean;
    onEnableSelectMode: () => void;
    hasExams: boolean;
}

export function ExamsToolbar({
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange,
    onCreateEmpty,
    onGenerate,
    isCreating,
    onEnableSelectMode,
    hasExams
}: ExamsToolbarProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Effect to handle clicks outside the popover to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Effect to focus the search input when it becomes visible
    useEffect(() => {
        if (isSearchVisible) {
            searchInputRef.current?.focus();
        }
    }, [isSearchVisible]);


    const handleCreateEmpty = async (title: string) => {
        setIsPopoverOpen(false);
        await onCreateEmpty(title);
    };

    const handleGenerate = async (data: { title: string; topic: string; numberOfQuestions: number }) => {
        setIsPopoverOpen(false);
        await onGenerate(data);
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
            {/* Title or Search Input */}
            <div className="flex-1">
                {isSearchVisible ? (
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input
                            ref={searchInputRef}
                            id="search-exam"
                            type="text"
                            placeholder="Szukaj..."
                            value={searchTerm}
                            onChange={e => onSearchChange(e.target.value)}
                            onBlur={() => { if (!searchTerm) setIsSearchVisible(false); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ) : (
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        Moje Egzaminy
                    </h2>
                )}
            </div>

            {/* Toolbar Actions */}
            <div className="flex items-center gap-2">
                {/* Search Toggle Button - hidden when search is visible */}
                {!isSearchVisible && (
                    <button
                        onClick={() => setIsSearchVisible(true)}
                        className="p-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        aria-label="Szukaj egzaminu"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                )}

                {/* Sort Dropdown */}
                <div className="relative">
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={e => onSortChange(e.target.value as SortByType)}
                        className="w-full appearance-none pl-4 pr-9 py-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Sortuj egzaminy"
                    >
                        <option value="newest">Najnowsze</option>
                        <option value="oldest">Najstarsze</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                </div>

                {/* Select Mode Button */}
                {hasExams && (
                    <button
                        onClick={onEnableSelectMode}
                        className="p-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        aria-label="Wybierz wiele"
                    >
                        <Rows3 className="w-5 h-5" />
                    </button>
                )}

                {/* Create Exam Button & Popover */}
                <div className="relative" ref={popoverRef}>
                    <button
                        onClick={() => setIsPopoverOpen(prev => !prev)}
                        disabled={isCreating}
                        aria-haspopup="true"
                        aria-expanded={isPopoverOpen}
                        className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white pl-3 pr-4 py-2.5 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 shadow-sm hover:shadow-md transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                        <span className="text-sm font-semibold hidden sm:inline">{isCreating ? 'Tworzenie...' : 'Nowy egzamin'}</span>
                    </button>
                    {isPopoverOpen && !isCreating && (
                        <CreateExamPopover
                            onClose={() => setIsPopoverOpen(false)}
                            onCreateEmpty={handleCreateEmpty}
                            onGenerate={handleGenerate}
                            isCreating={isCreating}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}