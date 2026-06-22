// components/learn/EmptySetState.tsx
"use client";
import Link from "next/link";
import { BookOpen, PlusCircle } from "lucide-react";

export function EmptySetState({ setId, setTitle }: { setId: string; setTitle: string; }) {
    return (
        <section className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/70 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-lg p-12">
                <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-4">{setTitle}</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2 mb-8">Ten zestaw nie ma jeszcze żadnych kart.</p>

                {/* --- THIS IS THE FIX --- */}
                {/* Use backticks (`) instead of single quotes (') for the href */}
                <Link
                    href={`/dashboard/fiszki/${setId}`}
                    className="inline-flex items-center gap-3 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Dodaj fiszki do zestawu</span>
                </Link>
            </div>
        </section>
    );
}