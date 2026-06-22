'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    BookOpen,
    BarChart3,
    Calendar,
    Users
} from 'lucide-react';

interface CourseLayoutProps {
    children: React.ReactNode;
}

export default function CourseLayout({ children }: CourseLayoutProps) {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'Dashboard',
            href: '/dashboard/course',
            icon: Home,
            description: 'Główny widok postępów'
        },
        {
            name: 'Przedmioty',
            href: '/dashboard/course/subjects',
            icon: BookOpen,
            description: 'Wybór przedmiotów do nauki'
        },
        {
            name: 'Plan lekcji',
            href: '/dashboard/course/lesson-plan',
            icon: Calendar,
            description: 'Szczegółowy plan nauki'
        },
        {
            name: 'Analityka',
            href: '/dashboard/course/analytics',
            icon: BarChart3,
            description: 'Statystyki i postępy'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Navigation Header */}
            <div className="container mx-auto max-w-7xl px-4 py-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Plan Nauki
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                        Zarządzaj swoją nauką i śledź postępy
                    </p>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all transform hover:scale-[1.02] ${isActive
                                            ? 'bg-blue-500 text-white shadow-lg'
                                            : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Page Content */}
            <div className="container mx-auto max-w-7xl px-4">
                {children}
            </div>
        </div>
    );
}
