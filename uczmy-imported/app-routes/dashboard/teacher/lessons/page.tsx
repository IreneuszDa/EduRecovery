'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Users,
    Clock,
    Plus,
    Save,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    ArrowLeft,
    Loader2,
    FileText,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Student {
    id: string;
    name: string;
}

interface AttendanceRecord {
    studentId: string;
    present: boolean;
    note: 'active' | 'sleepy' | 'unprepared' | 'none';
    customNote?: string;
}

// Premium Card
const PremiumCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`
        bg-white dark:bg-slate-800 
        rounded-2xl 
        border border-slate-200/60 dark:border-slate-700/60
        shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
        ${className}
    `}>
        {children}
    </div>
);

// Attendance Row Component
const AttendanceRow = ({
    student,
    record,
    onChange
}: {
    student: Student;
    record: AttendanceRecord;
    onChange: (record: AttendanceRecord) => void;
}) => {
    const noteOptions = [
        { value: 'none', label: 'Brak', color: 'bg-slate-100 text-slate-600' },
        { value: 'active', label: '🌟 Aktywny', color: 'bg-emerald-100 text-emerald-700' },
        { value: 'sleepy', label: '😴 Śpiący', color: 'bg-amber-100 text-amber-700' },
        { value: 'unprepared', label: '📚 Nieprzygotowany', color: 'bg-red-100 text-red-700' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-4 p-4 rounded-xl ${record.present
                    ? 'bg-slate-50 dark:bg-slate-700/30'
                    : 'bg-red-50 dark:bg-red-900/20'
                } transition-colors`}
        >
            {/* Student Name */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-white truncate">
                    {student.name}
                </p>
            </div>

            {/* Presence Toggle */}
            <button
                onClick={() => onChange({ ...record, present: !record.present })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${record.present
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
            >
                {record.present ? 'Obecny' : 'Nieobecny'}
            </button>

            {/* Note Dropdown */}
            {record.present && (
                <select
                    value={record.note}
                    onChange={(e) => onChange({ ...record, note: e.target.value as AttendanceRecord['note'] })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border-0 cursor-pointer ${noteOptions.find(o => o.value === record.note)?.color || ''
                        } dark:bg-slate-700 dark:text-slate-200`}
                >
                    {noteOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </motion.div>
    );
};

// Main Lesson Log Page
export default function LessonsPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [topic, setTopic] = useState('');
    const [topicDetails, setTopicDetails] = useState('');
    const [duration, setDuration] = useState(45);
    const [privateNotes, setPrivateNotes] = useState('');
    const [parentSummary, setParentSummary] = useState('');
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [showNewLesson, setShowNewLesson] = useState(false);

    // Mock classes and students
    const classes = [
        {
            id: '1', name: 'Angielski GR1', students: [
                { id: 's1', name: 'Anna Kowalska' },
                { id: 's2', name: 'Jan Nowak' },
                { id: 's3', name: 'Maria Wiśniewska' },
                { id: 's4', name: 'Piotr Zieliński' },
            ]
        },
        {
            id: '2', name: 'Matematyka 2A', students: [
                { id: 's5', name: 'Katarzyna Lewandowska' },
                { id: 's6', name: 'Michał Kamiński' },
            ]
        },
    ];

    const recentLessons = [
        { id: '1', date: '2024-12-28', class: 'Angielski GR1', topic: 'Past Simple - zdania pytające', attendanceCount: '4/4' },
        { id: '2', date: '2024-12-26', class: 'Matematyka 2A', topic: 'Funkcje liniowe - wykresy', attendanceCount: '2/2' },
        { id: '3', date: '2024-12-23', class: 'Angielski GR1', topic: 'Past Simple - zdania twierdzące', attendanceCount: '3/4' },
    ];

    // Initialize attendance when class changes
    useEffect(() => {
        if (selectedClass) {
            const classData = classes.find(c => c.id === selectedClass);
            if (classData) {
                const initialAttendance: Record<string, AttendanceRecord> = {};
                classData.students.forEach(student => {
                    initialAttendance[student.id] = {
                        studentId: student.id,
                        present: true,
                        note: 'none',
                    };
                });
                setAttendance(initialAttendance);
            }
        }
    }, [selectedClass]);

    const handleAttendanceChange = (studentId: string, record: AttendanceRecord) => {
        setAttendance(prev => ({ ...prev, [studentId]: record }));
    };

    const handleSave = async () => {
        if (!selectedClass || !topic.trim()) {
            return;
        }

        setIsSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSaving(false);
        setSavedSuccess(true);

        setTimeout(() => {
            setSavedSuccess(false);
            setShowNewLesson(false);
            setTopic('');
            setTopicDetails('');
            setPrivateNotes('');
            setParentSummary('');
        }, 2000);
    };

    const selectedClassData = classes.find(c => c.id === selectedClass);

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/teacher">
                            <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-emerald-500" />
                                Dziennik Lekcyjny
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Zapisuj tematy lekcji i obecność uczniów
                            </p>
                        </div>
                    </div>
                    {!showNewLesson && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowNewLesson(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30"
                        >
                            <Plus className="h-4 w-4" />
                            Nowy wpis
                        </motion.button>
                    )}
                </div>

                {/* New Lesson Form */}
                <AnimatePresence>
                    {showNewLesson && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PremiumCard className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                        Nowy wpis do dziennika
                                    </h2>
                                    <button
                                        onClick={() => setShowNewLesson(false)}
                                        className="text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        Anuluj
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Class & Date Selection */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Klasa
                                            </label>
                                            <select
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                            >
                                                <option value="">Wybierz klasę...</option>
                                                {classes.map(cls => (
                                                    <option key={cls.id} value={cls.id}>
                                                        {cls.name} ({cls.students.length} uczniów)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Data
                                            </label>
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Czas trwania (min)
                                            </label>
                                            <select
                                                value={duration}
                                                onChange={(e) => setDuration(Number(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                            >
                                                <option value={30}>30 min</option>
                                                <option value={45}>45 min</option>
                                                <option value={60}>60 min</option>
                                                <option value={90}>90 min</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Topic */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Temat lekcji
                                        </label>
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="np. Past Simple - zdania pytające"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Szczegóły / Notatki z lekcji
                                        </label>
                                        <textarea
                                            value={topicDetails}
                                            onChange={(e) => setTopicDetails(e.target.value)}
                                            placeholder="Dodatkowe informacje o przebiegu lekcji..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white resize-none"
                                        />
                                    </div>

                                    {/* Attendance Section */}
                                    {selectedClassData && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Obecność ({Object.values(attendance).filter(a => a.present).length}/{selectedClassData.students.length})
                                            </label>
                                            <div className="space-y-2">
                                                {selectedClassData.students.map(student => (
                                                    <AttendanceRow
                                                        key={student.id}
                                                        student={student}
                                                        record={attendance[student.id] || { studentId: student.id, present: true, note: 'none' }}
                                                        onChange={(record) => handleAttendanceChange(student.id, record)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Parent Summary */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Podsumowanie dla rodziców (opcjonalne)
                                        </label>
                                        <textarea
                                            value={parentSummary}
                                            onChange={(e) => setParentSummary(e.target.value)}
                                            placeholder="Krótkie podsumowanie lekcji widoczne dla rodziców w raporcie..."
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white resize-none"
                                        />
                                    </div>

                                    {/* Private Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Notatki prywatne (tylko dla Ciebie)
                                        </label>
                                        <textarea
                                            value={privateNotes}
                                            onChange={(e) => setPrivateNotes(e.target.value)}
                                            placeholder="Notatki widoczne tylko dla nauczyciela..."
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white resize-none"
                                        />
                                    </div>

                                    {/* Save Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={handleSave}
                                        disabled={isSaving || !selectedClass || !topic.trim()}
                                        className={`w-full py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-3 transition-all ${savedSuccess
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white disabled:from-slate-400 disabled:to-slate-500'
                                            }`}
                                    >
                                        {savedSuccess ? (
                                            <>
                                                <CheckCircle2 className="h-5 w-5" />
                                                Zapisano!
                                            </>
                                        ) : isSaving ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Zapisuję...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5" />
                                                Zapisz wpis
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </PremiumCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Recent Lessons */}
                <PremiumCard className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Ostatnie wpisy
                    </h2>
                    <div className="space-y-3">
                        {recentLessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-slate-500 w-24">
                                        {lesson.date}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-white">
                                            {lesson.topic}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {lesson.class}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Users className="h-4 w-4" />
                                    {lesson.attendanceCount}
                                </div>
                            </div>
                        ))}
                    </div>
                </PremiumCard>
            </div>
        </div>
    );
}
