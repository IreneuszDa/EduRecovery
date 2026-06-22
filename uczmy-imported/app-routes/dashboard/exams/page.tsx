'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

import { Exam, SortByType } from '@/components/exams/shared';
// REMOVED: No longer need the old AI modal
// import { GenerateExamAiModal } from '@/components/exams/GenerateExamAiModal';
import { SelectionActionBar } from '@/components/exams/SelectionActionBar';
import { ExamsToolbar } from '@/components/exams/ExamsToolbar';
import { EmptyState } from '@/components/exams/EmptyState';
import { ExamCard } from '@/components/exams/ExamCard';

export default function ExamsDashboardPage() {
    const { data: session, status } = useSession();
    const [exams, setExams] = useState<Exam[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('newest');
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingVisibilityId, setUpdatingVisibilityId] = useState<string | null>(null);
    const router = useRouter();

    const [isSelectModeActive, setIsSelectModeActive] = useState(false);
    const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    // REMOVED: State for the old modal is no longer needed
    // const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchExams = async () => {
                setIsDataLoading(true);
                setError(null);
                try {
                    const res = await fetch(`/api/exams`);
                    if (!res.ok) throw new Error('Nie udało się pobrać egzaminów.');
                    const data = await res.json();
                    setExams(data.exams || []);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsDataLoading(false);
                }
            };
            fetchExams();
        } else if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    const filteredAndSortedExams = useMemo(() => {
        return exams
            .filter(exam =>
                exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (exam.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [exams, searchTerm, sortBy]);

    const selectedInViewCount = useMemo(() => {
        const visibleIds = new Set(filteredAndSortedExams.map(s => s._id));
        return selectedExamIds.filter(id => visibleIds.has(id)).length;
    }, [selectedExamIds, filteredAndSortedExams]);

    const areAllSelected = filteredAndSortedExams.length > 0 && selectedInViewCount === filteredAndSortedExams.length;
    const isIndeterminate = selectedInViewCount > 0 && !areAllSelected;

    const handleToggleSelection = (examId: string) => {
        setSelectedExamIds((prev) =>
            prev.includes(examId) ? prev.filter((id) => id !== examId) : [...prev, examId]
        );
        if (!isSelectModeActive) {
            setIsSelectModeActive(true);
        }
    };

    const handleToggleSelectAll = () => {
        const visibleIds = new Set(filteredAndSortedExams.map(exam => exam._id));
        const currentSelection = new Set(selectedExamIds);

        if (areAllSelected) {
            visibleIds.forEach(id => currentSelection.delete(id));
        } else {
            visibleIds.forEach(id => currentSelection.add(id));
        }
        setSelectedExamIds(Array.from(currentSelection));
    };

    const handleCancelSelectionMode = () => {
        setIsSelectModeActive(false);
        setSelectedExamIds([]);
    };

    const handleCreateEmptyExam = async (title: string) => {
        setIsCreating(true);
        try {
            // This logic is fine, it creates an empty exam and navigates to the edit page.
            const createRes = await fetch('/api/exams', {
                method: 'POST'
            });
            if (!createRes.ok) throw new Error('Nie udało się utworzyć egzaminu.');
            const { exam: newExam } = await createRes.json();

            const updateRes = await fetch(`/api/exams/${newExam._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title }),
            });
            if (!updateRes.ok) throw new Error('Nie udało się zaktualizować tytułu.');
            const { exam: finalExam } = await updateRes.json();

            setExams(prevExams => [finalExam, ...prevExams.filter(e => e._id !== newExam._id)]);
            router.push(`/dashboard/exams/edit/${finalExam._id}`);
        } catch (err: any) {
            setError(err.message);
            alert(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    // UPDATED: This function's signature already matches what the new popover provides.
    // It will now be called directly from the toolbar.
    const handleGenerateExamWithAI = async ({ title, topic, numberOfQuestions }: { title: string; topic: string; numberOfQuestions: number }) => {
        setIsCreating(true);
        let newExamId: string | null = null;
        try {
            const formData = new FormData();
            // This prompt construction is good for your API route.
            const prompt = `Utwórz egzamin w języku polskim. Tytuł: "${title}". Temat: "${topic}". Wygeneruj dokładnie ${numberOfQuestions} różnorodnych pytań (wielokrotnego wyboru, prawda/fałsz, otwarte).`;
            formData.append('prompt', prompt);
            formData.append('existingQuestions', '[]'); // Still useful to include

            const generateRes = await fetch('/api/exams/generate', { method: 'POST', body: formData });
            if (!generateRes.ok) {
                const errorData = await generateRes.json();
                throw new Error(errorData.message || 'Nie udało się wygenerować pytań AI.');
            }
            const generatedExam = await generateRes.json();

            // The rest of your logic for creating/updating the exam is solid.
            const createRes = await fetch('/api/exams', { method: 'POST' });
            if (!createRes.ok) throw new Error('Nie udało się utworzyć szablonu egzaminu.');
            const { exam: newExamShell } = await createRes.json();
            newExamId = newExamShell._id;

            const updatePayload = {
                title: generatedExam.title || title,
                subject: generatedExam.subject || topic,
                questions: generatedExam.questions
            };

            const updateRes = await fetch(`/api/exams/${newExamId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });
            if (!updateRes.ok) throw new Error('Nie udało się zapisać wygenerowanych pytań.');
            const { exam: finalExam } = await updateRes.json();

            setExams(prevExams => [finalExam, ...prevExams.filter(e => e._id !== newExamId)]);

            // REMOVED: The line to close the modal is no longer necessary
            // setIsAiModalOpen(false); 

            router.push(`/dashboard/exams/edit/${finalExam._id}`);
        } catch (err: any) {
            setError(err.message);
            alert(`Wystąpił błąd: ${err.message}`);
            if (newExamId) {
                // Good practice to clean up failed attempts
                await fetch(`/api/exams/${newExamId}`, { method: 'DELETE' });
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteExam = async (examId: string) => {
        // ... (this function is unchanged)
        if (!window.confirm('Czy na pewno chcesz usunąć ten egzamin? Tej akcji nie można cofnąć.')) return;
        setDeletingId(examId);
        try {
            const res = await fetch(`/api/exams/${examId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Nie udało się usunąć egzaminu.');
            setExams(prevExams => prevExams.filter(exam => exam._id !== examId));
        } catch (err: any) {
            setError(err.message);
            alert(`Błąd: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleVisibility = async (examId: string, currentStatus: boolean) => {
        // ... (this function is unchanged)
        setUpdatingVisibilityId(examId);
        try {
            const res = await fetch(`/api/exams/${examId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublic: !currentStatus }),
            });
            if (!res.ok) throw new Error('Nie udało się zaktualizować statusu.');
            const { exam: updatedExam } = await res.json();
            setExams(prevExams =>
                prevExams.map(exam => (exam._id === examId ? { ...exam, isPublic: updatedExam.isPublic } : exam))
            );
        } catch (err: any) {
            setError(err.message);
            alert(`Błąd: ${err.message}`);
        } finally {
            setUpdatingVisibilityId(null);
        }
    };

    const handleBulkDeleteExams = async (idsToDelete: string[]) => {
        // ... (this function is unchanged)
        if (!window.confirm(`Czy na pewno chcesz usunąć ${idsToDelete.length} zaznaczonych egzaminów? Tej akcji nie można cofnąć.`)) return;
        setIsBulkActionLoading(true);
        const originalExams = [...exams];
        setExams((prev) => prev.filter((exam) => !idsToDelete.includes(exam._id)));
        setSelectedExamIds([]);
        try {
            const res = await fetch(`/api/exams`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: idsToDelete })
            });
            if (!res.ok) throw new Error("Nie udało się usunąć wybranych egzaminów.");
        } catch (err: any) {
            alert(`Błąd: ${err.message}`);
            setExams(originalExams);
        } finally {
            setIsBulkActionLoading(false);
            setIsSelectModeActive(false);
        }
    };

    const handleBulkToggleVisibility = async (makePublic: boolean, idsToUpdate: string[]) => {
        // ... (this function is unchanged)
        setIsBulkActionLoading(true);
        const originalExams = [...exams];
        setExams(currentExams =>
            currentExams.map(exam =>
                idsToUpdate.includes(exam._id) ? { ...exam, isPublic: makePublic } : exam
            )
        );
        try {
            const res = await fetch(`/api/exams`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: idsToUpdate, isPublic: makePublic }),
            });
            if (!res.ok) throw new Error(`Nie udało się zaktualizować egzaminów.`);
        } catch (error: any) {
            alert(`Błąd: ${error.message}`);
            setExams(originalExams);
        } finally {
            setIsBulkActionLoading(false);
            handleCancelSelectionMode();
        }
    };

    if (status === 'loading' || (status === 'authenticated' && isDataLoading)) {
        return <section className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></section>;
    }
    if (error) {
        return <section className="flex-1 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-6 rounded-2xl"><p>{error}</p></section>;
    }

    return (
        <section className="bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-8 flex flex-col h-full">
            {/* REMOVED: The modal component is no longer rendered here */}
            <div className="mb-6">
                {isSelectModeActive ? (
                    <SelectionActionBar
                        selectedCount={selectedExamIds.length}
                        totalCount={filteredAndSortedExams.length}
                        areAllSelected={areAllSelected}
                        isIndeterminate={isIndeterminate}
                        isActionLoading={isBulkActionLoading}
                        onCancel={handleCancelSelectionMode}
                        onToggleSelectAll={handleToggleSelectAll}
                        onMakePublic={() => handleBulkToggleVisibility(true, selectedExamIds)}
                        onMakePrivate={() => handleBulkToggleVisibility(false, selectedExamIds)}
                        onDelete={() => handleBulkDeleteExams(selectedExamIds)}
                    />
                ) : (
                    // UPDATED: The toolbar now receives the correct props
                    <ExamsToolbar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        onCreateEmpty={handleCreateEmptyExam}
                        onGenerate={handleGenerateExamWithAI} // FIX: Pass the correct handler
                        isCreating={isCreating}
                        onEnableSelectMode={() => setIsSelectModeActive(true)}
                        hasExams={exams.length > 0}
                    />
                )}
            </div>
            <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                {filteredAndSortedExams.length === 0 ? (
                    <EmptyState isFiltered={searchTerm.length > 0 || exams.length > 0} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedExams.map(exam => (
                            <ExamCard
                                key={exam._id}
                                exam={exam}
                                onDelete={handleDeleteExam}
                                isDeleting={deletingId === exam._id}
                                onToggleVisibility={handleToggleVisibility}
                                isUpdatingVisibility={updatingVisibilityId === exam._id}
                                isSelected={selectedExamIds.includes(exam._id)}
                                isSelectModeActive={isSelectModeActive}
                                onToggleSelection={handleToggleSelection}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}