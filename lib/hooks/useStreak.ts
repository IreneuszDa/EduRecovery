// @/lib/hooks/useStreak.ts
// Hook for managing user streak data

import { useState, useEffect } from 'react';

export function useStreak() {
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would fetch from API
        // For now we simulate fetching
        const fetchStreak = () => {
            // Simulate network delay
            setTimeout(() => {
                setStreak(7); // Mock streak
                setLoading(false);
            }, 500);
        };

        fetchStreak();
    }, []);

    // Helper to get current day index (0-6, 0 is Sunday in JS, but we might want 0=Monday)
    // Polish days: Pn (0), Wt (1), Śr (2), Cz (3), Pt (4), Sb (5), Nd (6)
    const getCurrentDayIndex = () => {
        const day = new Date().getDay(); // 0 = Sunday, 1 = Monday...
        // Convert to 0=Mon, 6=Sun
        return day === 0 ? 6 : day - 1;
    };

    return {
        streak,
        loading,
        currentDayIndex: getCurrentDayIndex()
    };
}
