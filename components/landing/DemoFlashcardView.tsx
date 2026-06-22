"use client";

import { animated } from "@react-spring/web";
import { Star, Volume2 } from "lucide-react";
import { ISessionCard } from "@/lib/types";
import React from "react";

interface DemoFlashcardViewProps {
    card: ISessionCard;
    isRevealed: boolean;
    bind: (...args: any[]) => any;
    style: any;
    isStarred: boolean;
    onToggleStar: () => void;
}

export function DemoFlashcardView({
    card,
    isRevealed,
    bind,
    style,
    isStarred,
    onToggleStar,
}: DemoFlashcardViewProps) {

    // Menghentikan propagasi event untuk mencegah kartu terbalik saat tombol ditekan
    const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    // Fungsi untuk membaca teks dengan suara keras
    const handleSpeak = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            console.warn("Speech Synthesis tidak didukung di browser ini.");
            return;
        }

        const textToSpeak = isRevealed ? card.definition : card.term;
        window.speechSynthesis.cancel(); // Menghentikan ucapan yang sedang berlangsung

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'pl-PL'; // Mengatur bahasa ke Polandia
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <animated.div {...bind()} className="relative touch-none cursor-grab active:cursor-grabbing w-full" style={style}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/80 dark:border-slate-700 shadow-xl p-8 md:p-12 min-h-[22rem] flex flex-col justify-center relative">
                <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
                    <button
                        onClick={(e) => handleButtonClick(e, handleSpeak)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        aria-label="Przeczytaj na głos"
                    >
                        <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, onToggleStar)}
                        className={`p-2 transition-colors ${isStarred
                            ? 'text-yellow-400'
                            : 'text-slate-400 dark:text-slate-500 hover:text-yellow-500 dark:hover:text-yellow-400'
                            }`}
                        aria-label="Oznacz gwiazdką"
                    >
                        <Star className={`w-6 h-6 ${isStarred ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100">{card.term}</h2>
                </div>

                <div className={`transition-all duration-500 ease-in-out grid ${isRevealed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-slate-700 text-center">
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-slate-300">{card.definition}</p>
                        </div>
                    </div>
                </div>
            </div>
        </animated.div>
    );
}