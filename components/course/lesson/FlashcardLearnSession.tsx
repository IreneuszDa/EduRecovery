'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Card {
    id: string;
    front: string;
    back: string;
}

interface FlashcardLearnSessionProps {
    cards: Card[];
    onSessionComplete: () => void;
}

export function FlashcardLearnSession({ cards, onSessionComplete }: FlashcardLearnSessionProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

    const currentCard = cards[currentCardIndex];
    const isLastCard = currentCardIndex === cards.length - 1;
    const progress = ((currentCardIndex + 1) / cards.length) * 100;

    const handleCardFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNextCard = (known: boolean) => {
        if (known) {
            setKnownCards(prev => {
                const newSet = new Set(prev);
                newSet.add(currentCard.id);
                return newSet;
            });
        }

        if (isLastCard) {
            onSessionComplete();
            return;
        }

        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex(prev => prev + 1);
        }, 300);
    };

    const cardVariants = {
        front: {
            rotateY: 0,
            transition: { duration: 0.5 }
        },
        back: {
            rotateY: 180,
            transition: { duration: 0.5 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-xl mx-auto flex flex-col items-center"
        >
            <div className="mb-6 w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Fiszka {currentCardIndex + 1} z {cards.length}
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Znane: {knownCards.size}
                    </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Flashcard */}
            <div
                className="w-full h-64 sm:h-80 cursor-pointer perspective-1000"
                onClick={handleCardFlip}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d shadow-lg rounded-lg"
                    animate={isFlipped ? "back" : "front"}
                    variants={cardVariants}
                >
                    {/* Front side */}
                    <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center p-6">
                        <h3 className="text-xl font-semibold text-center text-slate-800 dark:text-white">
                            {currentCard.front}
                        </h3>
                    </div>

                    {/* Back side */}
                    <div className="absolute w-full h-full backface-hidden rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center p-6 rotate-y-180">
                        <p className="text-lg text-center text-slate-800 dark:text-white">
                            {currentCard.back}
                        </p>
                    </div>
                </motion.div>
            </div>

            <p className="mt-4 text-sm text-center text-slate-500 dark:text-slate-400">
                Kliknij kartę, aby ją odwrócić
            </p>

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => handleNextCard(false)}
                    className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    Nie znam
                </button>
                <button
                    onClick={() => handleNextCard(true)}
                    className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                    Znam
                </button>
            </div>
        </motion.div>
    );
}

export default FlashcardLearnSession;
