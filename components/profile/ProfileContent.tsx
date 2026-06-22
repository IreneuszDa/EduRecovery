"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Mail, Calendar } from "lucide-react";
import { formatRelative } from 'date-fns';
import { pl } from 'date-fns/locale';
import { UserProfile } from '@/app/dashboard/profile/page'; // Adjust the import path as needed
import DeleteAccountModal from './DeleteAccountModal';

// Helper to format dates like "dzisiaj o 14:30" or "wczoraj o 10:00"
const formatRelativeDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return formatRelative(date, new Date(), { locale: pl });
    } catch {
        return "Nieprawidłowa data";
    }
};

const ProfileContent = ({ profile }: { profile: UserProfile }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <>
            <main className="flex-1 bg-neutral-50 p-6 md:p-10 overflow-y-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-800">Twój Profil</h1>
                    <p className="text-neutral-500 mt-2">Zarządzaj informacjami o swoim koncie i śledź statystyki.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Info & Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-neutral-200/70 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-xl font-semibold text-neutral-700 mb-6">Informacje o Koncie</h2>
                            <dl className="space-y-6">
                                <InfoItem icon={User} label="Imię i nazwisko" value={profile.name} />
                                <InfoItem icon={Mail} label="Adres e-mail" value={profile.email} />
                                <InfoItem icon={Calendar} label="Ostatnie logowanie" value={formatRelativeDate(profile.lastLogin)} />
                            </dl>
                        </div>

                        <div className="bg-white border border-red-200/80 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Strefa Niebezpieczna</h2>
                            <p className="text-sm text-red-700/90 mb-5">Tej akcji nie można cofnąć. Prosimy o rozwagę.</p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            >
                                Usuń konto
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Stats Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-neutral-200/70 rounded-2xl p-8 h-full shadow-sm">
                            <h2 className="text-xl font-semibold text-neutral-700 mb-6">Twoje Statystyki</h2>
                            <div className="group flex items-center space-x-5 bg-neutral-100/70 p-5 rounded-xl border border-neutral-200/80">
                                {/* 1. Container is larger and has a gradient background */}
                                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-200">
                                    <Image
                                        src="/icons/fire2.png"
                                        alt="Ikona passy"
                                        // 2. Icon is larger
                                        width={40}
                                        height={40}
                                        // 3. Added flicker animation and enhanced glow/scale on hover
                                        className="animate-flicker drop-shadow-[0_4px_8px_rgba(255,140,50,0.4)] transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:drop-shadow-[0_5px_15px_rgba(255,140,50,0.6)]"
                                    />
                                </div>
                                <div>
                                    <p className="text-5xl font-bold text-neutral-800 tracking-tight">{profile.streakCount}</p>
                                    <p className="text-sm text-neutral-500">Dni passy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <DeleteAccountModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};

// A small component to keep the info list DRY
const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 text-neutral-400 mt-0.5 mr-5 flex-shrink-0" aria-hidden="true" />
        <div>
            <dt className="text-sm text-neutral-500">{label}</dt>
            <dd className="font-medium text-neutral-800 text-base">{value}</dd>
        </div>
    </div>
);

export default ProfileContent;