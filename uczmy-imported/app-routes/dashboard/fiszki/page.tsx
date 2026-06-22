'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Import types and components
import { IFlashcardSet, SortByType } from '@/components/fiszki/types';
import { SelectionActionBar } from '@/components/fiszki/SelectionActionBar';
import { FlashcardsToolbar } from '@/components/fiszki/FlashcardsToolbar';
import { FlashcardSetCard } from '@/components/fiszki/FlashcardSetCard';
import { EmptyState } from '@/components/fiszki/EmptyState';

export default function FlashcardsPage() {
    const router = useRouter();

    const [sets, setSets] = useState<IFlashcardSet[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingSetId, setDeletingSetId] = useState<string | null>(null);
    const [updatingVisibilitySetId, setUpdatingVisibilitySetId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('newest');
    const [isSelectModeActive, setIsSelectModeActive] = useState(false);
    const [selectedSetIds, setSelectedSetIds] = useState<string[]>([]);
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    useEffect(() => {
        const fetchSets = async () => {
            setIsDataLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/flashcard-sets');
                if (!res.ok) throw new Error('Nie udało się pobrać zestawów fiszek.');
                const data = await res.json();
                setSets(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsDataLoading(false);
            }
        };
        fetchSets();
    }, []);

    const filteredAndSortedSets = useMemo(() => {
        return sets
            .filter(set =>
                set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (set.category && set.category.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [sets, searchTerm, sortBy]);

    const selectedInViewCount = useMemo(() => {
        const visibleIds = new Set(filteredAndSortedSets.map(s => s._id));
        return selectedSetIds.filter(id => visibleIds.has(id)).length;
    }, [selectedSetIds, filteredAndSortedSets]);

    const areAllSelected = filteredAndSortedSets.length > 0 && selectedInViewCount === filteredAndSortedSets.length;
    const isIndeterminate = selectedInViewCount > 0 && !areAllSelected;

    const handleCreateEmptySet = async (title: string) => {
        setIsCreating(true);
        try {
            const res = await fetch('/api/flashcard-sets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim() || "Nowy zestaw fiszek",
                    isPublic: false
                }),
            });
            if (!res.ok) throw new Error('Nie udało się utworzyć zestawu.');
            const newSet = await res.json();
            setSets(prevSets => [newSet, ...prevSets]);
            router.push(`/dashboard/fiszki/edit/${newSet._id}`);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleGenerateSet = async (data: { title: string; topic: string; numberOfCards: number }) => {
        setIsCreating(true);
        try {
            const res = await fetch('/api/flashcard-sets/generate-with-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, isPublic: false }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Nie udało się wygenerować zestawu.');
            }
            const newSet = await res.json();
            setSets(prevSets => [newSet, ...prevSets]);
            router.push(`/dashboard/fiszki/learn/${newSet._id}`);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleToggleSelection = (setId: string) => {
        setSelectedSetIds((prev) =>
            prev.includes(setId) ? prev.filter((id) => id !== setId) : [...prev, setId]
        );
        if (!isSelectModeActive) setIsSelectModeActive(true);
    };

    const handleToggleSelectAll = () => {
        const visibleIds = filteredAndSortedSets.map(set => set._id);
        if (areAllSelected) {
            setSelectedSetIds(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            setSelectedSetIds(prev => [...new Set([...prev, ...visibleIds])]);
        }
    };

    const handleCancelSelectionMode = () => {
        setIsSelectModeActive(false);
        setSelectedSetIds([]);
    };

    const handleDeleteSet = async (setId: string) => {
        if (!window.confirm('Czy na pewno chcesz usunąć ten zestaw? Tej akcji nie można cofnąć.')) return;
        setDeletingSetId(setId);
        try {
            const res = await fetch(`/api/flashcard-sets/${setId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Nie udało się usunąć zestawu.');
            setSets(prevSets => prevSets.filter(set => set._id !== setId));
        } catch (err: any) {
            alert(`Błąd: ${err.message}`);
        } finally {
            setDeletingSetId(null);
        }
    };

    const handleToggleVisibility = async (setId: string, currentStatus: boolean) => {
        setUpdatingVisibilitySetId(setId);
        try {
            const res = await fetch(`/api/flashcard-sets/${setId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublic: !currentStatus }),
            });
            if (!res.ok) throw new Error('Nie udało się zaktualizować statusu.');
            const { updatedSet } = await res.json();
            setSets(prevSets =>
                prevSets.map(set => (set._id === setId ? { ...set, isPublic: updatedSet.isPublic } : set))
            );
        } catch (err: any) {
            alert(`Błąd: ${err.message}`);
        } finally {
            setUpdatingVisibilitySetId(null);
        }
    };

    const performBulkAction = async (action: 'delete' | 'makePublic' | 'makePrivate') => {
        const idsToProcess = [...selectedSetIds];
        if (idsToProcess.length === 0) return;

        const confirmMessage = action === 'delete'
            ? `Czy na pewno chcesz usunąć ${idsToProcess.length} zaznaczonych zestawów? Tej akcji nie można cofnąć.`
            : `Czy na pewno chcesz zaktualizować ${idsToProcess.length} zaznaczonych zestawów?`;

        if (!window.confirm(confirmMessage)) return;

        setIsBulkActionLoading(true);
        const originalSets = [...sets];

        if (action === 'delete') {
            setSets(prev => prev.filter(set => !idsToProcess.includes(set._id)));
        } else {
            const isPublic = action === 'makePublic';
            setSets(prev => prev.map(set => idsToProcess.includes(set._id) ? { ...set, isPublic } : set));
        }

        try {
            const endpoint = '/api/flashcard-sets';
            let res;
            if (action === 'delete') {
                res = await fetch(endpoint, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: idsToProcess }),
                });
            } else {
                res = await fetch(endpoint, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: idsToProcess, isPublic: action === 'makePublic' }),
                });
            }
            if (!res.ok) throw new Error('Operacja zbiorcza nie powiodła się.');
        } catch (err: any) {
            alert(`Błąd: ${err.message}`);
            setSets(originalSets);
        } finally {
            setIsBulkActionLoading(false);
            handleCancelSelectionMode();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
            {/* Pasek narzędzi - stała wysokość, poza obszarem przewijania */}
            <div className="p-6 md:p-8 pb-4">
                {isSelectModeActive ? (
                    <SelectionActionBar
                        selectedCount={selectedSetIds.length}
                        totalCount={filteredAndSortedSets.length}
                        areAllSelected={areAllSelected}
                        isIndeterminate={isIndeterminate}
                        isActionLoading={isBulkActionLoading}
                        onCancel={handleCancelSelectionMode}
                        onToggleSelectAll={handleToggleSelectAll}
                        onMakePublic={() => performBulkAction('makePublic')}
                        onMakePrivate={() => performBulkAction('makePrivate')}
                        onDelete={() => performBulkAction('delete')}
                    />
                ) : (
                    <FlashcardsToolbar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        onCreateEmpty={handleCreateEmptySet}
                        onGenerate={handleGenerateSet}
                        isCreating={isCreating}
                        onEnableSelectMode={() => setIsSelectModeActive(true)}
                        hasSets={sets.length > 0}
                    />
                )}
            </div>

            {/* Główny kontener na treść - elastyczny i przewijalny */}
            <div
                className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-slate-100 dark:scrollbar-track-slate-800"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {isDataLoading ? (
                    <div className="flex w-full h-full items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>
                ) : error ? (
                    <div className="flex w-full h-full items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-6 rounded-2xl"><p>{error}</p></div>
                ) : filteredAndSortedSets.length === 0 ? (
                    <EmptyState isFiltered={searchTerm.length > 0 || sets.length > 0} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {filteredAndSortedSets.map(set => (
                            <FlashcardSetCard
                                key={set._id}
                                set={set}
                                onDelete={handleDeleteSet}
                                isDeleting={deletingSetId === set._id}
                                onToggleVisibility={handleToggleVisibility}
                                isUpdatingVisibility={updatingVisibilitySetId === set._id}
                                isSelected={selectedSetIds.includes(set._id)}
                                isSelectModeActive={isSelectModeActive}
                                onToggleSelection={handleToggleSelection}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );


}