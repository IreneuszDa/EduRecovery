// File: components/dashboard/SidebarNavItem.tsx

"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

// Definicja typów dla propsów
type SidebarNavItemProps = {
    icon: React.ComponentType<{ className?: string, strokeWidth?: number }>;
    label: string;
    href: string;
    isActive?: boolean;
};

const SidebarNavItem = ({ icon: Icon, label, href, isActive = false }: SidebarNavItemProps) => (
    <Link
        href={href}
        title={label}
        // Podstawowe style linku i focus state
        className="flex items-center py-2.5 px-3.5 rounded-lg text-sm transition-all duration-200 group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
    >
        {/* Wskaźnik aktywnego stanu z animacją (layoutId) */}
        {isActive && (
            <motion.div
                layoutId="active-main-nav"
                className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-md"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
        )}
        
        {/* Kontener na ikonę i tekst (aby były nad wskaźnikiem aktywności) */}
        <div className="relative z-10 flex items-center">
            {/* Ikona */}
            <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}
                strokeWidth={isActive ? 2.5 : 2}
            />
            {/* Etykieta (Tekst) */}
            <span className={`ml-4 whitespace-nowrap overflow-hidden ${isActive 
                ? "text-gray-900 dark:text-gray-50 font-semibold" 
                : "text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 font-medium"
            }`}>
                {label}
            </span>
        </div>
    </Link>
);

export default SidebarNavItem;