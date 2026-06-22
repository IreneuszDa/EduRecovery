'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Plus,
    Copy,
    Check,
    ArrowLeft,
    Loader2,
    Settings,
    UserPlus,
    BookOpen,
    MoreVertical,
    Trash2,
    Edit2
} from 'lucide-react';
import Link from 'next/link';

// Types
interface ClassData {
    id: string;
    name: string;
    subject: string;
    joinCode: string;
    studentCount: number;
    isActive: boolean;
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

// Class Card Component
const ClassCard = ({
    classData,
    onCopyCode
}: {
    classData: ClassData;
    onCopyCode: (code: string) => void;
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(classData.joinCode);
        setCopied(true);
        onCopyCode(classData.joinCode);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 border border-slate-200 dark:border-slate-600"
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                        {classData.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {classData.subject}
                    </p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <MoreVertical className="h-4 w-4 text-slate-500" />
                    </button>
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-10 w-40 bg-white dark:bg-slate-700 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 z-10 overflow-hidden"
                            >
                                <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2">
                                    <Edit2 className="h-4 w-4" />
                                    Edytuj
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Ustawienia
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    Usuń
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Users className="h-4 w-4" />
                    <span>{classData.studentCount} uczniów</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${classData.isActive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                    {classData.isActive ? 'Aktywna' : 'Nieaktywna'}
                </span>
            </div>

            {/* Join Code */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <div className="flex-1">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-0.5">Kod dołączenia</p>
                    <p className="font-mono font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                        {classData.joinCode}
                    </p>
                </div>
                <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                        <Copy className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    )}
                </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
                <Link href={`/dashboard/teacher/classes/${classData.id}`} className="flex-1">
                    <button className="w-full py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg transition-colors">
                        Zarządzaj
                    </button>
                </Link>
                <Link href={`/dashboard/teacher/lessons?class=${classData.id}`} className="flex-1">
                    <button className="w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
                        Dziennik
                    </button>
                </Link>
            </div>
        </motion.div>
    );
};

// Main Classes Page
export default function ClassesPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [showNewForm, setShowNewForm] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Mock classes
    const [classes, setClasses] = useState<ClassData[]>([
        { id: '1', name: 'Angielski GR1', subject: 'Język angielski', joinCode: 'ANG-GR1-2024', studentCount: 12, isActive: true },
        { id: '2', name: 'Matematyka 2A', subject: 'Matematyka', joinCode: 'MAT-2A-2024', studentCount: 8, isActive: true },
        { id: '3', name: 'Angielski GR2', subject: 'Język angielski', joinCode: 'ANG-GR2-2024', studentCount: 15, isActive: true },
        { id: '4', name: 'Fizyka 1B', subject: 'Fizyka', joinCode: 'FIZ-1B-2024', studentCount: 6, isActive: false },
    ]);

    const generateJoinCode = (name: string) => {
        const prefix = name.substring(0, 3).toUpperCase().replace(/\s/g, '');
        const year = new Date().getFullYear();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${prefix}-${random}-${year}`;
    };

    const handleCreateClass = async () => {
        if (!newClassName.trim() || !newSubject.trim()) return;

        setIsCreating(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const newClass: ClassData = {
            id: Date.now().toString(),
            name: newClassName,
            subject: newSubject,
            joinCode: generateJoinCode(newClassName),
            studentCount: 0,
            isActive: true,
        };

        setClasses(prev => [newClass, ...prev]);
        setIsCreating(false);
        setShowNewForm(false);
        setNewClassName('');
        setNewSubject('');
    };

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
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
                                <Users className="h-6 w-6 text-amber-500" />
                                Zarządzanie Klasami
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Twórz grupy i zarządzaj uczniami
                            </p>
                        </div>
                    </div>
                    {!showNewForm && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowNewForm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-amber-500/30"
                        >
                            <Plus className="h-4 w-4" />
                            Nowa klasa
                        </motion.button>
                    )}
                </div>

                {/* New Class Form */}
                <AnimatePresence>
                    {showNewForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PremiumCard className="p-6">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                                    Utwórz nową klasę
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Nazwa klasy
                                        </label>
                                        <input
                                            type="text"
                                            value={newClassName}
                                            onChange={(e) => setNewClassName(e.target.value)}
                                            placeholder="np. Angielski GR3"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Przedmiot
                                        </label>
                                        <input
                                            type="text"
                                            value={newSubject}
                                            onChange={(e) => setNewSubject(e.target.value)}
                                            placeholder="np. Język angielski"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowNewForm(false)}
                                        className="px-4 py-2 text-slate-600 dark:text-slate-300"
                                    >
                                        Anuluj
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCreateClass}
                                        disabled={isCreating || !newClassName.trim() || !newSubject.trim()}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium disabled:opacity-50"
                                    >
                                        {isCreating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                        Utwórz klasę
                                    </motion.button>
                                </div>
                            </PremiumCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {classes.map((classData) => (
                        <ClassCard
                            key={classData.id}
                            classData={classData}
                            onCopyCode={(code) => console.log('Copied:', code)}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {classes.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                            Brak klas
                        </h3>
                        <p className="text-slate-500 dark:text-slate-500 mt-1">
                            Utwórz swoją pierwszą klasę, aby rozpocząć
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
