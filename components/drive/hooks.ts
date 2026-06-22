import { useState, useEffect, useCallback } from 'react';
import { DriveFile, DriveFolder } from '@/lib/drive';

// --- MODIFIED HOOK ---
// This hook now gracefully handles authorization errors and resets state on disconnection.
export const useGoogleDriveFolders = () => {
    const [folders, setFolders] = useState<DriveFolder[]>([]);
    const [driveEmail, setDriveEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch('/api/drive/folders');

                if (response.ok) {
                    const data = await response.json();
                    setFolders(data.folders);
                    setDriveEmail(data.driveEmail);
                } else if (response.status === 401) {
                    // Reset state on disconnection to show the "Connect" widget
                    setFolders([]);
                    setDriveEmail(null);
                } else {
                    // For other unexpected errors (e.g., 500), log and reset state
                    console.error("Failed to fetch folders due to a server error:", response);
                    setFolders([]);
                    setDriveEmail(null);
                }
            } catch (err) {
                // Catch network failures or other exceptions during the fetch
                console.error("An error occurred while trying to fetch folders:", err);
                setFolders([]);
                setDriveEmail(null);
            }
        };
        fetchFolders();
    }, []);

    return { folders, driveEmail };
};

export const useGoogleDriveFiles = (folderIds: string[]) => {
    const [files, setFiles] = useState<DriveFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDriveFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const url = new URL('/api/drive/files', window.location.origin);
            if (folderIds.length > 0) {
                url.searchParams.set('folderIds', folderIds.join(','));
            }

            const response = await fetch(url.toString());

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
                throw new Error(errorData.error || 'Failed to fetch files');
            }
            setFiles(await response.json());
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [folderIds]);

    useEffect(() => {
        fetchDriveFiles();
    }, [fetchDriveFiles]);

    return { files, isLoading, error, retry: fetchDriveFiles };
};

// This hook manages the state and logic for the disconnect feature.
export const useDisconnectDrive = (onDisconnect?: () => void) => {
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [disconnectError, setDisconnectError] = useState<string | null>(null);

    const disconnect = async () => {
        if (!window.confirm("Are you sure you want to disconnect your Google Drive account?")) {
            return;
        }

        setIsDisconnecting(true);
        setDisconnectError(null);

        try {
            const response = await fetch('/api/drive/disconnect', {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to disconnect account.");
            }

            // Call the onDisconnect callback to trigger UI updates
            if (onDisconnect) {
                onDisconnect();
            } else {
                // Fallback to page reload if no callback is provided
                window.location.reload();
            }

        } catch (err: any) {
            setDisconnectError(err.message);
            setIsDisconnecting(false);
        }
    };

    return { disconnect, isDisconnecting, disconnectError };
};