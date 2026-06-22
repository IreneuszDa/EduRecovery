// components/learn/ErrorState.tsx
"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ErrorState({ error }: { error: string }) {
    return (
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/70 dark:border-slate-700 p-4 flex flex-col justify-center items-center text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-500 mb-4">Błąd: {error}</h2>
            <Link href="/dashboard/fiszki" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Wróć do listy zestawów</span>
            </Link>
        </div>
    );
}