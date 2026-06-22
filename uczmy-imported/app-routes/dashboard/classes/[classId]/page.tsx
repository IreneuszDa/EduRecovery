'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Loader2, Trash2, ChevronLeft, AlertCircle, Pencil, Users, ClipboardPenIcon, ClipboardCheckIcon,
    BookOpenIcon, ArrowLeftCircleIcon
} from 'lucide-react';

interface ClassDetailData {
    _id: string;
    name: string;
    subject: string;
    joinCode?: string; // Optional for students
    teacherName?: string; // Optional for students
}

// ============================================================================
// TEACHER VIEW COMPONENT
// ============================================================================
function ManageClassView({ classData, classId }: { classData: ClassDetailData, classId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!window.confirm('Czy na pewno chcesz trwale usunąć tę klasę? Tej akcji nie można cofnąć.')) return;
        setIsDeleting(true);
        setError(null);
        try {
            const res = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Nie udało się usunąć klasy.');
            }
            router.push('/dashboard/classes');
        } catch (err: any) {
            setError(err.message);
            setIsDeleting(false);
        }
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    return (
        <section className="bg-slate-50 p-6 md:p-8 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/classes" className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label="Wróć do klas">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800">{classData.name}</h1>
                        <p className="text-slate-500 text-sm">{classData.subject}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 p-2.5 rounded-xl border border-slate-300 bg-white shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors">
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-500" />}
                    </button>
                    <Link href={`/dashboard/classes/edit/${classId}`} className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200">
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm font-semibold">Edytuj</span>
                    </Link>
                </div>
            </div>
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Users className="w-5 h-5 text-slate-500" />Lista uczniów</h2>
                    <div className="mt-6 flex flex-col items-center justify-center text-center h-full min-h-[200px] bg-slate-50/70 rounded-xl border-2 border-dashed border-slate-200">
                        <Users className="w-10 h-10 text-slate-300 mb-2" /><p className="font-medium text-slate-600">Lista uczniów pojawi się tutaj</p><p className="text-sm text-slate-500">Ta funkcja jest w przygotowaniu.</p>
                    </div>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Kod dostępu</h2>
                    <p className="text-sm text-slate-600 mb-3">Udostępnij ten kod swoim uczniom, aby mogli dołączyć do klasy.</p>
                    <div className="flex items-center gap-2">
                        <p className="flex-1 text-center font-mono text-2xl tracking-widest bg-slate-100 text-slate-800 rounded-lg py-3">{classData.joinCode}</p>
                        <button onClick={() => classData.joinCode && handleCopyCode(classData.joinCode)} className="p-3 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors">
                            {isCopied ? <ClipboardCheckIcon className="w-6 h-6 text-green-600" /> : <ClipboardPenIcon className="w-6 h-6 text-slate-600" />}
                        </button>
                    </div>
                    {isCopied && <p className="text-sm text-green-600 text-center mt-3 animate-pulse">Skopiowano do schowka!</p>}
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// STUDENT VIEW COMPONENT
// ============================================================================
function StudentClassDetailView({ classData, classId }: { classData: ClassDetailData, classId: string }) {
    const router = useRouter();
    const [isLeaving, setIsLeaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLeaveClass = async () => {
        if (!window.confirm('Czy na pewno chcesz opuścić tę klasę?')) return;
        setIsLeaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/classes/student-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'LEAVE', classId: classId }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Nie udało się opuścić klasy.');
            }
            router.push('/dashboard/classes');
        } catch (err: any) {
            setError(err.message);
            setIsLeaving(false);
        }
    };

    return (
        <section className="bg-slate-50 p-6 md:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/classes" className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label="Wróć do klas">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800">{classData.name}</h1>
                        <p className="text-slate-500 text-sm">{classData.subject}</p>
                        {classData.teacherName && <p className="text-slate-500 text-xs mt-1">Nauczyciel: {classData.teacherName}</p>}
                    </div>
                </div>
                <button
                    onClick={handleLeaveClass}
                    disabled={isLeaving}
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-600 p-2.5 rounded-xl border border-red-200 bg-white shadow-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                    {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeftCircleIcon className="w-4 h-4" />}
                    <span>Opuść klasę</span>
                </button>
            </div>
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <BookOpenIcon className="w-5 h-5 text-slate-500" />
                    Materiały i zadania
                </h2>
                <div className="mt-6 flex flex-col items-center justify-center text-center h-full min-h-[200px] bg-slate-50/70 rounded-xl border-2 border-dashed border-slate-200">
                    <BookOpenIcon className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Zadania pojawią się tutaj</p>
                    <p className="text-sm text-slate-500">Ta funkcja jest w przygotowaniu.</p>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT (ROUTER)
// ============================================================================
export default function ClassDetailPageRouter({ params }: { params: { classId: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { classId } = params;

    const [classData, setClassData] = useState<ClassDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') { router.push('/'); }
        if (status === 'authenticated' && classId) {
            const fetchClassData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const res = await fetch(`/api/classes/${classId}`);
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || 'Nie udało się pobrać danych klasy.');
                    }
                    const data = await res.json();
                    setClassData(data.class);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchClassData();
        }
    }, [status, classId, router]);

    if (isLoading || status === 'loading') {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-slate-800">Wystąpił błąd</h2>
                <p className="text-red-600 mt-2">{error}</p>
                <Link href="/dashboard/classes" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                    <ChevronLeft className="h-4 w-4" />Wróć do klas
                </Link>
            </div>
        );
    }

    if (!classData) {
        return <div className="flex-1 flex items-center justify-center">Nie znaleziono klasy.</div>;
    }

    // Render view based on user profile type
    return session?.user?.profileType === 1
        ? <ManageClassView classData={classData} classId={classId} />
        : <StudentClassDetailView classData={classData} classId={classId} />;
}