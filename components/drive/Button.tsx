// @/components/drive/Button.tsx
import { tv } from 'tailwind-variants';
export const button = tv({
    base: 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
    variants: {
        variant: {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
            secondary: 'bg-gray-200/70 text-gray-800 hover:bg-gray-300/70 focus-visible:ring-gray-400 border border-gray-300/50',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        },
    },
    defaultVariants: { variant: 'primary' }
});