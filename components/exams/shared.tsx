import {
    CalculatorIcon,
    BookOpenIcon,
    CodeBracketIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

// ============================================================================
// SHARED TYPES (No changes needed)
// ============================================================================

export interface Exam {
    _id: string;
    title: string;
    subject: string;
    createdAt: string;
    isPublic: boolean;
    questions: any[];
}

export type SortByType = 'newest' | 'oldest';


// ============================================================================
// SHARED UTILITY FUNCTIONS
// ============================================================================

/**
 * Returns an icon based on the exam's subject, with dark mode support.
 * @param subject The subject string of the exam.
 * @returns A JSX element representing the icon.
 */
export const getSubjectIcon = (subject: string): React.ReactNode => {
    if (!subject) {
        // Default icon with dark mode variant
        return <DocumentTextIcon className="h-7 w-7 text-slate-500 dark:text-slate-400" />;
    }
    const s = subject.toLowerCase();

    // Each case now includes a `dark:` variant for the text color
    if (s.includes('matematyka')) {
        return <CalculatorIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />;
    }
    if (s.includes('historia')) {
        return <BookOpenIcon className="h-7 w-7 text-amber-600 dark:text-amber-400" />;
    }
    if (s.includes('informatyka') || s.includes('programowanie')) {
        return <CodeBracketIcon className="h-7 w-7 text-teal-600 dark:text-teal-400" />;
    }

    // Default icon with dark mode variant
    return <DocumentTextIcon className="h-7 w-7 text-slate-500 dark:text-slate-400" />;
};

/**
 * Converts a date string into a "time ago" format.
 * No dark mode changes are needed here as this function returns a string, not a UI component.
 * The color of the output text will be determined by the component that renders it.
 * @param dateString The ISO date string to convert.
 * @returns A formatted string like "5 min temu".
 */
export const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "przed chwilą";
    if (minutes < 60) return `${minutes} min temu`;
    if (hours < 24) return `${hours} godz. temu`;
    return `${days} dni temu`;
};