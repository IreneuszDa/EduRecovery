'use client';

import { DocumentPlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
    isFiltered: boolean;
}

export function EmptyState({ isFiltered }: EmptyStateProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            {/* Dark mode: Icon color adjusted for dark backgrounds */}
            <DocumentPlusIcon className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />

            {/* Dark mode: Heading text color adjusted for high contrast */}
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                {isFiltered ? 'Brak pasujących egzaminów' : 'Nie masz jeszcze żadnych egzaminów'}
            </h3>

            {/* Dark mode: Paragraph text color adjusted for readability */}
            <p className="max-w-md mt-2 text-slate-600 dark:text-slate-400">
                {isFiltered
                    ? 'Spróbuj zmienić filtry lub wyszukiwaną frazę.'
                    : 'Kliknij "Nowy egzamin", aby rozpocząć tworzenie.'}
            </p>
        </div>
    );
}