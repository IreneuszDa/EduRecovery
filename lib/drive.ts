// lib/drive.ts

export type DriveFile = {
    id: string;
    name: string;
    webViewLink: string;
    iconLink: string;
    modifiedTime: string;
};

export type DriveFolder = {
    id: string;
    name: string;
};