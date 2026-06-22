'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Plus,
    Send,
    Users,
    AlertTriangle,
    AlertCircle,
    Info,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Mail,
    Clock,
    Edit2,
    Trash2,
    Eye
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'normal' | 'important' | 'urgent';
    targetAudience: 'all' | 'parents' | 'students';
    className?: string;
    createdAt: string;
    readCount: number;
    totalRecipients: number;
    emailSent: boolean;
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

// Priority Badge
const PriorityBadge = ({ priority }: { priority: Announcement['priority'] }) => {
    const config = {
        normal: { icon: Info, label: 'Zwykłe', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
        important: { icon: AlertCircle, label: 'Ważne', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
        urgent: { icon: AlertTriangle, label: 'Pilne', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    };
    const { icon: Icon, label, color } = config[priority];

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            <Icon className="h-3 w-3" />
            {label}
        </span>
    );
};

// Announcement Card
const AnnouncementCard = ({
    announcement,
    onEdit,
    onDelete
}: {
    announcement: Announcement;
    onEdit: () => void;
    onDelete: () => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-xl border-l-4 ${announcement.priority === 'urgent'
                ? 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10'
                : announcement.priority === 'important'
                    ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10'
                    : 'border-l-blue-500 bg-slate-50 dark:bg-slate-700/30'
            }`}
    >
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
                <PriorityBadge priority={announcement.priority} />
                <span className="text-xs text-slate-500">{announcement.createdAt}</span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={onEdit}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                    <Edit2 className="h-4 w-4 text-slate-500" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    <Trash2 className="h-4 w-4 text-red-500" />
                </button>
            </div>
        </div>

        <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
            {announcement.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
            {announcement.content}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {announcement.targetAudience === 'all' ? 'Wszyscy' :
                        announcement.targetAudience === 'parents' ? 'Rodzice' : 'Uczniowie'}
                    {announcement.className && ` (${announcement.className})`}
                </span>
                <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {announcement.readCount}/{announcement.totalRecipients}
                </span>
            </div>
            {announcement.emailSent && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Mail className="h-3 w-3" />
                    Email wysłany
                </span>
            )}
        </div>
    </motion.div>
);

// Main Announcements Page
export default function AnnouncementsPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [showNewForm, setShowNewForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState<Announcement['priority']>('normal');
    const [targetAudience, setTargetAudience] = useState<'all' | 'parents' | 'students'>('all');
    const [selectedClass, setSelectedClass] = useState('');
    const [sendEmail, setSendEmail] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);

    // Mock data
    const classes = [
        { id: '1', name: 'Angielski GR1' },
        { id: '2', name: 'Matematyka 2A' },
        { id: '3', name: 'Angielski GR2' },
    ];

    const [announcements, setAnnouncements] = useState<Announcement[]>([
        {
            id: '1',
            title: 'Zmiana godziny zajęć w piątek',
            content: 'Zajęcia z angielskiego w piątek 3 stycznia zostają przeniesione z godz. 15:00 na godz. 16:00. Przepraszamy za utrudnienia.',
            priority: 'important',
            targetAudience: 'all',
            className: 'Angielski GR1',
            createdAt: '30 gru 2024',
            readCount: 8,
            totalRecipients: 12,
            emailSent: true,
        },
        {
            id: '2',
            title: 'Przerwa świąteczna',
            content: 'Informujemy, że w dniach 24-26 grudnia szkoła będzie nieczynna. Życzymy Wesołych Świąt!',
            priority: 'normal',
            targetAudience: 'all',
            createdAt: '20 gru 2024',
            readCount: 25,
            totalRecipients: 30,
            emailSent: true,
        },
        {
            id: '3',
            title: 'Pilne: Test przełożony',
            content: 'Ze względu na sytuację zdrowotną, test z Past Simple zostaje przełożony na przyszły tydzień.',
            priority: 'urgent',
            targetAudience: 'students',
            className: 'Angielski GR1',
            createdAt: '18 gru 2024',
            readCount: 4,
            totalRecipients: 4,
            emailSent: true,
        },
    ]);

    const handleSend = async () => {
        if (!title.trim() || !content.trim()) return;

        setIsSending(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newAnnouncement: Announcement = {
            id: Date.now().toString(),
            title,
            content,
            priority,
            targetAudience,
            className: selectedClass ? classes.find(c => c.id === selectedClass)?.name : undefined,
            createdAt: 'teraz',
            readCount: 0,
            totalRecipients: 15,
            emailSent: sendEmail,
        };

        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsSending(false);
        setSentSuccess(true);

        setTimeout(() => {
            setSentSuccess(false);
            setShowNewForm(false);
            setTitle('');
            setContent('');
            setPriority('normal');
            setTargetAudience('all');
            setSelectedClass('');
        }, 2000);
    };

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
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
                                <Bell className="h-6 w-6 text-purple-500" />
                                Tablica Ogłoszeń
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Komunikacja z rodzicami i uczniami
                            </p>
                        </div>
                    </div>
                    {!showNewForm && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowNewForm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30"
                        >
                            <Plus className="h-4 w-4" />
                            Nowe ogłoszenie
                        </motion.button>
                    )}
                </div>

                {/* New Announcement Form */}
                <AnimatePresence>
                    {showNewForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PremiumCard className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                        Nowe ogłoszenie
                                    </h2>
                                    <button
                                        onClick={() => setShowNewForm(false)}
                                        className="text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        Anuluj
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    {/* Priority Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Priorytet
                                        </label>
                                        <div className="flex gap-2">
                                            {(['normal', 'important', 'urgent'] as const).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setPriority(p)}
                                                    className={`flex-1 py-2 rounded-xl font-medium transition-all ${priority === p
                                                            ? p === 'urgent'
                                                                ? 'bg-red-500 text-white'
                                                                : p === 'important'
                                                                    ? 'bg-amber-500 text-white'
                                                                    : 'bg-blue-500 text-white'
                                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                        }`}
                                                >
                                                    {p === 'normal' ? 'Zwykłe' : p === 'important' ? 'Ważne' : 'Pilne'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Tytuł
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="np. Zmiana godziny zajęć"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Treść
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Napisz treść ogłoszenia..."
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white resize-none"
                                        />
                                    </div>

                                    {/* Target Audience */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Odbiorcy
                                            </label>
                                            <select
                                                value={targetAudience}
                                                onChange={(e) => setTargetAudience(e.target.value as any)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                            >
                                                <option value="all">Wszyscy</option>
                                                <option value="parents">Tylko rodzice</option>
                                                <option value="students">Tylko uczniowie</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Klasa (opcjonalnie)
                                            </label>
                                            <select
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                            >
                                                <option value="">Wszystkie klasy</option>
                                                {classes.map(cls => (
                                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Email Toggle */}
                                    <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sendEmail}
                                            onChange={(e) => setSendEmail(e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-300 text-purple-500 focus:ring-purple-500"
                                        />
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                Wyślij powiadomienie email
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Odbiorcy otrzymają email z treścią ogłoszenia
                                            </p>
                                        </div>
                                    </label>

                                    {/* Send Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={handleSend}
                                        disabled={isSending || !title.trim() || !content.trim()}
                                        className={`w-full py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-3 transition-all ${sentSuccess
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:from-slate-400 disabled:to-slate-500'
                                            }`}
                                    >
                                        {sentSuccess ? (
                                            <>
                                                <CheckCircle2 className="h-5 w-5" />
                                                Wysłano!
                                            </>
                                        ) : isSending ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Wysyłam...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                Opublikuj ogłoszenie
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </PremiumCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Announcements List */}
                <PremiumCard className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        Opublikowane ogłoszenia
                    </h2>
                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onEdit={() => console.log('Edit', announcement.id)}
                                onDelete={() => setAnnouncements(prev => prev.filter(a => a.id !== announcement.id))}
                            />
                        ))}
                    </div>
                </PremiumCard>
            </div>
        </div>
    );
}
