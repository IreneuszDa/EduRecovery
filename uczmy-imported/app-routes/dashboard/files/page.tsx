/*
// FILE: @/app/drive/GoogleDrivePage.tsx
// STATUS: MODIFIED & VERIFIED
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Cloud, Link2, X, Loader2, Compass, Search } from 'lucide-react';
import { clsx } from 'clsx';

// Import your components and hooks
import { DriveFile, DriveFolder } from '@/lib/drive';
import { useGoogleDriveFiles, useGoogleDriveFolders, useDisconnectDrive } from '@/components/drive/hooks';
import { DriveHeader } from '@/components/drive/DriveHeader';
import { FileItem } from '@/components/drive/FileItem';
import { FileViewerModal } from '@/components/drive/FileViewerModal';
import { FolderSelector } from '@/components/drive/FolderSelector';
import { SearchInput } from '@/components/drive/SearchInput';
import { FilesLoadingSkeleton } from '@/components/drive/FilesLoadingSkeleton';
import { ErrorDisplay } from '@/components/drive/ErrorDisplay';
import { EmptyState } from '@/components/drive/EmptyState';
import { button } from '@/components/drive/Button';

// NOTE: For a complete dark mode experience, ensure that child components
// (DriveHeader, FileItem, FolderSelector, etc.) also have their own dark mode styles.

// ============================================================================
// MAIN PAGE COMPONENT (RESTRUCTURED)
// ============================================================================
export default function GoogleDrivePage() {
    const { data: session, status } = useSession();
    const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingFile, setViewingFile] = useState<DriveFile | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const { files, isLoading, error, retry } = useGoogleDriveFiles(selectedFolderIds);
    const { folders, driveEmail } = useGoogleDriveFolders();
    const { disconnect, isDisconnecting, disconnectError } = useDisconnectDrive(() => {
        retry();
        setSelectedFolderIds([]);
        setSearchQuery('');
    });

    const [isScrolled, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            setIsScrolled(scrollContainer.scrollTop > 10);
        };

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredFiles = useMemo(() => {
        if (!searchQuery) return files;
        return files.filter(file =>
            file.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [files, searchQuery]);

    const handleLinkDrive = async () => {
        if (status !== 'authenticated' || !session?.user?.id) {
            alert("Musisz być zalogowany, aby połączyć swoje konto.");
            return;
        }

        if (isConnecting) return;

        setIsConnecting(true);
        try {
            window.location.href = `/api/drive/connect?userId=${session.user.id}`;
        } catch (err) {
            setIsConnecting(false);
            alert("Nie udało się rozpocząć połączenia. Spróbuj ponownie.");
            console.error("Error initiating Google Drive connection:", err);
        }
    };

    const handleFolderSelection = (folderId: string) => {
        setSelectedFolderIds(prev => prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]);
    };

    const handleClearFilters = () => {
        setSelectedFolderIds([]);
        setSearchQuery('');
    };

    const renderMainContent = () => {
        if (status === 'loading') {
            return (
                <div className="h-full flex items-center justify-center">
                    <FilesLoadingSkeleton />
                </div>
            );
        }

        if (status !== 'authenticated') {
            return (
                <div className="h-full flex items-center justify-center p-4">
                    <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-700 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Proszę, zaloguj się, aby kontynuować</h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Musisz być zalogowany, aby uzyskać dostęp do tej zawartości.</p>
                    </div>
                </div>
            );
        }

        if (disconnectError) {
            return (
                <div className="h-full flex items-center justify-center p-4">
                    <ErrorDisplay message={disconnectError} onRetry={disconnect} />
                </div>
            );
        }

        if (error === "Authorization Required") {
            return (
                <div className="h-full flex items-center justify-center p-4">
                    <section className="text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 rounded-2xl shadow-sm max-w-lg w-full">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                            <Cloud className="h-9 w-9 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-50">Połącz swój Dysk Google</h3>
                        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">Uzyskaj natychmiastowy dostęp do swoich plików, bezpiecznie łącząc swoje konto Google.</p>
                        <button onClick={handleLinkDrive} className={button({ class: 'mt-8 px-6 py-3 text-base' })} disabled={isConnecting || isDisconnecting}>
                            {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Link2 className="w-5 h-5" />}
                            <span>{isConnecting ? 'Przekierowywanie...' : 'Połącz konto Google'}</span>
                        </button>
                    </section>
                </div>
            );
        }

        if (error) {
            return <div className="h-full flex items-center justify-center p-4"><ErrorDisplay message={error} onRetry={retry} /></div>;
        }

        const hasActiveFilters = selectedFolderIds.length > 0 || searchQuery.length > 0;
        const isHeaderLoading = status === 'authenticated' && !error && driveEmail === null;

        return (
            <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
                <div
                    className={clsx(
                        'text-left transition-all duration-300 ease-in-out',
                        isScrolled
                            ? 'max-h-0 opacity-0 invisible mb-0'
                            : 'max-h-96 opacity-100 visible pt-8 sm:pt-12 mb-8'
                    )}
                >
                    <DriveHeader driveEmail={driveEmail} isLoading={isHeaderLoading} isDisconnecting={isDisconnecting} onDisconnect={disconnect} />
                </div>

                <div className="sticky top-0 z-20 transition-all duration-300 ease-in-out">
                    <div
                        className={clsx(
                            'rounded-2xl transition-all duration-300 ease-in-out',
                            isScrolled
                                ? 'bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md p-4 border-b border-slate-200/80 dark:border-slate-700/80'
                                : 'bg-transparent'
                        )}
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative flex-grow w-full sm:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                <SearchInput
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <FolderSelector folders={folders} selectedIds={selectedFolderIds} onSelectionChange={handleFolderSelection} />
                            {hasActiveFilters && (
                                <button onClick={handleClearFilters} className={button({ variant: 'secondary' })}>
                                    <X className="w-4 h-4" /> Wyczyść
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pb-12">
                    {isLoading ? (
                        <FilesLoadingSkeleton />
                    ) : filteredFiles.length === 0 ? (
                        <EmptyState isFiltering={hasActiveFilters} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredFiles.map((file) => (
                                <FileItem key={file.id} file={file} onFileSelect={setViewingFile} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {viewingFile && <FileViewerModal file={viewingFile} onClose={() => setViewingFile(null)} />}
            <section className="bg-slate-50 dark:bg-slate-900 h-full flex flex-col font-sans">
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
                    {renderMainContent()}
                </div>
            </section>
        </>
    );
}
    */