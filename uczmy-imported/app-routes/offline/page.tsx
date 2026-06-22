'use client';

// @/app/offline/page.tsx
// Offline fallback page for PWA

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Offline Icon */}
                <div className="mb-8">
                    <svg
                        className="w-24 h-24 mx-auto text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-4">
                    Brak połączenia
                </h1>

                {/* Description */}
                <p className="text-blue-200 mb-8">
                    Wygląda na to, że jesteś offline. Sprawdź połączenie z internetem
                    i spróbuj ponownie.
                </p>

                {/* Features available offline */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Dostępne offline:
                    </h2>
                    <ul className="text-left text-blue-200 space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                            Przeglądanie zapisanych materiałów
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                            Dostęp do fiszek (jeśli zapisane)
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-400 rounded-full" />
                            <span className="line-through opacity-50">Czat z AI</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-400 rounded-full" />
                            <span className="line-through opacity-50">Wysyłanie prac</span>
                        </li>
                    </ul>
                </div>

                {/* Retry Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    Spróbuj ponownie
                </button>

                {/* Status */}
                <p className="text-sm text-blue-300/50 mt-6">
                    Zmiany zostaną zsynchronizowane po połączeniu
                </p>
            </div>
        </div>
    );
}
