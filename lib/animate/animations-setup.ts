// @/lib/animate/animations-setup.ts
// Setup utilities for animation directories

import fs from 'fs';
import path from 'path';

/**
 * Setup required directories for animation rendering
 */
export async function setupAnimationDirectories(): Promise<void> {
    const directories = [
        'public/animations',
        'public/animations/temp',
        'public/animations/output',
    ];

    for (const dir of directories) {
        const fullPath = path.join(process.cwd(), dir);
        try {
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`[ANIMATIONS_SETUP] Created directory: ${fullPath}`);
            }
        } catch (error) {
            console.warn(`[ANIMATIONS_SETUP] Could not create directory ${fullPath}:`, error);
        }
    }

    console.log('[ANIMATIONS_SETUP] Animation directories setup complete');
}
