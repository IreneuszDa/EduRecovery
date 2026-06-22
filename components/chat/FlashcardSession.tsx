'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Repeat, Shuffle, ExternalLink } from 'lucide-react';

// --- Child Component Imports ---
import { CompletionScreen } from '@/components/learn/CompletionScreen';
import { FlashcardView } from '@/components/learn/FlashcardView';
import { LearnControls } from '@/components/learn/LearnControls';
import { ISessionCard, LearnMode } from '@/lib/types';

// --- TYPE DEFINITIONS ---
interface FlashcardSet {
    _id: string;
    title: string;
    cards: ISessionCard[];
}

interface FlashcardSessionProps {
    flashcardSetData: FlashcardSet;
}

// --- COMPONENT DEFINITION ---

export function FlashcardSession({ flashcardSetData }: FlashcardSessionProps) {
    // --- STATE MANAGEMENT ---
    const [sessionCards, setSessionCards] = useState<ISessionCard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isReversed, setIsReversed] = useState(false);
    const [learnMode, setLearnMode] = useState<LearnMode>('active');
    const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
    const [starredCards, setStarredCards] = useState<Set<number>>(new Set());
    const [isComplete, setIsComplete] = useState(false);
    const [typedAnswer, setTypedAnswer] = useState('');
    const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    // --- DERIVED STATE ---
    const currentCard = useMemo(() => sessionCards[currentCardIndex], [sessionCards, currentCardIndex]);

    const missedCards = useMemo(() => {
        if (!isComplete) return [];
        return flashcardSetData.cards.filter(card => !knownCards.has(card.originalIndex));
    }, [isComplete, flashcardSetData.cards, knownCards]);

    const progressPercentage = useMemo(() => {
        const totalCardCount = flashcardSetData.cards.length;
        if (totalCardCount === 0) return 0;
        if (learnMode === 'vanilla') {
            return sessionCards.length > 0 ? ((currentCardIndex + 1) / sessionCards.length) * 100 : 0;
        }
        return (knownCards.size / totalCardCount) * 100;
    }, [sessionCards.length, currentCardIndex, knownCards.size, learnMode, flashcardSetData.cards.length]);

    // --- CORE LOGIC & HANDLERS ---
    const resetCardState = useCallback((newIndex: number = 0) => {
        setCurrentCardIndex(newIndex);
        setIsRevealed(false);
        setTypedAnswer("");
        setAnswerState("idle");
    }, []);

    const restartWithAllCards = useCallback(() => {
        const allCards = flashcardSetData.cards
            .map((card, index) => ({ ...card, originalIndex: index }))
            .sort(() => Math.random() - 0.5);
        setSessionCards(allCards);
        setKnownCards(new Set());
        setIsComplete(false);
        resetCardState(0);
    }, [flashcardSetData, resetCardState]);

    useEffect(() => {
        if (flashcardSetData?.cards.length > 0) {
            restartWithAllCards();
        }
    }, [flashcardSetData, restartWithAllCards]);

    const goToCard = useCallback((index: number) => {
        if (index < 0 || index >= sessionCards.length) return;
        if (isRevealed) {
            setIsRevealed(false);
            setTimeout(() => resetCardState(index), 150);
        } else {
            resetCardState(index);
        }
    }, [sessionCards.length, isRevealed, resetCardState]);

    const handleNext = useCallback(() => {
        const isLastCard = currentCardIndex >= sessionCards.length - 1;
        if ((learnMode === 'active' || learnMode === 'typed') && isLastCard) {
            setIsComplete(true);
        } else if (!isLastCard) {
            goToCard(currentCardIndex + 1);
        }
    }, [currentCardIndex, sessionCards.length, learnMode, goToCard]);

    const handlePrev = useCallback(() => goToCard(currentCardIndex - 1), [currentCardIndex, goToCard]);

    const handleMarkKnown = useCallback(() => {
        if (currentCard) {
            setKnownCards(prev => new Set(prev).add(currentCard.originalIndex));
        }
        handleNext();
    }, [currentCard, handleNext]);

    const handleCheckAnswer = useCallback(() => {
        if (isRevealed || !currentCard) return;
        const correctAnswer = isReversed ? currentCard.term : currentCard.definition;
        const isCorrect = typedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        setAnswerState(isCorrect ? 'correct' : 'incorrect');
        if (isCorrect) {
            setKnownCards(prev => new Set(prev).add(currentCard.originalIndex));
        }
        setIsRevealed(true);
    }, [isRevealed, currentCard, typedAnswer, isReversed]);

    const handleToggleStar = useCallback((originalIndex: number) => {
        setStarredCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(originalIndex)) {
                newSet.delete(originalIndex);
            } else {
                newSet.add(originalIndex);
            }
            return newSet;
        });
    }, []);

    const handleSpeak = useCallback((text: string): void => {
        if (!('speechSynthesis' in window)) {
            console.warn("Speech Synthesis not supported in this browser.");
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pl-PL";
        speechSynthesis.speak(utterance);
    }, []);

    const handleRetryMissed = useCallback((cardsToRetry: ISessionCard[]) => {
        setSessionCards([...cardsToRetry].sort(() => Math.random() - 0.5));
        setIsComplete(false);
        resetCardState(0);
    }, [resetCardState]);

    const handleSwitchToVanilla = useCallback(() => {
        setLearnMode('vanilla');
        restartWithAllCards();
    }, [restartWithAllCards]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isComplete || (e.target as HTMLElement).closest('textarea, input, button')) return;
            switch (e.key) {
                case 'ArrowRight':
                    handleNext();
                    break;
                case 'ArrowLeft':
                    handlePrev();
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    if (learnMode === 'typed' && !isRevealed) {
                        handleCheckAnswer();
                    } else if (isRevealed) {
                        if (learnMode === 'active') {
                            handleMarkKnown();
                        } else {
                            handleNext();
                        }
                    } else {
                        setIsRevealed(true);
                    }
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isComplete, isRevealed, learnMode, handleNext, handlePrev, handleMarkKnown, handleCheckAnswer]);


    // --- RENDER LOGIC ---
    if (!currentCard && !isComplete) {
        return null;
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-4"
        >
            <div className="w-full max-w-2xl mx-auto">
                {isComplete ? (
                    <CompletionScreen
                        knownCount={knownCards.size}
                        totalCount={flashcardSetData.cards.length}
                        missedCards={missedCards}
                        onRetryMissed={handleRetryMissed}
                        onRestartSession={restartWithAllCards}
                        onSwitchToVanilla={handleSwitchToVanilla}
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-2 px-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tabular-nums">
                                {learnMode === 'vanilla'
                                    ? `Karta ${currentCardIndex + 1} z ${sessionCards.length}`
                                    : `Opanowano ${knownCards.size} z ${flashcardSetData.cards.length}`
                                }
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsReversed(p => !p)}
                                    className={`p-2 rounded-full transition-colors ${isReversed ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    title="Odwróć karty"
                                >
                                    <Repeat className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={restartWithAllCards}
                                    className="p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title="Zacznij od nowa"
                                >
                                    <Shuffle className="w-4 h-4" />
                                </button>

                                {/* --- POPRAWKA ZASTOSOWANA TUTAJ --- */}
                                <Link
                                    href={`/dashboard/fiszki/learn/${flashcardSetData._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Otwórz w pełnym widoku"
                                    // Zmienione klasy kolorów dla lepszej widoczności
                                    className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800/60 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                                {/* --- KONIEC POPRAWKI --- */}

                            </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-4">
                            <div
                                className={`h-1.5 rounded-full transition-all duration-300 ${learnMode !== 'vanilla' ? 'bg-green-500' : 'bg-blue-600'}`}
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        {currentCard && (
                            <>
                                <FlashcardView
                                    card={currentCard}
                                    isRevealed={isRevealed}
                                    isReversed={isReversed}
                                    isStarred={starredCards.has(currentCard.originalIndex)}
                                    learnMode={learnMode}
                                    typedAnswer={typedAnswer}
                                    answerState={answerState}
                                    onToggleStar={() => handleToggleStar(currentCard.originalIndex)}
                                    onSpeak={handleSpeak}
                                    onTypedAnswerChange={setTypedAnswer}
                                    bind={() => { }}
                                    style={{}}
                                />
                                <div className="mt-8">
                                    <LearnControls
                                        learnMode={learnMode}
                                        isRevealed={isRevealed}
                                        isFirstCard={currentCardIndex === 0 && learnMode === 'vanilla'}
                                        isLastCard={currentCardIndex === sessionCards.length - 1}
                                        answerState={answerState}
                                        onReveal={() => setIsRevealed(true)}
                                        onNext={handleNext}
                                        onPrev={handlePrev}
                                        onMarkKnown={handleMarkKnown}
                                        onMarkUnknown={handleNext}
                                        onCheckAnswer={handleCheckAnswer}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}