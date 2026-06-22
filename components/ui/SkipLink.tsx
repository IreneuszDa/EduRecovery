'use client';

// @/components/ui/SkipLink.tsx
// Skip to main content link for keyboard accessibility

import { useState } from 'react';

interface SkipLinkProps {
    targetId?: string;
    label?: string;
}

export function SkipLink({
    targetId = 'main-content',
    label = 'Przejdź do głównej treści'
}: SkipLinkProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href={`#${targetId}`}
            onClick={handleClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
                fixed top-0 left-0 z-[9999]
                px-4 py-2
                bg-blue-600 text-white font-medium
                transition-transform duration-200
                ${isFocused ? 'translate-y-0' : '-translate-y-full'}
                focus:outline-none focus:ring-2 focus:ring-blue-400
            `}
        >
            {label}
        </a>
    );
}

export default SkipLink;
