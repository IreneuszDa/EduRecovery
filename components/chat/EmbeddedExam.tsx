'use client';

import { motion } from 'framer-motion';
import LearnView from "@/components/exams/LearnView";
import { LearnViewSkeleton } from '@/components/exams/learn/LearnViewSkeleton';

// --- TYPE DEFINITIONS ---
// This interface defines the expected structure of the exam data.
// For a real application, this should be imported from a central types file (e.g., '@/lib/types').
interface ClientExam {
    _id: string;
    title: string;
    subject: string;
    questions: any[]; // Using 'any' to match the original code; ideally, this would be a specific Question type.
}

interface EmbeddedExamProps {
    /**
     * The full exam object to be displayed. If null or undefined, the component will render nothing.
     */
    examData: ClientExam | null;
}


// --- COMPONENT DEFINITION ---

/**
 * A wrapper component that displays an interactive exam view (`LearnView`)
 * within an animated container. It's designed to be embedded in other layouts,
 * like a chat interface.
 */
export function EmbeddedExam({ examData }: EmbeddedExamProps) {

    // If there's no exam data, render nothing. The parent component
    // can show a loading skeleton if needed.
    if (!examData) {
        return null;
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-4" // Adds spacing from the content above it.
        >
            <LearnView
                exam={examData}
                isEmbedded={true}
            />
        </motion.div>
    );
}