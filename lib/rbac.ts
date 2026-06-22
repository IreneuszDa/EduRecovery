// @/lib/rbac.ts
// Role-Based Access Control utilities for Uczmy.pl

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * User profile types (roles)
 */
export const UserRoles = {
    STUDENT: 0,
    TEACHER: 1,
    PARENT: 2,
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

/**
 * Role names in Polish for display
 */
export const RoleNames: Record<UserRole, string> = {
    [UserRoles.STUDENT]: 'Uczeń',
    [UserRoles.TEACHER]: 'Nauczyciel',
    [UserRoles.PARENT]: 'Rodzic',
};

/**
 * Check if a user has one of the required roles
 */
export function hasRole(userProfileType: number | undefined, ...allowedRoles: UserRole[]): boolean {
    if (userProfileType === undefined) return false;
    return allowedRoles.includes(userProfileType as UserRole);
}

/**
 * Check if user is a teacher
 */
export function isTeacher(profileType: number | undefined): boolean {
    return profileType === UserRoles.TEACHER;
}

/**
 * Check if user is a student
 */
export function isStudent(profileType: number | undefined): boolean {
    return profileType === UserRoles.STUDENT;
}

/**
 * Check if user is a parent
 */
export function isParent(profileType: number | undefined): boolean {
    return profileType === UserRoles.PARENT;
}

/**
 * API Route handler wrapper that enforces role-based access
 * Usage: export const GET = withRoles([UserRoles.TEACHER], async (req, session) => { ... })
 */
export function withRoles(
    allowedRoles: UserRole[],
    handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        try {
            const session = await getServerSession(authOptions);

            if (!session || !session.user) {
                return NextResponse.json(
                    { error: "Nie jesteś zalogowany.", code: "UNAUTHORIZED" },
                    { status: 401 }
                );
            }

            const userRole = session.user.profileType as UserRole;

            if (!allowedRoles.includes(userRole)) {
                return NextResponse.json(
                    {
                        error: "Brak dostępu. Ta funkcja wymaga innej roli.",
                        code: "FORBIDDEN",
                        requiredRoles: allowedRoles.map(r => RoleNames[r]),
                        yourRole: RoleNames[userRole] || 'Nieznana'
                    },
                    { status: 403 }
                );
            }

            return handler(req, session);
        } catch (error) {
            console.error("[RBAC] Error in role check:", error);
            return NextResponse.json(
                { error: "Błąd autoryzacji.", code: "AUTH_ERROR" },
                { status: 500 }
            );
        }
    };
}

/**
 * Helper to get dashboard redirect path based on user role
 */
export function getDashboardPath(profileType: number): string {
    switch (profileType) {
        case UserRoles.TEACHER:
            return '/dashboard/teacher';
        case UserRoles.PARENT:
            return '/dashboard/parent';
        case UserRoles.STUDENT:
        default:
            return '/dashboard/student';
    }
}

/**
 * Check if user can access a specific school's data (multi-tenancy)
 */
export function canAccessSchool(
    userSchoolId: string | undefined,
    targetSchoolId: string
): boolean {
    if (!userSchoolId) return false;
    return userSchoolId === targetSchoolId;
}

/**
 * Validate that a parent can access a specific student's data
 */
export function canParentAccessStudent(
    parentChildrenIds: string[],
    studentId: string
): boolean {
    if (!parentChildrenIds || parentChildrenIds.length === 0) return false;
    return parentChildrenIds.includes(studentId);
}

/**
 * Check if user can access a specific dashboard path
 */
export function canAccessDashboard(session: any, path: string): boolean {
    if (!session?.user) return false;

    const role = session.user.profileType;

    if (path.startsWith('/dashboard/teacher')) {
        return role === UserRoles.TEACHER;
    }
    if (path.startsWith('/dashboard/student')) {
        return role === UserRoles.STUDENT;
    }
    if (path.startsWith('/dashboard/parent')) {
        return role === UserRoles.PARENT;
    }

    // General dashboard - allow all authenticated users
    return true;
}

/**
 * Permission definitions for fine-grained access control
 */
const permissions: Record<string, UserRole[]> = {
    // Homework
    'homework:create': [UserRoles.TEACHER],
    'homework:read': [UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.PARENT],
    'homework:update': [UserRoles.TEACHER],
    'homework:delete': [UserRoles.TEACHER],
    'homework:submit': [UserRoles.STUDENT],
    'homework:grade': [UserRoles.TEACHER],

    // Lessons
    'lesson:create': [UserRoles.TEACHER],
    'lesson:read': [UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.PARENT],
    'lesson:update': [UserRoles.TEACHER],

    // Announcements
    'announcement:create': [UserRoles.TEACHER],
    'announcement:read': [UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.PARENT],
    'announcement:delete': [UserRoles.TEACHER],

    // Bookings
    'booking:create': [UserRoles.PARENT],
    'booking:read': [UserRoles.TEACHER, UserRoles.PARENT],
    'booking:cancel': [UserRoles.PARENT, UserRoles.TEACHER],
    'booking:manage': [UserRoles.TEACHER],

    // Classes
    'class:create': [UserRoles.TEACHER],
    'class:read': [UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.PARENT],
    'class:update': [UserRoles.TEACHER],
    'class:delete': [UserRoles.TEACHER],

    // Reports
    'report:generate': [UserRoles.TEACHER, UserRoles.PARENT],
    'report:read': [UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.PARENT],
};

/**
 * Check if user has permission for a specific action
 */
export function checkRoleAccess(session: any, permission: string): boolean {
    if (!session?.user) return false;

    const role = session.user.profileType as UserRole;
    const allowedRoles = permissions[permission];

    if (!allowedRoles) return false;

    return allowedRoles.includes(role);
}
