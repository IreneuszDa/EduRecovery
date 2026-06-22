"use client";

import React from "react";
import { clsx } from "clsx";
import { X, Globe, Lock, Trash2, Check, Minus } from "lucide-react";

// --- Custom Checkbox Component (with dark mode) ---
interface SelectionCheckboxProps {
    checked: boolean;
    onChange: () => void;
    isIndeterminate?: boolean;
    'aria-label': string;
}
function SelectionCheckbox({ checked, onChange, isIndeterminate = false, 'aria-label': ariaLabel }: SelectionCheckboxProps) {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={isIndeterminate ? 'mixed' : checked}
            onClick={onChange}
            aria-label={ariaLabel}
            className={clsx(
                "h-6 w-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800",
                checked || isIndeterminate
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400"
            )}
        >
            {checked && <Check className="h-4 w-4" />}
            {isIndeterminate && !checked && <Minus className="h-4 w-4" />}
        </button>
    );
}


// --- SelectionActionBar Component (with dark mode) ---
interface SelectionActionBarProps {
    selectedCount: number;
    totalCount: number;
    areAllSelected: boolean;
    isIndeterminate: boolean;
    isActionLoading: boolean;
    onCancel: () => void;
    onToggleSelectAll: () => void;
    onMakePublic: () => void;
    onMakePrivate: () => void;
    onDelete: () => void;
}

export function SelectionActionBar({
    selectedCount,
    totalCount,
    areAllSelected,
    isIndeterminate,
    isActionLoading,
    onCancel,
    onToggleSelectAll,
    onMakePublic,
    onMakePrivate,
    onDelete,
}: SelectionActionBarProps) {
    const isAnySelected = selectedCount > 0;
    return (
        <div className="flex w-full items-center gap-4 bg-blue-50 dark:bg-slate-800 text-blue-800 dark:text-slate-200 rounded-lg p-2 animate-in fade-in-0 border border-blue-200 dark:border-slate-700 shadow-sm">
            <button onClick={onCancel} className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors" aria-label="Anuluj tryb wyboru">
                <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
                <SelectionCheckbox
                    checked={areAllSelected}
                    isIndeterminate={isIndeterminate}
                    onChange={onToggleSelectAll}
                    aria-label="Zaznacz wszystkie zestawy"
                />
                <span className="font-semibold text-sm whitespace-nowrap">{selectedCount} / {totalCount} zaznaczono</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <button onClick={onMakePublic} disabled={isActionLoading || !isAnySelected} className="flex items-center gap-2 text-sm font-semibold p-2 rounded-md hover:bg-blue-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <Globe className="w-4 h-4" /> Publiczne
                </button>
                <button onClick={onMakePrivate} disabled={isActionLoading || !isAnySelected} className="flex items-center gap-2 text-sm font-semibold p-2 rounded-md hover:bg-blue-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <Lock className="w-4 h-4" /> Prywatne
                </button>
                <div className="h-6 w-px bg-blue-200 dark:bg-slate-600 mx-1"></div>
                <button onClick={onDelete} disabled={isActionLoading || !isAnySelected} className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-500 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <Trash2 className="w-4 h-4" /> Usuń
                </button>
            </div>
        </div>
    );
}