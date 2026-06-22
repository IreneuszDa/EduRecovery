import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

// We'll extend the standard HTML Input attributes.
// This gives us `value`, `onChange`, `className`, `placeholder`, etc., for free.
export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> { }

// This component will now just be a styled <input>.
// We use `forwardRef` so you can pass a ref to it, which is good practice.
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                type="text"
                // We use `clsx` to merge the default styles with any `className`
                // passed from the parent component.
                className={clsx(
                    'w-full bg-white border border-gray-300 rounded-xl shadow-sm py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    // The className from the props (e.g., "pl-12") will be added here
                    className
                )}
                {...props}
            />
        );
    }
);

SearchInput.displayName = 'SearchInput';