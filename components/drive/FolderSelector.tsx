// @/components/drive/FolderSelector.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Folder, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { DriveFolder } from '@/lib/drive';

type FolderSelectorProps = {
    folders: DriveFolder[];
    selectedIds: string[];
    onSelectionChange: (id: string) => void;
};

export const FolderSelector = ({ folders, selectedIds, onSelectionChange }: FolderSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (folders.length === 0) return null;

    const buttonLabel = selectedIds.length === 0
        ? "All Folders"
        : selectedIds.length === 1
            ? folders.find(f => f.id === selectedIds[0])?.name || "Selected Folder"
            : `${selectedIds.length} folders selected`;

    return (
        <div className="relative" ref={containerRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full sm:w-auto min-w-[220px] px-4 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200 dark:hover:border-slate-500">
                <span className="truncate pr-2">{buttonLabel}</span>
                <ChevronRight className={clsx('w-5 h-5 text-gray-500 transition-transform dark:text-gray-400', isOpen && 'rotate-90')} />
            </button>
            {isOpen && (
                <div className="absolute z-10 top-full mt-2 w-full sm:w-80 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg animate-in fade-in zoom-in-95 dark:bg-slate-800/80 dark:border-slate-700">
                    <div className="p-2 max-h-80 overflow-y-auto">
                        {folders.map(folder => (
                            <label key={folder.id} className="flex items-center p-3 rounded-lg hover:bg-gray-200/60 dark:hover:bg-slate-700/60 cursor-pointer">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:bg-slate-700 dark:border-slate-500 dark:checked:bg-blue-500" checked={selectedIds.includes(folder.id)} onChange={() => onSelectionChange(folder.id)} />
                                <Folder className="w-5 h-5 mx-3 text-yellow-500 dark:text-yellow-400" />
                                <span className="text-sm font-medium text-gray-800 truncate dark:text-gray-200">{folder.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};