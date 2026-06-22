import { NextRequest, NextResponse } from 'next/server';
import { setupAnimationDirectories } from '@/lib/animate/animations-setup';
import { installRequiredPackages } from '@/lib/animate/python-setup';

// Flag to prevent multiple initializations
let isInitialized = false;

// Initialize needed directories and packages when the application starts
if (!isInitialized) {
    console.log('Initializing animation system...');

    Promise.all([
        setupAnimationDirectories(),
        installRequiredPackages()
    ]).then(() => {
        console.log('Animation system initialized successfully');
        isInitialized = true;
    }).catch(error => {
        console.error('Failed to initialize animation system:', error);
    });
}

export async function GET(req: NextRequest) {
    return NextResponse.json({
        status: 'success',
        message: 'Server initialization triggered',
        initialized: isInitialized
    });
}
