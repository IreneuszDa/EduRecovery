'use client';

import { Globe, Lock, Trash2, X, Loader2 } from 'lucide-react';
import { SelectionCheckbox } from './SelectionCheckbox';

// --- TYPE DEFINITIONS ---
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

type ButtonVariant = 'default' | 'danger';

interface ActionButtonProps {
    onClick: () => void;
    disabled: boolean;
    icon: React.ReactNode;
    label: string;
    variant?: ButtonVariant; // Use the specific type, make it optional
}

// --- HELPER COMPONENT ---
const ActionButton = ({
    onClick,
    disabled,
    icon,
    label,
    variant = 'default' // Default value is still 'default'
}: ActionButtonProps) => {
    // We define the type for colorClasses to be more explicit
    const colorClasses: Record<ButtonVariant, string> = {
        default: 'text-blue-900 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-700',
        danger: 'text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10'
    };
    const selectedColor = colorClasses[variant]; // This is now type-safe

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 text-sm font-semibold p-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${selectedColor}`}
            aria-label={label}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
};


// --- MAIN COMPONENT ---
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
        <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-slate-200 rounded-2xl p-2.5 border border-blue-200/80 dark:border-slate-700 animate-in fade-in-0 shadow-sm">
            {/* Left side: Cancel, Checkbox, and Count */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onCancel}
                    className="p-2.5 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Anuluj tryb wyboru"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <SelectionCheckbox
                        checked={areAllSelected}
                        isIndeterminate={isIndeterminate}
                        onChange={onToggleSelectAll}
                        aria-label={areAllSelected ? "Odznacz wszystkie widoczne" : "Zaznacz wszystkie widoczne"}
                    />
                    <span className="font-semibold text-sm whitespace-nowrap">
                        {selectedCount} / {totalCount}
                    </span>
                </div>
            </div>

            {/* Right side: Action Buttons */}
            <div className="flex-grow flex items-center justify-end gap-1">
                {isActionLoading ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Przetwarzanie...</span>
                    </div>
                ) : (
                    <>
                        <ActionButton
                            onClick={onMakePublic}
                            disabled={!isAnySelected}
                            icon={<Globe className="w-4 h-4" />}
                            label="Upublicznij"
                        />
                        <ActionButton
                            onClick={onMakePrivate}
                            disabled={!isAnySelected}
                            icon={<Lock className="w-4 h-4" />}
                            label="Ustaw jako prywatne"
                        />
                        <div className="h-6 w-px bg-blue-200 dark:bg-slate-600 mx-1"></div>
                        <ActionButton
                            onClick={onDelete}
                            disabled={!isAnySelected}
                            icon={<Trash2 className="w-4 h-4" />}
                            label="Usuń zaznaczone"
                            variant="danger"
                        />
                    </>
                )}
            </div>
        </div>
    );
}