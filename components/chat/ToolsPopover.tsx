// components/chat/ToolsPopover.tsx
import React from 'react';
import { motion } from "framer-motion";
import { GraduationCap, LucideProps } from "lucide-react";

// Assuming these icons are defined or imported elsewhere
const FlashcardIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const ExamIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const LearnIcon = ({ className }: { className?: string }) => <GraduationCap className={className} />;


type Action = 'chat' | 'generateFlashcards' | 'generateExam' | 'learn' | 'animate';

interface ToolsPopoverProps {
    onActionSelect: (action: Action) => void;
    onClose: () => void;
    currentAction: Action;
}

export const ToolsPopover = React.forwardRef<HTMLDivElement, ToolsPopoverProps>(({ onActionSelect, currentAction }, ref) => {

    const handleActionClick = (action: Action) => {
        // If the current action is already selected, treat it as a toggle to 'chat'
        const newAction = currentAction === action ? 'chat' : action;
        onActionSelect(newAction);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800"
        >
            <div className="flex flex-col gap-1">
                <button onClick={() => handleActionClick('learn')} className={`flex items-center w-full gap-3 rounded-md p-2 text-left text-sm font-medium transition-colors ${currentAction === 'learn' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'}`}>
                    <LearnIcon className="h-4 w-4" /> Ucz się
                </button>
                <button onClick={() => handleActionClick('generateFlashcards')} className={`flex items-center w-full gap-3 rounded-md p-2 text-left text-sm font-medium transition-colors ${currentAction === 'generateFlashcards' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'}`}>
                    <FlashcardIcon className="h-4 w-4" /> Fiszki
                </button>
                <button onClick={() => handleActionClick('generateExam')} className={`flex items-center w-full gap-3 rounded-md p-2 text-left text-sm font-medium transition-colors ${currentAction === 'generateExam' ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'}`}>
                    <ExamIcon className="h-4 w-4" /> Egzamin
                </button>

            </div>
        </motion.div>
    );
});

ToolsPopover.displayName = "ToolsPopover";