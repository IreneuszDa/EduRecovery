"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

// Zod schema do walidacji hasła po stronie klienta
const passwordSchema = z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków." });

// --- Komponent Kliencki z Formularzem ---
// Ten komponent zawiera całą logikę interaktywną i jest opakowany w Suspense.
function ResetPasswordConfirmForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Efekt do automatycznego wykrywania i stosowania motywu systemowego
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => document.documentElement.classList.toggle('dark', mediaQuery.matches);
        updateTheme();
        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Walidacja po stronie klienta
        if (password !== confirmPassword) {
            setError("Hasła nie są takie same.");
            return;
        }
        const validation = passwordSchema.safeParse(password);
        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password-confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Wystąpił nieznany błąd.");
            }

            setSuccessMessage(data.message);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Renderuj błąd, jeśli token nie istnieje w URL
    if (!token) {
        return (
            <div className="w-full max-w-sm text-center">
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Nieprawidłowy Link</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Link do resetowania hasła jest niekompletny lub uszkodzony.</p>
                <Link href="/reset-password" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                    Wróć, aby poprosić o nowy link
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-2xl dark:shadow-none">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Ustaw Nowe Hasło
                </h1>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 rounded-md text-sm">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/50 border border-green-400 text-green-700 dark:text-green-300 rounded-md text-sm">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!successMessage && (
                    <>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Nowe hasło
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={isLoading}
                                className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Potwierdź nowe hasło
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={isLoading}
                                className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 dark:focus:ring-blue-500 transition-colors duration-150 disabled:opacity-70 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Zresetuj hasło'
                            )}
                        </button>
                    </>
                )}
            </form>

            {successMessage && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                    <Link href="/" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 hover:underline transition-colors duration-150">
                        Przejdź do strony logowania
                    </Link>
                </p>
            )}
        </div>
    );
}


// --- Główny Komponent Strony (Serwerowy) ---
// Ten komponent renderuje stronę i używa <Suspense> do obsługi ładowania komponentu klienckiego.
export default function ResetPasswordConfirmPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6">
            <Suspense fallback={<div>Ładowanie...</div>}>
                <ResetPasswordConfirmForm />
            </Suspense>
        </main>
    );
}