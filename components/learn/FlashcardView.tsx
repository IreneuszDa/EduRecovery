// app/components/learn/FlashcardView.tsx

"use client";

import { animated } from "@react-spring/web";
import { Star, Volume2 } from "lucide-react";
import { ISessionCard, LearnMode } from "@/lib/types";

interface FlashcardViewProps {
    card: ISessionCard;
    isRevealed: boolean;
    isReversed: boolean;
    isStarred: boolean;
    learnMode: LearnMode;
    typedAnswer: string;
    answerState: 'idle' | 'correct' | 'incorrect';
    onToggleStar: (originalIndex: number) => void;
    onSpeak: (text: string) => void;
    onTypedAnswerChange: (value: string) => void;
    bind: (...args: any[]) => any;
    style: any;
}

export function FlashcardView({
    card,
    isRevealed,
    isReversed,
    isStarred,
    learnMode,
    typedAnswer,
    answerState,
    onToggleStar,
    onSpeak,
    onTypedAnswerChange,
    bind,
    style,
}: FlashcardViewProps) {
    const displayFront = isReversed ? card.definition : card.term;
    const displayBack = isReversed ? card.term : card.definition;

    const handleInteraction = (e: React.MouseEvent | React.PointerEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    // Updated to include dark mode classes
    const answerColorClass = answerState === 'correct' ? 'text-green-700 dark:text-green-500' : 'text-red-700 dark:text-red-500';

    return (
        <animated.div {...bind()} className="relative touch-none cursor-grab active:cursor-grabbing" style={style}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/80 dark:border-slate-700 shadow-xl p-8 md:p-12 min-h-[24rem] flex flex-col justify-center relative">
                <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
                    <button onPointerDown={(e) => handleInteraction(e, () => onSpeak(displayFront))} onClick={(e) => handleInteraction(e, () => { })} className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Przeczytaj na głos (przód)">
                        <Volume2 className="w-5 h-5" />
                    </button>
                    <button onPointerDown={(e) => handleInteraction(e, () => onToggleStar(card.originalIndex))} onClick={(e) => handleInteraction(e, () => { })} className="p-2 text-slate-400 dark:text-slate-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors" aria-label="Oznacz gwiazdką">
                        <Star className={`w-6 h-6 transition-colors ${isStarred ? 'text-yellow-400 dark:text-yellow-400 fill-current' : ''}`} />
                    </button>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100">{displayFront}</h2>
                </div>

                <div className={`transition-all duration-500 ease-in-out grid ${isRevealed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-slate-700 text-center relative">
                            {learnMode === 'typed' && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Twoja odpowiedź:</p>
                                    <p className={`text-lg font-semibold break-words ${answerColorClass}`}>
                                        {typedAnswer || <span className="italic text-slate-400 dark:text-slate-500">Brak odpowiedzi</span>}
                                    </p>
                                </div>
                            )}

                            <p className="text-xl md:text-2xl text-gray-600 dark:text-slate-300">{displayBack}</p>

                            {isRevealed && (
                                <button onPointerDown={(e) => handleInteraction(e, () => onSpeak(displayBack))} onClick={(e) => handleInteraction(e, () => { })} className="absolute top-1/2 -translate-y-1/2 right-0 p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Przeczytaj na głos (tył)">
                                    <Volume2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {learnMode === 'typed' && !isRevealed && (
                    <div className="mt-8">
                        <textarea
                            value={typedAnswer}
                            onChange={(e) => onTypedAnswerChange(e.target.value)}
                            placeholder="Wpisz odpowiedź..."
                            className="w-full p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                            rows={3}
                            autoFocus
                            onPointerDown={(e) => e.stopPropagation()} // Prevent drag gesture on the text area
                        />
                    </div>
                )}
            </div>
        </animated.div>
    );
}