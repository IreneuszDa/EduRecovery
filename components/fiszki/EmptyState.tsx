'use client';

import { Layers3 } from 'lucide-react';

export function EmptyState({ isFiltered }: { isFiltered: boolean }) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <Layers3 className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                {isFiltered ? 'Brak pasujących zestawów' : 'Nie masz jeszcze żadnych zestawów'}
            </h3>
            <p className="max-w-md mt-2 text-slate-600 dark:text-slate-400">
                {isFiltered
                    ? 'Spróbuj zmienić filtry lub wyszukiwaną frazę.'
                    : 'Kliknij "Nowy zestaw", aby rozpocząć tworzenie.'}
            </p>
        </div>
    );
}