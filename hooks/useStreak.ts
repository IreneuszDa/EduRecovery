// hooks/useStreak.ts
import { useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react";

export const useStreak = () => {
    const [streakCount, setStreakCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session, status } = useSession();

    const fetchAndUpdateStreak = useCallback(async () => {
        if (status !== 'authenticated') {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/user/update-streak', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setStreakCount(data.streakCount || 0);
            setError(null);
        } catch (e) {
            console.error("Failed to fetch or update streak:", e);
            setError('Nie udało się załadować passy.');
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchAndUpdateStreak();
    }, [fetchAndUpdateStreak]);

    return { streakCount, isLoading, error, refetch: fetchAndUpdateStreak };
};