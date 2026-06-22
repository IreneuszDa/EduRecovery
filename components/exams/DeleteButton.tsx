// components/exams/DeleteButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteButtonProps {
    examId: string;
}

export default function DeleteButton({ examId }: DeleteButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm('Czy na pewno chcesz usunąć ten egzamin? Tej operacji nie można cofnąć.');

        if (confirmed) {
            setIsDeleting(true);
            const apiUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

            try {
                const res = await fetch(`${apiUrl}/api/exams/${examId}`, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    throw new Error('Failed to delete the exam.');
                }

                router.push('/dashboard/exams');
                router.refresh();
            } catch (error) {
                console.error(error);
                alert('Wystąpił błąd podczas usuwania egzaminu.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-red-300 dark:disabled:bg-red-800 dark:disabled:text-red-400 disabled:cursor-not-allowed transition-colors"
        >
            <TrashIcon className="h-5 w-5 mr-2" />
            {isDeleting ? 'Usuwanie...' : 'Usuń'}
        </button>
    );
}