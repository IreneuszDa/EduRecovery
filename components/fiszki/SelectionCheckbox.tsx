'use client';

import { clsx } from 'clsx';
import { Check, Minus } from 'lucide-react';

export interface SelectionCheckboxProps {
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
                "h-6 w-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                checked || isIndeterminate
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-300 hover:border-blue-500"
            )}
        >
            {checked && <Check className="h-4 w-4" />}
            {isIndeterminate && !checked && <Minus className="h-4 w-4" />}
        </button>
    );
}