"use client";

import Link from "next/link";
// --- 1. Zaimportuj useRouter z next/navigation ---
import { useRouter } from "next/navigation";

// --- Ikona Ucznia z dodanymi stylami dla trybu ciemnego ---
const StudentIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        // Zaktualizowano kolor ikony dla trybu ciemnego
        className="h-10 w-10 mx-auto mb-3 text-blue-600 dark:text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8l-4.5-2.5-1.5 2.5 4.5 2.5 1.5-2.5z"
        />
    </svg>
);

// --- Ikona Nauczyciela z dodanymi stylami dla trybu ciemnego ---
const TeacherIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        // Zaktualizowano kolor ikony dla trybu ciemnego
        className="h-10 w-10 mx-auto mb-3 text-indigo-600 dark:text-indigo-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ParentIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 mx-auto mb-3 text-green-600 dark:text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

interface ProfileTypeSelectorProps {
    onSelectProfileType: (type: number) => void;
}

export default function ProfileTypeSelector({ onSelectProfileType }: ProfileTypeSelectorProps) {
    // --- 2. Zainicjuj router ---
    const router = useRouter();

    // --- Zaktualizowano styl karty, dodając klasy dark: ---
    const cardStyle = "w-full flex-1 p-6 text-center border rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 " +
        "bg-white border-gray-300 hover:bg-gray-100 hover:shadow-md " +
        "dark:bg-slate-800 dark:border-gray-700 dark:hover:bg-slate-700";

    return (
        <div className="animate-fade-in">
            {/* --- 3. Dodaj przycisk "Wróć" --- */}
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 7-7" />
                    </svg>
                    Wróć
                </button>
            </div>

            <div className="text-center mb-8">
                {/* Zaktualizowano kolory tekstu dla trybu ciemnego */}
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dołącz do nas</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Wybierz typ profilu, aby rozpocząć.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => onSelectProfileType(0)} className={cardStyle}>
                    <StudentIcon />
                    {/* Zaktualizowano kolory tekstu dla trybu ciemnego */}
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Jestem Uczniem</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chcę znaleźć korepetytora i rozwijać swoje umiejętności.</p>
                </button>
                <button onClick={() => onSelectProfileType(1)} className={cardStyle}>
                    <TeacherIcon />
                    {/* Zaktualizowano kolory tekstu dla trybu ciemnego */}
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Jestem Nauczycielem</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chcę oferować korepetycje i docierać do nowych uczniów.</p>
                </button>
                <button onClick={() => onSelectProfileType(2)} className={cardStyle}>
                    <ParentIcon />
                    {/* Zaktualizowano kolory tekstu dla trybu ciemnego */}
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Jestem Rodzicem</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chcę monitorować postępy swojego dziecka.</p>
                </button>
            </div>
            {/* Zaktualizowano kolory tekstu i linku dla trybu ciemnego */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
                Masz już konto?{" "}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                    Zaloguj się
                </Link>
            </p>
        </div>
    );
}