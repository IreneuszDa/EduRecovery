'use client';

// @/components/ui/PremiumCard.tsx
// Reusable Premium Card Component with white-label support

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface PremiumCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    gradient?: boolean;
    glow?: 'blue' | 'purple' | 'emerald' | 'amber' | 'none';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    border?: boolean;
}

const glowColors = {
    blue: 'shadow-blue-500/20',
    purple: 'shadow-purple-500/20',
    emerald: 'shadow-emerald-500/20',
    amber: 'shadow-amber-500/20',
    none: '',
};

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function PremiumCard({
    children,
    className = '',
    hover = true,
    gradient = false,
    glow = 'none',
    padding = 'none',
    border = true,
    ...props
}: PremiumCardProps) {
    return (
        <motion.div
            whileHover={hover ? { y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : undefined}
            className={`
                ${gradient
                    ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white'
                    : 'bg-white dark:bg-slate-800'
                }
                rounded-2xl 
                ${border && !gradient ? 'border border-slate-200/60 dark:border-slate-700/60' : ''}
                shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
                ${glow !== 'none' ? glowColors[glow] : ''}
                backdrop-blur-sm
                transition-all duration-300
                ${paddingClasses[padding]}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default PremiumCard;
