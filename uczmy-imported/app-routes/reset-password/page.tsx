"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { z } from "zod";

// Zod schema for client-side validation
const emailSchema = z.string().email({ message: "Proszę podać prawidłowy adres e-mail." });

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Efekt do automatycznego wykrywania i stosowania motywu systemowego
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => {
            if (mediaQuery.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        updateTheme();
        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // 1. Walidacja po stronie klienta
        const validation = emailSchema.safeParse(email);
        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
        }

        // 2. Ustawienie stanu ładowania w celu aktualizacji interfejsu użytkownika
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            // Odpowiedzi serwera, nawet te z błędem, często zawierają treść JSON
            const data = await response.json();

            // 3. Sprawdzenie, czy zapytanie zakończyło się niepowodzeniem
            if (!response.ok) {
                // Rzucenie błędu z wiadomością od serwera, jeśli jest dostępna
                throw new Error(data.message || "Coś poszło nie tak. Spróbuj ponownie.");
            }

            // 4. Po pomyślnym zakończeniu, ustawienie komunikatu o sukcesie
            setSuccessMessage(data.message);

        } catch (err: any) {
            // 5. Przechwycenie błędów (z sieci lub rzuconych ręcznie) i ich wyświetlenie
            console.error("Błąd żądania resetowania hasła:", err);
            setError(err.message || "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
        } finally {
            // 6. Zawsze wyłączaj stan ładowania po zakończeniu operacji
            setIsLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6">
            <div className="w-full max-w-sm bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-2xl dark:shadow-none">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Odzyskaj hasło
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Wpisz swój adres e-mail, aby otrzymać link do resetowania hasła.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-md text-sm">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ukrycie formularza po pomyślnym wysłaniu, aby zapobiec ponownym próbom */}
                    {!successMessage && (
                        <>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Adres email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ty@przyklad.com"
                                    disabled={isLoading}
                                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 disabled:bg-gray-50 dark:disabled:bg-slate-800"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 dark:focus:ring-blue-500 transition-colors duration-150 disabled:opacity-70 flex items-center justify-center rounded-lg"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Wyślij link do resetowania hasła'
                                )}
                            </button>
                        </>
                    )}
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                    Pamiętasz hasło?{" "}
                    <Link href="/" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 hover:underline transition-colors duration-150">
                        Wróć do logowania
                    </Link>
                </p>
            </div>
        </main>
    );
}