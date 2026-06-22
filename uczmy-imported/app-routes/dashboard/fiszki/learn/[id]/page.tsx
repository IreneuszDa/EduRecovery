// app/dashboard/fiszki/[id]/learn/page.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { IFlashcardSet, ISessionCard, LearnMode } from "@/lib/types";
import { LearnSidebar } from "@/components/learn/LearnSidebar";
import { FlashcardView } from "@/components/learn/FlashcardView";
import { LearnControls } from "@/components/learn/LearnControls";
import { CompletionScreen } from "@/components/learn/CompletionScreen";
import { LoadingState } from "@/components/learn/LoadingState";
import { ErrorState } from "@/components/learn/ErrorState";
import { EmptySetState } from "@/components/learn/EmptySetState";

type SavedSessionState = {
    learnMode: LearnMode;
    sessionCards: ISessionCard[];
    currentIndex: number;
    isReversed: boolean;
    knownCards: number[];
};

export default function LearnPage() {
    const { id } = useParams<{ id: string }>();

    // --- State, Hooks, and Logic... (no changes in this section) ---
    const [set, setSet] = useState<IFlashcardSet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [learnMode, setLearnMode] = useState<LearnMode>('vanilla');
    const [sessionCards, setSessionCards] = useState<ISessionCard[]>([]);
    const [starredCards, setStarredCards] = useState<Set<number>>(new Set());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isReversed, setIsReversed] = useState(false);
    const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
    const [isComplete, setIsComplete] = useState(false);
    const [typedAnswer, setTypedAnswer] = useState("");
    const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [{ x, scale }, api] = useSpring(() => ({ x: 0, scale: 1 }));

    useEffect(() => {
        const fetchSetAndInitialize = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const savedStarred = localStorage.getItem(`starred_${id}`);
                if (savedStarred) {
                    setStarredCards(new Set(JSON.parse(savedStarred)));
                }

                const res = await fetch(`/api/flashcard-sets/${id}`);
                if (!res.ok) throw new Error("Nie udało się pobrać zestawu.");
                const data: IFlashcardSet = await res.json();
                setSet(data);

                const savedSession = localStorage.getItem(`session_${id}`);
                if (savedSession) {
                    const session: SavedSessionState = JSON.parse(savedSession);
                    setLearnMode(session.learnMode);
                    setSessionCards(session.sessionCards);
                    setCurrentIndex(session.currentIndex);
                    setIsReversed(session.isReversed);
                    setKnownCards(new Set(session.knownCards));
                } else if (data.cards.length > 0) {
                    setSessionCards(data.cards.map((card, index) => ({ ...card, originalIndex: index })));
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSetAndInitialize();
    }, [id]);

    useEffect(() => {
        if (id) localStorage.setItem(`starred_${id}`, JSON.stringify(Array.from(starredCards)));
    }, [starredCards, id]);

    useEffect(() => {
        if (id && !isLoading && set && sessionCards.length > 0 && learnMode !== 'vanilla' && !isComplete) {
            const sessionState: SavedSessionState = {
                learnMode,
                sessionCards,
                currentIndex,
                isReversed,
                knownCards: Array.from(knownCards)
            };
            localStorage.setItem(`session_${id}`, JSON.stringify(sessionState));
        }
    }, [id, isLoading, set, sessionCards, currentIndex, learnMode, isReversed, knownCards, isComplete]);

    const currentCard = useMemo(() => sessionCards[currentIndex], [sessionCards, currentIndex]);

    const resetCardState = useCallback((index = 0) => {
        setCurrentIndex(index);
        setIsRevealed(false);
        setTypedAnswer("");
        setAnswerState("idle");
        api.start({ x: 0, scale: 1, immediate: true });
    }, [api]);

    const startNewSession = useCallback((cardsToStudy: ISessionCard[], mode: LearnMode) => {
        if (id) localStorage.removeItem(`session_${id}`);
        setSessionCards([...cardsToStudy].sort(() => Math.random() - 0.5));
        resetCardState();
        setKnownCards(new Set());
        setIsComplete(false);
        setLearnMode(mode);
        setIsReversed(false);
    }, [id, resetCardState]);

    const startVanillaSession = useCallback(() => {
        if (!set) return;
        if (id) localStorage.removeItem(`session_${id}`);
        setSessionCards(set.cards.map((card, index) => ({ ...card, originalIndex: index })));
        resetCardState();
        setLearnMode('vanilla');
        setIsReversed(false);
        setIsComplete(false);
    }, [set, id, resetCardState]);

    const goToCard = useCallback((index: number) => {
        if (index < 0 || index >= sessionCards.length) return;
        speechSynthesis.cancel();
        if (isRevealed) {
            setIsRevealed(false);
            setTimeout(() => resetCardState(index), 150);
        } else {
            resetCardState(index);
        }
    }, [sessionCards.length, isRevealed, resetCardState]);

    const handleNext = useCallback(() => {
        const isLastCard = currentIndex >= sessionCards.length - 1;
        if ((learnMode === 'active' || learnMode === 'typed') && isLastCard) {
            if (id) localStorage.removeItem(`session_${id}`);
            setIsComplete(true);
        } else if (!isLastCard) {
            goToCard(currentIndex + 1);
        }
    }, [currentIndex, sessionCards.length, learnMode, goToCard, id]);

    const handlePrev = useCallback(() => goToCard(currentIndex - 1), [currentIndex, goToCard]);
    const handleMarkKnown = useCallback(() => { setKnownCards(prev => new Set(prev).add(currentIndex)); handleNext(); }, [currentIndex, handleNext]);
    const handleMarkUnknown = useCallback(() => { handleNext(); }, [handleNext]);

    const handleCheckAnswer = useCallback(() => {
        if (isRevealed || !currentCard) return;
        const correctAnswer = isReversed ? currentCard.term : currentCard.definition;
        const isCorrect = typedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        setAnswerState(isCorrect ? 'correct' : 'incorrect');
        if (isCorrect) {
            setKnownCards(prev => new Set(prev).add(currentIndex));
        }
        setIsRevealed(true);
    }, [isRevealed, currentCard, typedAnswer, isReversed, currentIndex]);

    const handleShuffle = useCallback(() => {
        if (!set) return;
        const shuffled = [...sessionCards].sort(() => Math.random() - 0.5);
        setSessionCards(shuffled);
        resetCardState();
    }, [sessionCards, resetCardState, set]);

    const getBaseCards = useCallback(() => {
        return set ? set.cards.map((card, index) => ({ ...card, originalIndex: index })) : [];
    }, [set]);

    const handleStudyStarred = useCallback(() => {
        if (!set || starredCards.size === 0) return;
        const starred = getBaseCards().filter(card => starredCards.has(card.originalIndex));
        startNewSession(starred, 'active');
    }, [set, starredCards, getBaseCards, startNewSession]);

    const handleToggleStar = useCallback((originalIndex: number) => {
        setStarredCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(originalIndex)) newSet.delete(originalIndex);
            else newSet.add(originalIndex);
            return newSet;
        });
    }, []);

    const handleSpeak = useCallback((text: string) => {
        if (!('speechSynthesis' in window)) return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pl-PL";
        speechSynthesis.speak(utterance);
    }, []);

    const bind = useDrag(({ down, movement: [mx], direction: [xDir], tap }) => {
        if (tap && learnMode !== 'typed') { setIsRevealed(prev => !prev); return; }
        const trigger = Math.abs(mx) > window.innerWidth / 4;
        if (!down && trigger) {
            const dir = xDir > 0 ? 1 : -1;
            if (isRevealed && learnMode === 'active') dir === 1 ? handleMarkKnown() : handleMarkUnknown();
            else dir === 1 ? handlePrev() : handleNext();
        }
        api.start({ x: down ? mx : 0, scale: down ? 1.05 : 1, immediate: down });
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isComplete || (e.target as HTMLElement).closest('textarea, input')) return;

            if (e.key === 'ArrowRight') return handleNext();
            if (e.key === 'ArrowLeft') return handlePrev();
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                speechSynthesis.cancel();

                if (learnMode === 'typed' && !isRevealed) {
                    return handleCheckAnswer();
                }

                if (isRevealed) {
                    if (learnMode === 'active') handleMarkKnown();
                    else handleNext();
                } else {
                    setIsRevealed(true);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRevealed, learnMode, isComplete, handleNext, handlePrev, handleMarkKnown, handleCheckAnswer]);


    // --- Render Logic ---
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!set || set.cards.length === 0) return <EmptySetState setId={id} setTitle={set?.title || 'Zestaw'} />;

    if (learnMode !== 'vanilla' && isComplete) {
        return (
            <CompletionScreen
                knownCount={knownCards.size}
                totalCount={sessionCards.length}
                missedCards={sessionCards.filter((_, index) => !knownCards.has(index))}
                onRetryMissed={(missed) => startNewSession(missed, learnMode)}
                onRestartSession={() => startNewSession(getBaseCards(), learnMode)}
                onSwitchToVanilla={startVanillaSession}
            />
        );
    }

    if (!currentCard) {
        return <LoadingState />;
    }

    const progressPercentage = learnMode === 'vanilla'
        ? ((currentIndex + 1) / sessionCards.length) * 100
        : (knownCards.size / sessionCards.length) * 100;

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900">
            <main className="flex-1 flex flex-col p-6 md:p-8 overflow-hidden">
                <div className="w-full flex items-center gap-4 mb-8 flex-shrink-0">
                    <Link href="/dashboard/fiszki" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="Wróć do wszystkich zestawów">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200 truncate">{set?.title}</h1>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0">
                    <div className="w-full max-w-2xl mx-auto">
                        <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-2">
                            {learnMode === 'vanilla' ? `Karta ${currentIndex + 1} z ${sessionCards.length}` : `Opanowano ${knownCards.size} z ${sessionCards.length}`}
                        </p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                            <div className={`${learnMode !== 'vanilla' ? 'bg-green-500' : 'bg-blue-600'} h-2 rounded-full transition-all`} style={{ width: `${progressPercentage}%` }}></div>
                        </div>

                        <FlashcardView
                            card={currentCard}
                            isRevealed={isRevealed}
                            isReversed={isReversed}
                            isStarred={starredCards.has(currentCard.originalIndex)}
                            learnMode={learnMode}
                            typedAnswer={typedAnswer}
                            onTypedAnswerChange={setTypedAnswer}
                            answerState={answerState}
                            onToggleStar={() => handleToggleStar(currentCard.originalIndex)}
                            onSpeak={handleSpeak}
                            bind={bind}
                            style={{ x, scale }}
                        />

                        <div className="mt-8 flex items-center justify-center gap-4 h-16">
                            <LearnControls
                                learnMode={learnMode}
                                isRevealed={isRevealed}
                                isFirstCard={currentIndex === 0 && learnMode === 'vanilla'}
                                isLastCard={currentIndex === sessionCards.length - 1}
                                onReveal={() => setIsRevealed(true)}
                                onNext={handleNext}
                                onPrev={handlePrev}
                                onMarkKnown={handleMarkKnown}
                                onMarkUnknown={handleMarkUnknown}
                                onCheckAnswer={handleCheckAnswer}
                                answerState={answerState}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <LearnSidebar
                learnMode={learnMode}
                isReversed={isReversed}
                setId={id}
                starredCount={starredCards.size}
                onStartVanilla={startVanillaSession}
                onStartActive={() => startNewSession(getBaseCards(), 'active')}
                onStartTyped={() => startNewSession(getBaseCards(), 'typed')}
                onToggleReversed={() => setIsReversed(p => !p)}
                onShuffle={handleShuffle}
                onStudyStarred={handleStudyStarred}
            />
        </div>
    );
}