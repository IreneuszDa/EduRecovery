// @/components/drive/FileViewerModal.tsx

import { X } from 'lucide-react';
import { DriveFile } from '@/lib/drive';

type FileViewerModalProps = {
    file: DriveFile;
    onClose: () => void;
};

export const FileViewerModal = ({ file, onClose }: FileViewerModalProps) => {
    // Generates a URL suitable for embedding in an iframe
    const embedUrl = file.webViewLink.replace('/view', '/preview').replace('/edit', '/preview');

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-3.5 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80">
                    <div className="flex items-center gap-3 min-w-0">
                        <img src={file.iconLink} alt="" className="w-7 h-7 flex-shrink-0" />
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">{file.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
                        aria-label="Close preview"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </header>
                <div className="flex-1 bg-gray-200 dark:bg-slate-700">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        title={file.name}
                        // Sandbox for security, allows scripts and same-origin for Google's viewer to function
                        sandbox="allow-scripts allow-same-origin allow-popups"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};