"use client";

import React from 'react';

const SkeletonLoader = () => (
    <main className="flex-1 bg-neutral-50 p-6 md:p-10 animate-pulse">
        {/* Header Skeleton */}
        <header className="mb-10">
            <div className="h-10 bg-neutral-200 rounded-lg w-1/3 mb-3"></div>
            <div className="h-4 bg-neutral-200 rounded-md w-1/2"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Info Card Skeleton */}
                <div className="bg-white border border-neutral-200/70 rounded-2xl p-8">
                    <div className="h-6 bg-neutral-200 rounded-md w-1/4 mb-8"></div>
                    <div className="space-y-6">
                        <SkeletonItem />
                        <SkeletonItem />
                        <SkeletonItem />
                    </div>
                </div>
                {/* Danger Zone Skeleton */}
                <div className="bg-white border border-neutral-200/70 rounded-2xl p-8">
                    <div className="h-6 bg-neutral-200 rounded-md w-1/4 mb-3"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-2/3 mb-5"></div>
                    <div className="h-10 bg-neutral-200 rounded-lg w-32"></div>
                </div>
            </div>

            {/* Stats Card Skeleton */}
            <div className="lg:col-span-1">
                <div className="bg-white border border-neutral-200/70 rounded-2xl p-8 h-full">
                    <div className="h-6 bg-neutral-200 rounded-md w-1/3 mb-6"></div>
                    <div className="flex items-center space-x-5 bg-neutral-100/70 p-5 rounded-xl">
                        <div className="p-3.5 bg-neutral-200 rounded-full w-14 h-14"></div>
                        <div className="flex-1">
                            <div className="h-12 bg-neutral-200 rounded-md w-1/4 mb-2"></div>
                            <div className="h-4 bg-neutral-200 rounded-md w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
);

const SkeletonItem = () => (
    <div className="flex items-start">
        <div className="w-5 h-5 bg-neutral-200 rounded-full mr-5 flex-shrink-0"></div>
        <div className="flex-1">
            <div className="h-3 bg-neutral-200 rounded-md w-1/4 mb-2"></div>
            <div className="h-5 bg-neutral-200 rounded-md w-1/2"></div>
        </div>
    </div>
);

export default SkeletonLoader;