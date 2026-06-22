'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const buttonVariants = {
  primary: `
    bg-gradient-to-r from-primary-500 to-purple-600 
    hover:from-primary-600 hover:to-purple-700 
    text-white shadow-lg hover:shadow-glow
    border-0
  `,
  secondary: `
    bg-white dark:bg-surface-dark 
    hover:bg-gray-50 dark:hover:bg-slate-700 
    text-gray-700 dark:text-gray-200 
    border border-gray-200 dark:border-gray-600 
    shadow-md hover:shadow-lg
  `,
  ghost: `
    bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 
    text-gray-700 dark:text-gray-200 
    border-0 shadow-none
  `,
  outline: `
    bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 
    text-primary-600 dark:text-primary-400 
    border border-primary-200 dark:border-primary-700 
    hover:border-primary-300 dark:hover:border-primary-600
  `,
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-4 py-2.5 text-sm font-semibold',
  lg: 'px-6 py-3 text-base font-semibold',
};

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center
    rounded-xl font-semibold transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
  `;

  const variantClasses = buttonVariants[variant];
  const sizeClasses = sizeVariants[size];

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:translate-x-full transition-transform duration-700" />
      
      {/* Button content */}
      <div className="relative flex items-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
};

export default EnhancedButton;
