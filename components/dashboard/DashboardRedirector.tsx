'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRoles } from '@/lib/rbac';

/**
 * Role-based dashboard redirector
 * Redirects users to their appropriate dashboard based on profileType
 */
export default function DashboardRedirector() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/');
            return;
        }

        const profileType = session.user?.profileType;

        switch (profileType) {
            case UserRoles.TEACHER:
                router.replace('/dashboard/teacher');
                break;
            case UserRoles.PARENT:
                router.replace('/dashboard/parent');
                break;
            case UserRoles.STUDENT:
            default:
                router.replace('/dashboard/student');
                break;
        }
    }, [session, status, router]);

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Przekierowywanie...</p>
            </div>
        </div>
    );
}
