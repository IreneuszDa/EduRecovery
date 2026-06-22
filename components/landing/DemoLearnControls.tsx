"use client";

import { ChevronRight, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoLearnControlsProps {
    isRevealed: boolean;
    onReveal: () => void;
    onNext: () => void;
    onPrev: () => void;
    disablePrev?: boolean;
    disableNext?: boolean;
}

export function DemoLearnControls({
    isRevealed,
    onReveal,
    onNext,
    onPrev,
    disablePrev = false,
    disableNext = false,
}: DemoLearnControlsProps) {
    // MODIFICATION: Switched to a smoother, more subtle fade and scale animation.
    const textVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    };

    return (
        <div className="flex justify-center items-center w-full h-24 gap-4">
            <motion.button
                layout
                onClick={isRevealed ? onNext : onReveal}
                disabled={disableNext && isRevealed}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-64 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isRevealed ? "next" : "reveal"}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={textVariants}
                        // MODIFICATION: Added a transition prop for a quicker, snappier feel.
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                        className="flex items-center justify-center gap-2"
                    >
                        {isRevealed ? (
                            <>
                                <span>Następna</span>
                                <ChevronRight className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                <span>Odkryj</span>
                                <RotateCw className="w-5 h-5" />
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    );
}