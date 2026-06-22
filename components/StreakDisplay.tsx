"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

// A helper function for correct Polish grammar for "day"
const getDayString = (days: number): string => {
    if (days === 1) return 'dzień';
    // For numbers ending in 2, 3, 4 (but not 12, 13, 14), it's 'dni'.
    // This simplified version works for most cases.
    return 'dni';
};

export const StreakDisplay = () => {
    const [streak, setStreak] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const updateAndFetchStreak = async () => {
            // Only set initial loading state
            if (streak === null) {
                setIsLoading(true);
            }
            try {
                // This POST request also handles the logic of updating the streak on the backend
                const response = await fetch('/api/user/update-streak', {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error('Failed to update streak');
                }

                const data = await response.json();
                setStreak(data.streakCount);

            } catch (error) {
                console.error("Streak Display Error:", error);
                // Set to 0 on error so it gracefully hides
                setStreak(0);
            } finally {
                setIsLoading(false);
            }
        };

        updateAndFetchStreak();
    }, []); // Empty dependency array means this runs once on component mount

    // A larger placeholder to match the new size and prevent layout shift.
    if (isLoading) {
        // --- MODIFIED: Added dark mode class for the loading placeholder ---
        return <div className="h-12 w-24 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full" />;
    }

    // Don't render anything if the streak is 0 or null after checking.
    if (streak === null || streak === 0) {
        return null;
    }

    return (
        <div
            // --- MODIFIED: Added dark mode classes for background, border, and hover states ---
            className="flex items-center space-x-2.5 h-12 px-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/90 dark:border-slate-700/70 rounded-full cursor-pointer group transition-all duration-200 hover:border-slate-300 hover:bg-white/90 dark:hover:border-slate-600 dark:hover:bg-slate-700/90"
            title={`Twoja passa: ${streak} ${getDayString(streak)}`}
        >
            {/* ICON: Using next/image for optimization */}
            <Image
                src="/icons/fire2.png"
                alt="Ikona passy"
                width={24}
                height={24}
                // Enhanced glow effect for the fire icon
                className="drop-shadow-[0_3px_6px_rgba(255,150,50,0.5)] transition-transform duration-200 group-hover:scale-110"
            />

            {/* NUMBER: Larger and bolder for better visibility */}
            {/* --- MODIFIED: Added dark mode text color --- */}
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight tabular-nums">
                {streak}
            </span>
        </div>
    );
};