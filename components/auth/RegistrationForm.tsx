
"use client";

import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// --- STEP 1: Define props for the new activation key field ---
interface RegistrationFormProps {
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onBack: () => void;
    fullName: string; setFullName: Dispatch<SetStateAction<string>>;
    email: string; setEmail: Dispatch<SetStateAction<string>>;
    password: string; setPassword: Dispatch<SetStateAction<string>>;
    confirmPassword: string; setConfirmPassword: Dispatch<SetStateAction<string>>;
    activationKey: string; setActivationKey: Dispatch<SetStateAction<string>>; // Added
    agreedToTerms: boolean; setAgreedToTerms: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
    error: string | null;
}

export default function RegistrationForm({
    onSubmit, onBack,
    fullName, setFullName, email, setEmail, password, setPassword,
    confirmPassword, setConfirmPassword, activationKey, setActivationKey, // --- STEP 2: Destructure new props ---
    agreedToTerms, setAgreedToTerms, isLoading, error
}: RegistrationFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    return (
        <div className="animate-fade-in">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Utwórz konto</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Już prawie gotowe! Wypełnij formularz.</p>
            </div>

            <button onClick={onBack} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Zmień typ profilu
            </button>

            <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-200 dark:bg-gray-600" />
                <span className="mx-3 text-xs text-gray-400 dark:text-gray-500 uppercase font-medium">Wypełnij formularz</span>
                <div className="flex-grow h-px bg-gray-200 dark:bg-gray-600" />
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Imię i nazwisko</label>
                    <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jan Kowalski" disabled={isLoading} className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Adres email</label>
                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ty@przyklad.com" disabled={isLoading} className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500" />
                </div>
                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hasło</label>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 znaków"
                        disabled={isLoading}
                        className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                </div>
                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Potwierdź hasło</label>
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Powtórz hasło"
                        disabled={isLoading}
                        className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5"
                    >
                        {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                </div>

                {/* --- STEP 3: Add the new input field for the Activation Key --- */}
                <div>
                    <label htmlFor="activationKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Klucz aktywacyjny</label>
                    <input
                        id="activationKey"
                        type="text"
                        required
                        value={activationKey}
                        onChange={(e) => setActivationKey(e.target.value.toUpperCase())}
                        placeholder="np. A1B2C3D4"
                        disabled={isLoading}
                        className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-start space-x-2.5">
                    <input id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} disabled={isLoading} className="h-4 w-4 mt-0.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:ring-offset-slate-800 dark:focus:ring-blue-600" />
                    <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-300">Akceptuję <Link href="/regulamin" target="_blank" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Regulamin</Link> oraz <Link href="/polityka-prywatnosci" target="_blank" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Politykę Prywatności</Link>.</label>
                </div>
                {error && <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-center">{error}</p>}
                <button type="submit" disabled={isLoading || !agreedToTerms} className="w-full py-3 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 dark:focus:ring-offset-slate-800 dark:focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center">
                    {isLoading ? <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Zarejestruj się'}
                </button>
            </form>
        </div>
    );

}
