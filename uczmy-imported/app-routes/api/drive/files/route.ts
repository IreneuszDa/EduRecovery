// FILE: app/api/drive/files/route.ts
// STATUS: VERIFIED

import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getAuthenticatedClient } from '@/lib/google';
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    const client = await getAuthenticatedClient(authOptions);

    if (!client) {
        return NextResponse.json({ error: "Authorization Required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folderIdsParam = searchParams.get('folderIds');

    try {
        const drive = google.drive({ version: 'v3', auth: client });

        let queryParts: string[] = [
            "trashed = false",
            "mimeType != 'application/vnd.google-apps.folder'"
        ];

        if (folderIdsParam) {
            const folderIds = folderIdsParam.split(',').filter(id => id.trim() !== '');
            if (folderIds.length > 0) {
                const parentQuery = folderIds.map(id => `'${id.trim()}' in parents`).join(' or ');
                queryParts.push(`(${parentQuery})`);
            }
        }

        const query = queryParts.join(' and ');

        const response = await drive.files.list({
            q: query,
            fields: 'nextPageToken, files(id, name, iconLink, webViewLink, modifiedTime)',
            pageSize: 50,
            orderBy: 'modifiedTime desc',
        });

        return NextResponse.json(response.data.files || []);

    } catch (error) {
        console.error("API Error during file fetch:", error);
        return NextResponse.json({ error: "Failed to load files from Google Drive." }, { status: 500 });
    }
}