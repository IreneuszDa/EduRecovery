'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, PlusCircle, ArrowUpDown, Rows3, Loader2 } from 'lucide-react';
import { SortByType } from './types';
import { CreateSetPopover } from './CreateSetPopover';

interface FlashcardsToolbarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    sortBy: SortByType;
    onSortChange: (sort: SortByType) => void;
    onCreateEmpty: (title: string) => Promise<void>;
    onGenerate: (data: { title: string; topic: string; numberOfCards: number }) => Promise<void>;
    isCreating: boolean;
    onEnableSelectMode: () => void;
    hasSets: boolean;
}

export function FlashcardsToolbar({
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange,
    onCreateEmpty,
    onGenerate,
    isCreating,
    onEnableSelectMode,
    hasSets
}: FlashcardsToolbarProps) {
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsCreateMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCreateEmpty = async (title: string) => {
        setIsCreateMenuOpen(false);
        await onCreateEmpty(title);
    };

    const handleGenerate = async (data: { title: string; topic: string; numberOfCards: number }) => {
        setIsCreateMenuOpen(false);
        await onGenerate(data);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">Moje Zestawy</h2>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                        id="search-set" type="text" placeholder="Szukaj..."
                        value={searchTerm} onChange={e => onSearchChange(e.target.value)}
                        className="w-full md:w-48 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="relative">
                    <select
                        id="sort-by" value={sortBy} onChange={e => onSortChange(e.target.value as SortByType)}
                        className="w-full appearance-none pl-4 pr-9 py-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="newest">Najnowsze</option>
                        <option value="oldest">Najstarsze</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                </div>
                {hasSets && (
                    <button onClick={onEnableSelectMode} className="p-[9px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" aria-label="Wybierz wiele">
                        <Rows3 className="w-5 h-5" />
                    </button>
                )}
                <div className="relative" ref={popoverRef}>
                    <button
                        onClick={() => setIsCreateMenuOpen(prev => !prev)}
                        disabled={isCreating}
                        aria-haspopup="true"
                        aria-expanded={isCreateMenuOpen}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 shadow-sm hover:shadow-md transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                        <span className="text-sm font-semibold hidden sm:inline">{isCreating ? 'Tworzenie...' : 'Nowy zestaw'}</span>
                    </button>
                    {isCreateMenuOpen && !isCreating && (
                        <CreateSetPopover
                            onClose={() => setIsCreateMenuOpen(false)}
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