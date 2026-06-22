"use client";

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type ProfileErrorProps = {
    error: string;
    onRetry: () => Promise<void>;
};

const ProfileError = ({ error, onRetry }: ProfileErrorProps) => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        setIsRetrying(true);
        await onRetry();
        // The parent component will handle unmounting this on success
        // but we'll set a timeout to reset the state in case of another failure.
        setTimeout(() => setIsRetrying(false), 1000);
    };

    return (
        <main className="flex-1 flex flex-col items-center justify-center bg-neutral-50 p-6 rounded-2xl">
            <div className="text-center bg-white p-10 rounded-2xl border border-neutral-200 shadow-sm max-w-md">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-5" />
                <h3 className="text-xl font-semibold text-neutral-800">Oops! Something went wrong.</h3>
                <p className="text-neutral-500 mt-2 mb-6">{error}</p>
                <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isRetrying ? (
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        <RefreshCw className="w-5 h-5 mr-2" />
                    )}
                    Try Again
                </button>
            </div>
        </main>
    );
};

export default ProfileError;