// @/lib/validation.ts
// Input validation and sanitization utilities for security

import { z } from 'zod';

/**
 * Common validation schemas
 */
export const schemas = {
    // Email validation
    email: z.string()
        .email('Nieprawidłowy adres email')
        .max(255, 'Email za długi'),

    // Password validation (min 8 chars, at least 1 number, 1 uppercase)
    password: z.string()
        .min(8, 'Hasło musi mieć min. 8 znaków')
        .max(128, 'Hasło za długie')
        .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
        .regex(/[0-9]/, 'Hasło musi zawierać cyfrę'),

    // Name validation
    name: z.string()
        .min(2, 'Imię za krótkie')
        .max(100, 'Imię za długie')
        .regex(/^[\p{L}\s'-]+$/u, 'Nieprawidłowe znaki w imieniu'),

    // Title validation (for announcements, homework, etc.)
    title: z.string()
        .min(3, 'Tytuł za krótki')
        .max(200, 'Tytuł za długi')
        .transform(val => sanitizeString(val)),

    // Content/description validation
    content: z.string()
        .min(1, 'Treść jest wymagana')
        .max(10000, 'Treść za długa')
        .transform(val => sanitizeString(val)),

    // Topic validation
    topic: z.string()
        .min(3, 'Temat za krótki')
        .max(300, 'Temat za długi')
        .transform(val => sanitizeString(val)),

    // MongoDB ObjectId
    objectId: z.string()
        .regex(/^[a-fA-F0-9]{24}$/, 'Nieprawidłowy identyfikator'),

    // Date validation
    date: z.string()
        .datetime({ message: 'Nieprawidłowa data' })
        .or(z.date()),

    // Positive integer
    positiveInt: z.number()
        .int('Musi być liczbą całkowitą')
        .positive('Musi być dodatnia'),

    // Percentage (0-100)
    percentage: z.number()
        .min(0, 'Minimum to 0')
        .max(100, 'Maksimum to 100'),

    // Join code validation
    joinCode: z.string()
        .min(6, 'Kod za krótki')
        .max(20, 'Kod za długi')
        .regex(/^[A-Z0-9-]+$/, 'Nieprawidłowy format kodu'),
};

/**
 * Form validation schemas
 */
export const formSchemas = {
    // Login form
    login: z.object({
        email: schemas.email,
        password: z.string().min(1, 'Hasło jest wymagane'),
    }),

    // Registration form
    register: z.object({
        name: schemas.name,
        email: schemas.email,
        password: schemas.password,
        confirmPassword: z.string(),
    }).refine(data => data.password === data.confirmPassword, {
        message: 'Hasła nie zgadzają się',
        path: ['confirmPassword'],
    }),

    // Create homework form
    createHomework: z.object({
        title: schemas.title,
        topic: schemas.topic,
        classId: schemas.objectId,
        deadline: schemas.date,
        description: schemas.content.optional(),
    }),

    // Create lesson form
    createLesson: z.object({
        classId: schemas.objectId,
        date: schemas.date,
        duration: z.number().min(15).max(180),
        topic: schemas.topic,
        topicDetails: schemas.content.optional(),
    }),

    // Create announcement form
    createAnnouncement: z.object({
        title: schemas.title,
        content: schemas.content,
        priority: z.enum(['normal', 'important', 'urgent']),
        targetAudience: z.enum(['all', 'parents', 'students']),
        classId: schemas.objectId.optional(),
    }),

    // Create booking slot form
    createBookingSlot: z.object({
        title: schemas.title,
        description: schemas.content.optional(),
        date: schemas.date,
        startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
        duration: z.number().min(15).max(240),
        maxParticipants: schemas.positiveInt,
    }),
};

/**
 * Sanitize string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

/**
 * Sanitize HTML content (allow only safe tags)
 */
export function sanitizeHtml(input: string): string {
    // Remove script tags and event handlers
    let sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '');

    return sanitized;
}

/**
 * Validate and parse request body
 */
export async function validateBody<T>(
    body: unknown,
    schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
    const result = schema.safeParse(body);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors = result.error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
    );

    return { success: false, errors };
}

/**
 * Rate limit key generator
 */
export function generateRateLimitKey(
    userId: string,
    schoolId: string,
    action: string
): string {
    return `rate_limit:${schoolId}:${userId}:${action}`;
}

/**
 * Check if string contains potential SQL injection
 */
export function containsSqlInjection(input: string): boolean {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
        /(--)|(\/\*)|(\*\/)/,
        /(;.*--)/,
        /('.*OR.*'.*=.*')/i,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check if string contains potential NoSQL injection
 */
export function containsNoSqlInjection(input: string): boolean {
    const noSqlPatterns = [
        /\$where/i,
        /\$regex/i,
        /\$gt/i,
        /\$lt/i,
        /\$ne/i,
        /\$or/i,
        /\$and/i,
    ];

    return noSqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Safe JSON parse with validation
 */
export function safeJsonParse<T>(
    json: string,
    schema: z.ZodSchema<T>
): T | null {
    try {
        const parsed = JSON.parse(json);
        const result = schema.safeParse(parsed);
        return result.success ? result.data : null;
    } catch {
        return null;
    }
}

/**
 * Validate file upload
 */
export function validateFileUpload(
    file: { name: string; size: number; type: string },
    options: {
        maxSize?: number; // bytes
        allowedTypes?: string[];
    } = {}
): { valid: boolean; error?: string } {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'] } = options;

    if (file.size > maxSize) {
        return { valid: false, error: `Plik za duży. Maksimum: ${Math.round(maxSize / 1024 / 1024)}MB` };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: `Niedozwolony typ pliku. Dozwolone: ${allowedTypes.join(', ')}` };
    }

    // Check for double extensions
    const parts = file.name.split('.');
    if (parts.length > 2) {
        return { valid: false, error: 'Podwójne rozszerzenia nie są dozwolone' };
    }

    return { valid: true };
}
