'use client';

import { Check, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import React from 'react';

interface SelectionCheckboxProps {
    checked: boolean;
    onChange: () => void;
    isIndeterminate?: boolean;
    'aria-label': string;
}

export function SelectionCheckbox({ checked, onChange, isIndeterminate = false, 'aria-label': ariaLabel }: SelectionCheckboxProps) {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={isIndeterminate ? 'mixed' : checked}
            onClick={onChange}
            aria-label={ariaLabel}
            className={clsx(
                // Base styles, consistent across themes
                "h-6 w-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus:outline-none",

                // Focus styles with dark mode adaptation for the offset
                "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800",

                // Conditional styles for checked/unchecked states
                checked || isIndeterminate
                    // Checked state: Blue background works well in both light and dark modes
                    ? "bg-blue-600 border-blue-600 text-white"
                    // Unchecked state: Different styles for light and dark modes
                    : "bg-white border-slate-300 hover:border-blue-500 dark:bg-slate-700 dark:border-slate-500 dark:hover:border-blue-400"
            )}
        >
            {/* The icons are rendered inside the button, inheriting the `text-white` color when checked */}
            {checked && <Check className="h-4 w-4" />}
            {isIndeterminate && !checked && <Minus className="h-4 w-4" />}
        </button>
    );
}