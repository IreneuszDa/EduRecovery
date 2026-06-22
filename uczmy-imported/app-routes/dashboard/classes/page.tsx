/*'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    DocumentTextIcon, TrashIcon, BookOpenIcon, CalculatorIcon, CodeBracketIcon,
    EllipsisVerticalIcon, UsersIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon,
    ArrowLeftOnRectangleIcon, UserPlusIcon
} from '@heroicons/react/24/outline';
import { AcademicCapIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { Loader2, Search, PlusCircle, ArrowUpDown, Rows3, X, Trash2, Check, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import React from 'react';

// ============================================================================
// TYPE DEFINITIONS & HELPERS
// ============================================================================
interface Class {
    _id: string;
    name: string;
    subject: string;
    createdAt: string;
    studentCount: number;
    joinCode: string;
    teacherName?: string; // Add teacher name for student view
}

type SortByType = 'newest' | 'oldest';

const getSubjectIcon = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('matematyka')) return <CalculatorIcon className="h-7 w-7 text-blue-600" />;
    if (s.includes('historia')) return <BookOpenIcon className="h-7 w-7 text-amber-600" />;
    if (s.includes('informatyka') || s.includes('programowanie')) return <CodeBracketIcon className="h-7 w-7 text-teal-600" />;
    return <DocumentTextIcon className="h-7 w-7 text-slate-500" />;
};

// ============================================================================
// TEACHER-SPECIFIC COMPONENTS
// ============================================================================

// --- Selection Checkbox & Action Bar (Teacher Only) ---
interface SelectionCheckboxProps {
    checked: boolean; onChange: () => void; isIndeterminate?: boolean; 'aria-label': string;
}
function SelectionCheckbox({ checked, onChange, isIndeterminate = false, 'aria-label': ariaLabel }: SelectionCheckboxProps) {
    return (
        <button type="button" role="checkbox" aria-checked={isIndeterminate ? 'mixed' : checked} onClick={onChange} aria-label={ariaLabel}
            className={clsx("h-6 w-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2", checked || isIndeterminate ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 hover:border-blue-500")}>
            {checked && <Check className="h-4 w-4" />}
            {isIndeterminate && !checked && <Minus className="h-4 w-4" />}
        </button>
    );
}

interface SelectionActionBarProps {
    selectedCount: number; totalCount: number; areAllSelected: boolean; isIndeterminate: boolean;
    isActionLoading: boolean; onCancel: () => void; onToggleSelectAll: () => void; onDelete: () => void;
}
function SelectionActionBar({ selectedCount, totalCount, areAllSelected, isIndeterminate, isActionLoading, onCancel, onToggleSelectAll, onDelete }: SelectionActionBarProps) {
    const isAnySelected = selectedCount > 0;
    return (
        <div className="flex w-full items-center gap-4 bg-blue-50 text-blue-900 rounded-2xl p-3 border border-blue-200/80 animate-in fade-in-0 shadow-sm">
            <button onClick={onCancel} className="p-2 rounded-md hover:bg-blue-100 transition-colors" aria-label="Anuluj tryb wyboru"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-3">
                <SelectionCheckbox checked={areAllSelected} isIndeterminate={isIndeterminate} onChange={onToggleSelectAll} aria-label="Zaznacz wszystkie klasy" />
                <span className="font-semibold text-sm whitespace-nowrap">{selectedCount} / {totalCount} zaznaczono</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <button onClick={onDelete} disabled={isActionLoading || !isAnySelected}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 p-2 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Usuń
                </button>
            </div>
        </div>
    );
}

// --- Teacher Class Card ---
function TeacherClassCard({ classItem, onDelete, isDeleting, isSelected, isSelectModeActive, onToggleSelection }: {
    classItem: Class; onDelete: (id: string) => void; isDeleting: boolean; isSelected: boolean;
    isSelectModeActive: boolean; onToggleSelection: (id: string) => void;
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) { setIsMenuOpen(false); } };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        setIsMenuOpen(false);
    };

    return (
        <div className="group relative flex flex-col h-full py-2">
            <div className={clsx("absolute -inset-2 rounded-3xl bg-blue-100/60 transition-opacity duration-300", isSelectModeActive && isSelected ? "opacity-100" : "opacity-0")} />
            <div className={clsx("relative bg-white border rounded-2xl flex flex-col transition-all duration-300 ease-in-out h-full", isSelectModeActive ? "hover:border-slate-400 cursor-pointer" : "hover:shadow-lg hover:-translate-y-1.5 hover:border-blue-400", isSelected ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20" : "border-slate-200/70")} onClick={() => { if (isSelectModeActive) onToggleSelection(classItem._id); }}>
                <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 pt-1">{getSubjectIcon(classItem.subject)}</div>
                            <div>
                                <p className="inline-flex bg-blue-100 text-blue-700 font-semibold text-xs px-2.5 py-1 rounded-full mb-2">{classItem.subject}</p>
                                <h3 className="font-bold text-lg text-slate-800 leading-tight break-words">{classItem.name}</h3>
                                <div className="text-sm text-slate-500 mt-2 space-y-1">
                                    <p className="flex items-center gap-2"><UsersIcon className="h-4 w-4" /><span>{classItem.studentCount} {classItem.studentCount === 1 ? 'uczeń' : 'uczniów'}</span></p>
                                    <p className="flex items-center gap-2 font-medium text-slate-600"><span>Kod:</span><span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs tracking-wider">{classItem.joinCode}</span></p>
                                </div>
                            </div>
                        </div>
                        <div className={clsx("relative flex-shrink-0", isSelectModeActive && "pointer-events-none")} ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-slate-600"><EllipsisVerticalIcon className="h-5 w-5" /></button>
                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-4 w-52 bg-white rounded-lg shadow-xl border border-slate-200/80 z-10 py-1">
                                    <button onClick={() => handleCopyCode(classItem.joinCode)} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{isCopied ? <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-500" /> : <ClipboardDocumentIcon className="h-4 w-4" />}<span>{isCopied ? 'Skopiowano!' : 'Kopiuj kod dostępu'}</span></button>
                                    <Link href={`/dashboard/classes/edit/${classItem._id}`} className={clsx("w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100")}><PencilSquareIcon className="h-4 w-4" /><span>Edytuj</span></Link>
                                    <div className="my-1 h-px bg-slate-100"></div>
                                    <button onClick={() => { onDelete(classItem._id); setIsMenuOpen(false); }} disabled={isDeleting} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50">{isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}<span>Usuń klasę</span></button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-auto border-t border-slate-200/70 p-4">
                    <Link href={`/dashboard/classes/${classItem._id}`} className={clsx("w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600", isSelectModeActive && "pointer-events-none")}><AcademicCapIcon className="h-5 w-5" /><span>Zarządzaj klasą</span></Link>
                </div>
            </div>
        </div>
    );
}

function TeacherEmptyState({ isFiltered }: { isFiltered: boolean }) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <UsersIcon className="w-16 h-16 mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700">{isFiltered ? 'Brak pasujących klas' : 'Nie masz jeszcze żadnych klas'}</h3>
            <p className="max-w-md mt-2 text-slate-600">{isFiltered ? 'Spróbuj zmienić filtry lub wyszukiwaną frazę.' : 'Kliknij "Nowa klasa", aby rozpocząć.'}</p>
        </div>
    );
}

// --- Main Teacher Dashboard Component ---
function TeacherClassesDashboard({ classesData, setClasses, setError }: {
    classesData: Class[];
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
    setError: (msg: string | null) => void;
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortByType>('newest');
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const [isSelectModeActive, setIsSelectModeActive] = useState(false);
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    const filteredAndSortedClasses = useMemo(() => {
        return classesData
            .filter(classItem => classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) || classItem.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [classesData, searchTerm, sortBy]);

    const selectedInViewCount = useMemo(() => {
        const visibleIds = new Set(filteredAndSortedClasses.map(c => c._id));
        return selectedClassIds.filter(id => visibleIds.has(id)).length;
    }, [selectedClassIds, filteredAndSortedClasses]);

    const areAllSelected = filteredAndSortedClasses.length > 0 && selectedInViewCount === filteredAndSortedClasses.length;
    const isIndeterminate = selectedInViewCount > 0 && selectedInViewCount < filteredAndSortedClasses.length;

    const handleToggleSelection = (classId: string) => {
        setSelectedClassIds((prev) => prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]);
        if (!isSelectModeActive) { setIsSelectModeActive(true); }
    };

    const handleToggleSelectAll = () => {
        const visibleIds = new Set(filteredAndSortedClasses.map(classItem => classItem._id));
        const currentSelection = new Set(selectedClassIds);
        if (areAllSelected) { visibleIds.forEach(id => currentSelection.delete(id)); }
        else { visibleIds.forEach(id => currentSelection.add(id)); }
        setSelectedClassIds(Array.from(currentSelection));
    };

    const handleCancelSelectionMode = () => {
        setIsSelectModeActive(false);
        setSelectedClassIds([]);
    };

    const handleCreateClass = async () => {
        setIsCreating(true);
        try {
            const res = await fetch('/api/classes', { method: 'POST' });
            if (!res.ok) throw new Error('Nie udało się utworzyć klasy.');
            const { class: newClass } = await res.json();
            setClasses(prevClasses => [newClass, ...prevClasses]);
            router.push(`/dashboard/classes/edit/${newClass._id}`);
        } catch (err: any) {
            setError(err.message); alert(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteClass = async (classId: string) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tę klasę? Wszyscy uczniowie zostaną z niej usunięci, a akcji nie można cofnąć.')) return;
        setDeletingId(classId);
        try {
            const res = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Nie udało się usunąć klasy.');
            setClasses(prevClasses => prevClasses.filter(c => c._id !== classId));
        } catch (err: any) {
            setError(err.message); alert(`Błąd: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    const handleBulkDeleteClasses = async (idsToDelete: string[]) => {
        if (!window.confirm(`Czy na pewno chcesz usunąć ${idsToDelete.length} zaznaczonych klas? Tej akcji nie można cofnąć.`)) return;
        setIsBulkActionLoading(true);
        const originalClasses = [...classesData];
        setClasses((prev) => prev.filter((classItem) => !idsToDelete.includes(classItem._id)));
        setSelectedClassIds([]);
        try {
            const res = await fetch(`/api/classes`, {
                method: "DELETE", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: idsToDelete })
            });
            if (!res.ok) throw new Error("Nie udało się usunąć wybranych klas.");
        } catch (err: any) {
            alert(`Błąd: ${err.message}`);
            setClasses(originalClasses);
        } finally {
            setIsBulkActionLoading(false);
            setIsSelectModeActive(false);
        }
    };

    return (
        <>
            <div className="mb-6">
                {isSelectModeActive ? (
                    <SelectionActionBar selectedCount={selectedClassIds.length} totalCount={filteredAndSortedClasses.length} areAllSelected={areAllSelected} isIndeterminate={isIndeterminate} isActionLoading={isBulkActionLoading} onCancel={handleCancelSelectionMode} onToggleSelectAll={handleToggleSelectAll} onDelete={() => handleBulkDeleteClasses(selectedClassIds)} />
                ) : (
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-4 bg-white border border-slate-200/70 rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-800 whitespace-nowrap">Moje Klasy</h2>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-none">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input id="search-class" type="text" placeholder="Szukaj..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-48 pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-500 text-sm border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="relative">
                                <select id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value as SortByType)} className="w-full appearance-none pl-4 pr-9 py-2.5 bg-white text-slate-800 text-sm font-medium border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="newest">Najnowsze</option>
                                    <option value="oldest">Najstarsze</option>
                                </select>
                                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            {classesData.length > 0 && (<button onClick={() => setIsSelectModeActive(true)} className="p-[9px] text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Wybierz wiele"><Rows3 className="w-5 h-5" /></button>)}
                            <button onClick={handleCreateClass} disabled={isCreating} className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">
                                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}<span className="text-sm font-semibold hidden sm:inline">{isCreating ? 'Tworzenie...' : 'Nowa klasa'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                {filteredAndSortedClasses.length === 0 ? (<TeacherEmptyState isFiltered={searchTerm.length > 0 || classesData.length > 0} />) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedClasses.map(classItem => (<TeacherClassCard key={classItem._id} classItem={classItem} onDelete={handleDeleteClass} isDeleting={deletingId === classItem._id} isSelected={selectedClassIds.includes(classItem._id)} isSelectModeActive={isSelectModeActive} onToggleSelection={handleToggleSelection} />))}
                    </div>
                )}
            </div>
        </>
    );
}

// ============================================================================
// STUDENT-SPECIFIC COMPONENTS
// ============================================================================

// --- Student Class Card ---
function StudentClassCard({ classItem }: { classItem: Class }) {
    return (
        <div className="bg-white border border-slate-200/70 rounded-2xl flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
            <div className="p-5 flex-1">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">{getSubjectIcon(classItem.subject)}</div>
                    <div>
                        <p className="inline-flex bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-1 rounded-full mb-2">
                            {classItem.subject}
                        </p>
                        <h3 className="font-bold text-lg text-slate-800 leading-tight break-words">
                            {classItem.name}
                        </h3>
                        {classItem.teacherName && (
                            <p className="text-sm text-slate-500 mt-2">Nauczyciel: {classItem.teacherName}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-200/70 p-4">
                <Link href={`/dashboard/classes/${classItem._id}`} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700">
                    <BookOpenIcon className="h-5 w-5" />
                    <span>Przejdź do klasy</span>
                </Link>
            </div>
        </div>
    );
}

function StudentEmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <UsersIcon className="w-16 h-16 mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700">Nie należysz do żadnej klasy</h3>
            <p className="max-w-md mt-2 text-slate-500">
                Użyj kodu od nauczyciela, aby dołączyć do swojej pierwszej klasy.
            </p>
        </div>
    );
}

// --- Main Student Dashboard Component ---
function StudentClassesDashboard({ classesData, fetchClasses, setError }: {
    classesData: Class[];
    fetchClasses: () => void;
    setError: (msg: string | null) => void;
}) {
    const [joinCode, setJoinCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [joinError, setJoinError] = useState<string | null>(null);

    const handleJoinClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinCode.trim()) {
            setJoinError("Kod nie może być pusty.");
            return;
        }
        setIsJoining(true);
        setJoinError(null);
        setError(null);
        try {
            const res = await fetch('/api/classes/student-actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'JOIN', joinCode: joinCode.trim().toUpperCase() }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Nie udało się dołączyć do klasy.');
            }
            setJoinCode('');
            fetchClasses(); // Refresh the list of classes
        } catch (err: any) {
            setJoinError(err.message);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <>
            <div className="mb-6">
                <div className="p-5 bg-white border border-slate-200/70 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold tracking-tight text-slate-800">Dołącz do nowej klasy</h2>
                    <p className="text-sm text-slate-600 mt-1 mb-4">Wpisz kod, który otrzymałeś od nauczyciela.</p>
                    <form onSubmit={handleJoinClass} className="flex flex-col sm:flex-row items-start gap-3">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Wpisz kod dostępu..."
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 text-slate-900 placeholder:text-slate-500 font-mono tracking-wider text-center sm:text-left text-lg border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {joinError && <p className="text-red-600 text-sm mt-1.5">{joinError}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isJoining}
                            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-all duration-200 disabled:bg-blue-300"
                        >
                            {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlusIcon className="w-5 h-5" />}
                            <span className="text-sm font-semibold">{isJoining ? 'Dołączanie...' : 'Dołącz'}</span>
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-4 px-1">Moje Klasy</h2>
                {classesData.length === 0 ? (
                    <StudentEmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classesData.map(classItem => (
                            <StudentClassCard key={classItem._id} classItem={classItem} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT (ROUTER)
// ============================================================================
export default function ClassesDashboardPage() {
    const { data: session, status } = useSession();
    const [classes, setClasses] = useState<Class[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchClasses = async () => {
        setIsDataLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/classes`);
            if (!res.ok) throw new Error('Nie udało się pobrać klas.');
            const data = await res.json();
            setClasses(data.classes || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchClasses();
        } else if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading' || isDataLoading) {
        return <section className="flex-1 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></section>;
    }

    if (error) {
        return <section className="flex-1 flex items-center justify-center text-red-500 bg-red-50 p-6 rounded-2xl"><p>{error}</p></section>;
    }

    return (
        <section className="bg-slate-50 p-6 md:p-8 flex flex-col h-full">
            {session?.user?.profileType === 1 ? (
                <TeacherClassesDashboard classesData={classes} setClasses={setClasses} setError={setError} />
            ) : (
                <StudentClassesDashboard classesData={classes} fetchClasses={fetchClasses} setError={setError} />
            )}
        </section>
    );
}*/