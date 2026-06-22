import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                surface: {
                    light: '#ffffff',
                    dark: '#1e293b',
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.7)',
                    dark: 'rgba(30, 41, 59, 0.7)',
                }
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'SFMono-Regular', 'Consolas', 'monospace'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'slide-in-right': 'slideInRight 0.5s ease-out forwards',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'float': 'floating 3s ease-in-out infinite',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
                'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
                'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
            },
            backdropBlur: {
                'xs': '2px',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            }
        },
    },
    future: {
        modernColorFormat: false,
        respectDefaultRingColorOpacity: true,
        disableColorOpacityUtilitiesByDefault: true,
        hoverOnlyWhenSupported: true,
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
}
export default config