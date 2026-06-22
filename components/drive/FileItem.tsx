// @/components/drive/FileItem.tsx

import { File as FileIcon, ExternalLink } from 'lucide-react';
import { DriveFile } from '@/lib/drive';

type FileItemProps = {
    file: DriveFile;
    onFileSelect: (file: DriveFile) => void;
};

export const FileItem = ({ file, onFileSelect }: FileItemProps) => {
    // Format the modification date for display
    const formattedDate = file.modifiedTime
        ? new Date(file.modifiedTime).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Date unavailable';

    return (
        <button
            onClick={() => onFileSelect(file)}
            className="group bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 hover:-translate-y-1 border border-gray-200/80 dark:border-slate-700 flex flex-col gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-blue-500"
        >
            <div className="flex items-start justify-between">
                {/* Use the file's icon link if available, otherwise show a generic icon */}
                {file.iconLink ? (
                    <img src={file.iconLink} alt={`${file.name} icon`} className="w-10 h-10 flex-shrink-0" />
                ) : (
                    <div className="w-10 h-10 flex-shrink-0 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-gray-500 dark:text-slate-400" />
                    </div>
                )}
                {/* External link to open the file in a new tab */}
                <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400"
                    aria-label="Open in new tab"
                    title="Open in new tab"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
            <div className="flex flex-col min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100 truncate" title={file.name}>
                    {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5">
                    {formattedDate}
                </p>
            </div>
        </button>
    );
};