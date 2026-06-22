// app/waitlist/page.tsx
"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WaitlistPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Błąd będzie teraz również obsługiwany przez sonner dla spójności UI
    // const [error, setError] = useState<string | null>(null);

    // Efekt do automatycznego wykrywania motywu
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => {
            document.documentElement.classList.toggle('dark', mediaQuery.matches);
        };
        updateTheme();
        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // setError(null); // Już niepotrzebne

        if (!email) {
            // Wyświetl błąd walidacji za pomocą sonner
            toast.error("Pole e-mail nie może być puste.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                setEmail(''); // Wyczyść pole po sukcesie
            } else {
                // Wyświetl błąd z API za pomocą sonner
                toast.error(data.message || 'Wystąpił nieznany błąd.');
            }
        } catch (err) {
            console.error('Błąd sieci lub serwera:', err);
            toast.error('Nie udało się połączyć z serwerem. Sprawdź połączenie internetowe.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Ulepszone tło z subtelnym wzorem i gradientem
        <main className="relative flex flex-col items-center justify-center min-h-screen w-full bg-white dark:bg-black overflow-hidden p-4">
            {/* Efekt tła: siatka */}
            <div className="absolute inset-0 w-full h-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            {/* Efekt tła: poświata */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <Link 
                href="/" 
                className="absolute top-6 left-6 z-10 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300 group"
                aria-label="Powrót do strony głównej"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium text-sm">Strona główna</span>
            </Link>

            {/* Z-index dodany, aby zawartość była nad tłem */}
            <div className="z-10 w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 rounded-2xl text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                    Już wkrótce!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                    Dołącz do listy oczekujących i bądź pierwszą osobą, która dowie się o starcie platformy.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative flex items-center">
                         <svg className="absolute left-4 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jan.kowalski@email.com"
                            className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-transparent text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all duration-300"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold py-3.5 px-4 rounded-lg hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Zarezerwuj miejsce'
                        )}
                    </button>
                </form>

                 {/* Usunęliśmy ten div, ponieważ wszystkie komunikaty (sukces i błąd) obsługuje Sonner */}
                 {/* <div className="mt-4 min-h-[24px]">...</div> */}
            </div>

            <footer className="z-10 mt-8 text-slate-500 dark:text-slate-500 text-xs">
                © {new Date().getFullYear()} Uczmy.pl Wszystkie prawa zastrzeżone.
            </footer>
        </main>
    );
}