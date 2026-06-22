// @/lib/designSystem.ts
// Premium "Billion Dollar" Design System for Uczmy.pl

/**
 * Color palette supporting white-label theming
 */
export const colors = {
    // Primary colors (can be overridden by school theme)
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },

    // Accent colors
    accent: {
        purple: '#8b5cf6',
        pink: '#ec4899',
        emerald: '#10b981',
        amber: '#f59e0b',
        rose: '#f43f5e',
    },

    // Semantic colors
    semantic: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
    },

    // Gamification colors
    gamification: {
        streak: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
        points: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        achievement: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        level: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    },
};

/**
 * Typography scale
 */
export const typography = {
    fontFamily: {
        sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
};

/**
 * Spacing scale
 */
export const spacing = {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
};

/**
 * Border radius
 */
export const borderRadius = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
};

/**
 * Shadows
 */
export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: {
        blue: '0 0 40px rgba(59, 130, 246, 0.3)',
        purple: '0 0 40px rgba(139, 92, 246, 0.3)',
        emerald: '0 0 40px rgba(16, 185, 129, 0.3)',
        amber: '0 0 40px rgba(245, 158, 11, 0.3)',
    },
};

/**
 * Animation presets for Framer Motion
 */
export const animations = {
    // Page transitions
    pageEnter: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
    },

    // Card hover
    cardHover: {
        whileHover: { y: -4, boxShadow: shadows.xl },
        transition: { duration: 0.2 },
    },

    // Button press
    buttonPress: {
        whileTap: { scale: 0.98 },
    },

    // Fade in
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
    },

    // Slide in from left
    slideInLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3 },
    },

    // Slide in from right
    slideInRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3 },
    },

    // Stagger children
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },

    // Scale in
    scaleIn: {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.2 },
    },
};

/**
 * Polish language labels for common UI elements
 */
export const polishLabels = {
    // Navigation
    nav: {
        home: 'Strona główna',
        dashboard: 'Panel',
        lessons: 'Lekcje',
        homework: 'Prace domowe',
        announcements: 'Ogłoszenia',
        classes: 'Klasy',
        students: 'Uczniowie',
        settings: 'Ustawienia',
        profile: 'Profil',
        logout: 'Wyloguj',
    },

    // Actions
    actions: {
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usuń',
        edit: 'Edytuj',
        create: 'Utwórz',
        send: 'Wyślij',
        submit: 'Zatwierdź',
        download: 'Pobierz',
        upload: 'Wgraj',
        search: 'Szukaj',
        filter: 'Filtruj',
        back: 'Wróć',
        next: 'Dalej',
        previous: 'Wstecz',
        close: 'Zamknij',
        confirm: 'Potwierdź',
        generate: 'Generuj',
        refresh: 'Odśwież',
    },

    // Status
    status: {
        loading: 'Ładowanie...',
        saving: 'Zapisywanie...',
        success: 'Sukces!',
        error: 'Wystąpił błąd',
        pending: 'Oczekujące',
        approved: 'Zatwierdzone',
        rejected: 'Odrzucone',
        draft: 'Szkic',
        sent: 'Wysłane',
        completed: 'Ukończone',
        inProgress: 'W trakcie',
    },

    // Time
    time: {
        today: 'Dziś',
        yesterday: 'Wczoraj',
        tomorrow: 'Jutro',
        thisWeek: 'Ten tydzień',
        lastWeek: 'Ostatni tydzień',
        thisMonth: 'Ten miesiąc',
        hoursAgo: 'godz. temu',
        minutesAgo: 'min temu',
        daysAgo: 'dni temu',
    },

    // Roles
    roles: {
        teacher: 'Nauczyciel',
        student: 'Uczeń',
        parent: 'Rodzic',
        admin: 'Administrator',
    },

    // Gamification
    gamification: {
        streak: 'Seria',
        points: 'Punkty',
        level: 'Poziom',
        achievements: 'Osiągnięcia',
        progress: 'Postęp',
        rank: 'Pozycja',
        badge: 'Odznaka',
    },

    // Forms
    forms: {
        required: 'Pole wymagane',
        optional: 'Opcjonalne',
        invalidEmail: 'Nieprawidłowy email',
        passwordTooShort: 'Hasło za krótkie',
        passwordsDoNotMatch: 'Hasła nie zgadzają się',
        fieldRequired: 'To pole jest wymagane',
    },

    // Empty states
    empty: {
        noData: 'Brak danych',
        noResults: 'Brak wyników',
        noHomework: 'Brak prac domowych',
        noLessons: 'Brak lekcji',
        noAnnouncements: 'Brak ogłoszeń',
        noStudents: 'Brak uczniów',
    },
};

/**
 * White-label theme interface
 */
export interface SchoolTheme {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo?: string;
    darkMode?: boolean;
    customCSS?: string;
}

/**
 * Generate CSS variables from school theme
 */
export function generateThemeCSS(theme: SchoolTheme): string {
    return `
        :root {
            --color-primary: ${theme.primaryColor};
            --color-secondary: ${theme.secondaryColor};
            --color-accent: ${theme.accentColor};
        }
    `;
}

/**
 * Default school theme
 */
export const defaultTheme: SchoolTheme = {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    darkMode: false,
};
