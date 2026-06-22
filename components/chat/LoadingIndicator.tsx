'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// --- TYPE DEFINITIONS ---

interface LoadingIndicatorProps {
    /**
     * The text to display next to the spinning loader.
     * e.g., "Loading...", "Generating exam..."
     */
    text: string;
    /**
     * Optional TailwindCSS classes to apply to the container div for custom styling.
     * Defaults to providing some top margin.
     */
    className?: string;
}


// --- COMPONENT DEFINITION ---

/**
 * A reusable loading indicator component that displays a spinning icon and a
 * descriptive text. It's designed to be used as a placeholder while
 * data is being fetched or processed.
 */
export function LoadingIndicator({ text, className = "mt-4" }: LoadingIndicatorProps) {
    return (
        <motion.div
            layout
            // Animate from being invisible and slightly scaled down
            initial={{ opacity: 0, scale: 0.95 }}
            // Animate to being fully visible and at normal scale
            animate={{ opacity: 1, scale: 1 }}
            // A quick exit animation
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            // The `layout` prop ensures smooth animation if the indicator's position changes
            className={`w-full flex justify-center items-center min-h-[4rem] ${className}`}
        >
            <div className='flex items-center gap-3 text-slate-500 dark:text-slate-400'>
                {/* The spinning loader icon from lucide-react */}
                <Loader2 className="w-5 h-5 animate-spin" />
                {/* The descriptive text */}
                <p className="text-sm font-medium">{text}</p>
            </div>
        </motion.div>
    );
}