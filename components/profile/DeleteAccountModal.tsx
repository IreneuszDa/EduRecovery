"use client";

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, Loader2 } from 'lucide-react';

type DeleteAccountModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        // ---
        // TODO: Add your API call to delete the user's account here
        // For example: await fetch('/api/user/delete', { method: 'DELETE' });
        // ---
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("Account deleted (simulation).");
        setIsDeleting(false);
        onClose();
        // TODO: Here you would typically sign the user out and redirect them.
        // For example: signOut({ callbackUrl: '/' });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-lg ring-1 ring-black/5 transition-all">
                            {/* ^-- Zmiany: p-6, shadow-lg, ring-1 ring-black/5 */}
                            <div className="flex items-start space-x-4">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-5">
                                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                                <div className="flex-1">
                                    {/* Zmiana na paletę kolorów 'slate' dla nowocześniejszego wyglądu */}
                                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-slate-900">
                                        Usuń konto
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        {/* Dodano 'leading-relaxed' dla lepszej czytelności i zmieniono kolor */}
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            Czy na pewno chcesz usunąć swoje konto? Wszystkie Twoje dane zostaną trwale usunięte. Tej operacji nie można cofnąć.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Zmniejszony margines dla spójności */}
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                {/* ^-- Zmiany: mt-6, gap-3 dla odstępów, usunięto sm:space-x-3 */}
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    // Dodano płynne przejścia i lepszy styl 'focus' dla dostępności
                                    className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:opacity-50"
                                    onClick={onClose}
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    // Dodano płynne przejścia i lepszy styl 'focus'
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                                    onClick={handleDelete}
                                >
                                    {isDeleting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        'Usuń'
                                    )}
                                </button>
                            </div>
                        </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DeleteAccountModal;