"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton"
import ProfileError from "@/components/profile/ProfileError";
import ProfileContent from "@/components/profile/ProfileContent";

// A type for the profile data we expect from our new API endpoint
export type UserProfile = {
    name: string;
    email: string;
    streakCount: number;
    lastLogin: string; // This will be an ISO date string from the server
};

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/user/profile');
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Nie udało się załadować danych profilu.');
            }
            const data = await res.json();
            setProfile(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Only fetch when the session is authenticated and we haven't fetched yet.
        if (status === "authenticated") {
            fetchProfile();
        }
        // If the session status is loading, we also show our loader.
        if (status === "loading") {
            setIsLoading(true);
        }
    }, [status, fetchProfile]);

    if (isLoading || status === 'loading') {
        return <ProfileSkeleton />;
    }

    if (error || !profile) {
        return <ProfileError error={error || "Nie można było załadować profilu."} onRetry={fetchProfile} />;
    }

    return <ProfileContent profile={profile} />;
};

export default ProfilePage;