'use client';

import { HardDrive, LogOut } from 'lucide-react';

// The component accepts updated props to handle dynamic information and disconnection.
interface DriveHeaderProps {
    driveEmail: string | null;
    isLoading: boolean;
    isDisconnecting: boolean;
    onDisconnect: () => void;
}

export const DriveHeader = ({ driveEmail, isLoading, isDisconnecting, onDisconnect }: DriveHeaderProps) => {
    return (
        <header className="mb-8 pb-6 border-b border-gray-200/90 dark:border-slate-700/90">
            <div className="flex items-center justify-between">
                {/* Left side: Icon and Title */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
                        <HardDrive className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight">Mój Dysk</p>
                        <p className="text-base text-gray-600 dark:text-slate-400 mt-1">Przeglądaj i wyszukuj pliki ze swojego konta Google.</p>
                    </div>
                </div>

                {/* Right side: Disconnect Button and User Info */}
                <div className="text-right">
                    {isLoading ? (
                        // Skeleton loader while fetching the email
                        <div className="h-5 w-48 bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
                    ) : driveEmail ? (
                        <>
                            <div className="flex items-center space-x-3">
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    Połączono jako: <span className="font-semibold text-gray-800 dark:text-slate-200">{driveEmail}</span>
                                </p>
                                <button
                                    onClick={onDisconnect}
                                    disabled={isDisconnecting}
                                    className="px-3 py-2 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md text-sm font-semibold flex items-center disabled:opacity-50 disabled:cursor-wait"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    {isDisconnecting ? 'Odłączanie...' : 'Odłącz'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-slate-500">Konto nie jest połączone.</p>
                    )}
                </div>
            </div>
        </header>
    );
};