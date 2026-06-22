"use client";

import { Award, RefreshCw, Shuffle } from "lucide-react";
import { ISessionCard } from "@/lib/types"; // Adjust path if needed

interface CompletionScreenProps {
    knownCount: number;
    totalCount: number;
    missedCards: ISessionCard[];
    onRetryMissed: (cards: ISessionCard[]) => void;
    onRestartSession: () => void;
    onSwitchToVanilla: () => void;
}

export function CompletionScreen({
    knownCount,
    totalCount,
    missedCards,
    onRetryMissed,
    onRestartSession,
    onSwitchToVanilla,
}: CompletionScreenProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-slate-900">
            <div className="max-w-lg p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/70 dark:border-slate-700">
                <Award className="w-16 h-16 mx-auto text-yellow-500" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mt-4">Gratulacje!</h1>
                <p className="text-gray-600 dark:text-slate-300 mt-2 mb-8 text-lg">
                    Ukończyłeś/aś sesję nauki. Opanowałeś/aś <span className="font-bold text-green-600 dark:text-green-500">{knownCount}</span> z <span className="font-bold text-gray-800 dark:text-slate-100">{totalCount}</span> kart.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {missedCards.length > 0 && (
                        <button
                            onClick={() => onRetryMissed(missedCards)}
                            className="inline-flex items-center justify-center gap-3 bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-orange-600 transform hover:-translate-y-0.5 transition-all"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Poucz się {missedCards.length} nieopanowanych</span>
                        </button>
                    )}
                    <button
                        onClick={onRestartSession}
                        className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all"
                    >
                        <Shuffle className="w-5 h-5" />
                        <span>Zacznij od nowa</span>
                    </button>
                </div>
                <button onClick={onSwitchToVanilla} className="mt-8 inline-block text-gray-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Wróć do trybu standardowego
                </button>
            </div>
        </div>
    );
}