// @/lib/testHelpers.ts
// Test helpers for integration testing

import { UserRoles } from './rbac';

/**
 * Mock user data for testing
 */
export const mockUsers = {
    teacher: {
        id: 'teacher-123',
        email: 'teacher@test.pl',
        name: 'Anna Nauczycielska',
        profileType: UserRoles.TEACHER,
        school: 'school-123',
    },
    student: {
        id: 'student-123',
        email: 'student@test.pl',
        name: 'Jan Uczniowski',
        profileType: UserRoles.STUDENT,
        school: 'school-123',
    },
    parent: {
        id: 'parent-123',
        email: 'parent@test.pl',
        name: 'Maria Rodzicielska',
        profileType: UserRoles.PARENT,
        school: 'school-123',
        children: ['student-123'],
    },
};

/**
 * Mock class data
 */
export const mockClass = {
    _id: 'class-123',
    name: 'Angielski Grupa A',
    subject: 'Język angielski',
    description: 'Grupa początkująca',
    school: 'school-123',
    teacher: 'teacher-123',
    students: ['student-123'],
    joinCode: 'ABC123',
};

/**
 * Mock homework data
 */
export const mockHomework = {
    _id: 'homework-123',
    class: 'class-123',
    teacher: 'teacher-123',
    school: 'school-123',
    title: 'Past Simple - ćwiczenia',
    topic: 'Czas Past Simple',
    status: 'published',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    questions: [
        {
            type: 'multiple_choice',
            question: 'Yesterday I ___ to school.',
            options: ['go', 'went', 'gone', 'going'],
            correctAnswer: 'went',
            points: 1,
        },
    ],
};

/**
 * Mock lesson data
 */
export const mockLesson = {
    _id: 'lesson-123',
    class: 'class-123',
    teacher: 'teacher-123',
    school: 'school-123',
    date: new Date(),
    duration: 45,
    topic: 'Past Simple - wprowadzenie',
    attendance: [
        { student: 'student-123', present: true },
    ],
};

/**
 * Mock announcement data
 */
export const mockAnnouncement = {
    _id: 'announcement-123',
    school: 'school-123',
    author: 'teacher-123',
    title: 'Zmiana godziny zajęć',
    content: 'Zajęcia w piątek przeniesione na 16:00',
    priority: 'important',
    targetAudience: 'all',
    isActive: true,
};

/**
 * Mock session for testing protected routes
 */
export function createMockSession(userType: 'teacher' | 'student' | 'parent') {
    const user = mockUsers[userType];
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profileType: user.profileType,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
}

/**
 * Test case descriptions for common flows
 */
export const testCases = {
    teacher: [
        'Nauczyciel może tworzyć nowe prace domowe',
        'Nauczyciel może edytować dziennik lekcyjny',
        'Nauczyciel może publikować ogłoszenia',
        'Nauczyciel może zarządzać klasami',
        'Nauczyciel może przeglądać postępy uczniów',
    ],
    student: [
        'Uczeń może przeglądać swoje prace domowe',
        'Uczeń może wykonywać zadania',
        'Uczeń może sprawdzić swoją serię dni',
        'Uczeń może rozmawiać z AI korepetytorem',
        'Uczeń nie może tworzyć prac domowych',
    ],
    parent: [
        'Rodzic może przeglądać postępy dziecka',
        'Rodzic może rezerwować warsztaty',
        'Rodzic może czytać ogłoszenia',
        'Rodzic może pobierać raporty PDF',
        'Rodzic nie może edytować danych ucznia',
    ],
    security: [
        'Nieautoryzowany użytkownik jest przekierowywany do logowania',
        'Uczeń nie może uzyskać dostępu do panelu nauczyciela',
        'Rodzic nie może uzyskać dostępu do panelu innego rodzica',
        'API wymaga autoryzacji dla chronionych endpointów',
        'Rate limiting działa poprawnie',
    ],
};

/**
 * API endpoint testing helper
 */
export async function testApiEndpoint(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: object,
    headers?: Record<string, string>
): Promise<{ status: number; data: any }> {
    const response = await fetch(endpoint, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return { status: response.status, data };
}

/**
 * Check if element is focusable (for accessibility testing)
 */
export function isElementFocusable(element: HTMLElement): boolean {
    const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ];

    return focusableSelectors.some(selector => element.matches(selector));
}

/**
 * Simulate keyboard event
 */
export function simulateKeyPress(
    element: HTMLElement,
    key: string,
    options: Partial<KeyboardEventInit> = {}
): void {
    const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        ...options,
    });
    element.dispatchEvent(event);
}
