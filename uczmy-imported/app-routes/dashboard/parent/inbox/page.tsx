'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Info,
    Filter,
    Check
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'normal' | 'important' | 'urgent';
    author: string;
    className?: string;
    createdAt: string;
    isRead: boolean;
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

// Priority Icon
const PriorityIcon = ({ priority }: { priority: Announcement['priority'] }) => {
    if (priority === 'urgent') return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (priority === 'important') return <AlertCircle className="h-5 w-5 text-amber-500" />;
    return <Info className="h-5 w-5 text-blue-500" />;
};

// Announcement Card
const AnnouncementCard = ({
    announcement,
    onMarkRead
}: {
    announcement: Announcement;
    onMarkRead: () => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
            p-5 rounded-xl border-l-4 cursor-pointer transition-all
            ${announcement.priority === 'urgent'
                ? 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10'
                : announcement.priority === 'important'
                    ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10'
                    : 'border-l-blue-500 bg-slate-50 dark:bg-slate-700/30'
            }
            ${!announcement.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
        `}
        onClick={onMarkRead}
    >
        <div className="flex items-start gap-4">
            <PriorityIcon priority={announcement.priority} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${!announcement.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {announcement.title}
                    </h3>
                    {!announcement.isRead && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                            Nowe
                        </span>
                    )}
                </div>
                <p className={`text-sm mb-3 ${!announcement.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {announcement.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{announcement.author}</span>
                    {announcement.className && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-600 rounded">
                            {announcement.className}
                        </span>
                    )}
                    <span>{announcement.createdAt}</span>
                </div>
            </div>
            {announcement.isRead && (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            )}
        </div>
    </motion.div>
);

// Main Parent Inbox Page
export default function ParentInboxPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    // Mock announcements
    const [announcements, setAnnouncements] = useState<Announcement[]>([
        {
            id: '1',
            title: 'Zmiana godziny zajęć w piątek',
            content: 'Zajęcia z angielskiego w piątek 3 stycznia zostają przeniesione z godz. 15:00 na godz. 16:00. Przepraszamy za utrudnienia i prosimy o potwierdzenie.',
            priority: 'important',
            author: 'Anna Nauczyciel',
            className: 'Angielski GR1',
            createdAt: '30 gru 2024, 14:30',
            isRead: false,
        },
        {
            id: '2',
            title: 'Pilne: Test przełożony',
            content: 'Ze względu na sytuację zdrowotną, test z Past Simple zostaje przełożony na przyszły tydzień. Nowy termin zostanie podany wkrótce.',
            priority: 'urgent',
            author: 'Anna Nauczyciel',
            className: 'Angielski GR1',
            createdAt: '28 gru 2024, 09:15',
            isRead: false,
        },
        {
            id: '3',
            title: 'Przerwa świąteczna',
            content: 'Informujemy, że w dniach 24-26 grudnia szkoła będzie nieczynna. Życzymy Wesołych Świąt i Szczęśliwego Nowego Roku!',
            priority: 'normal',
            author: 'Dyrekcja',
            createdAt: '20 gru 2024, 10:00',
            isRead: true,
        },
        {
            id: '4',
            title: 'Postępy dziecka w nauce',
            content: 'Chcieliśmy poinformować, że Pani córka Anna wykazuje bardzo dobre postępy w nauce języka angielskiego. Gratulujemy!',
            priority: 'normal',
            author: 'Anna Nauczyciel',
            className: 'Angielski GR1',
            createdAt: '15 gru 2024, 16:45',
            isRead: true,
        },
        {
            id: '5',
            title: 'Nowy materiał do samodzielnej nauki',
            content: 'Udostępniliśmy nowe fiszki do nauki słówek z tematu "Travel". Zachęcamy do regularnego powtarzania.',
            priority: 'normal',
            author: 'Anna Nauczyciel',
            className: 'Angielski GR1',
            createdAt: '10 gru 2024, 11:20',
            isRead: true,
        },
    ]);

    const handleMarkRead = (id: string) => {
        setAnnouncements(prev => prev.map(a =>
            a.id === id ? { ...a, isRead: true } : a
        ));
    };

    const handleMarkAllRead = () => {
        setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));
    };

    const filteredAnnouncements = filter === 'unread'
        ? announcements.filter(a => !a.isRead)
        : announcements;

    const unreadCount = announcements.filter(a => !a.isRead).length;

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/parent">
                            <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Bell className="h-6 w-6 text-purple-500" />
                                Skrzynka Ogłoszeń
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-sm font-medium rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Wiadomości od nauczycieli i szkoły
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            Wszystkie
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread'
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            Nieprzeczytane ({unreadCount})
                        </button>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <Check className="h-4 w-4" />
                            Oznacz wszystko jako przeczytane
                        </button>
                    )}
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onMarkRead={() => handleMarkRead(announcement.id)}
                            />
                        ))
                    ) : (
                        <PremiumCard className="p-12 text-center">
                            <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                Brak ogłoszeń
                            </h3>
                            <p className="text-slate-500 dark:text-slate-500 mt-1">
                                {filter === 'unread'
                                    ? 'Wszystkie ogłoszenia zostały przeczytane'
                                    : 'Nie ma żadnych ogłoszeń do wyświetlenia'
                                }
                            </p>
                        </PremiumCard>
                    )}
                </div>
            </div>
        </div>
    );
}
