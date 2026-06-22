// @/lib/accessibility.ts
// Accessibility utilities for WCAG 2.1 compliance

/**
 * WCAG 2.1 color contrast requirements
 * - Normal text: minimum 4.5:1 ratio
 * - Large text (18pt+ or 14pt+ bold): minimum 3:1 ratio
 * - UI components: minimum 3:1 ratio
 */

/**
 * Calculate relative luminance of a color
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getLuminance(hexColor: string): number {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const toLinear = (c: number) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getContrastRatio(color1: string, color2: string): number {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color contrast meets WCAG AA requirements
 */
export function meetsContrastAA(
    foreground: string,
    background: string,
    isLargeText: boolean = false
): boolean {
    const ratio = getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if color contrast meets WCAG AAA requirements
 */
export function meetsContrastAAA(
    foreground: string,
    background: string,
    isLargeText: boolean = false
): boolean {
    const ratio = getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Skip to main content link for keyboard navigation
 */
export const SkipLink = {
    id: 'main-content',
    label: 'Przejdź do głównej treści',
};

/**
 * Focus trap utilities for modals and dialogs
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors));
}

/**
 * Announce message to screen readers using aria-live region
 */
export function announceToScreenReader(
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Polish ARIA labels for common elements
 */
export const ariaLabels = {
    // Navigation
    mainNav: 'Główna nawigacja',
    breadcrumbs: 'Ścieżka nawigacji',
    pagination: 'Nawigacja między stronami',
    sidebarNav: 'Nawigacja boczna',

    // Actions
    closeModal: 'Zamknij okno',
    openMenu: 'Otwórz menu',
    closeMenu: 'Zamknij menu',
    expandSection: 'Rozwiń sekcję',
    collapseSection: 'Zwiń sekcję',

    // Forms
    passwordShow: 'Pokaż hasło',
    passwordHide: 'Ukryj hasło',
    clearInput: 'Wyczyść pole',
    searchSubmit: 'Wyszukaj',

    // Content
    loadingContent: 'Ładowanie treści',
    errorMessage: 'Komunikat błędu',
    successMessage: 'Komunikat sukcesu',

    // Dashboard specific
    notifications: 'Powiadomienia',
    userMenu: 'Menu użytkownika',
    streakCounter: 'Licznik serii dni',
    pointsDisplay: 'Liczba punktów',
    progressBar: 'Pasek postępu',
};

/**
 * Keyboard navigation keys
 */
export const keys = {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
};

/**
 * Handle keyboard navigation for list items
 */
export function handleListKeyboardNav(
    event: KeyboardEvent,
    currentIndex: number,
    itemCount: number,
    onSelect: (index: number) => void
): void {
    switch (event.key) {
        case keys.ARROW_DOWN:
            event.preventDefault();
            onSelect(Math.min(currentIndex + 1, itemCount - 1));
            break;
        case keys.ARROW_UP:
            event.preventDefault();
            onSelect(Math.max(currentIndex - 1, 0));
            break;
        case keys.HOME:
            event.preventDefault();
            onSelect(0);
            break;
        case keys.END:
            event.preventDefault();
            onSelect(itemCount - 1);
            break;
    }
}

/**
 * Reduced motion preference check
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * High contrast preference check
 */
export function prefersHighContrast(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: more)').matches;
}

/**
 * CSS class for visually hidden but screen-reader accessible content
 */
export const srOnlyClass = 'sr-only';

/**
 * Generate unique ID for form field associations
 */
export function generateFieldId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
