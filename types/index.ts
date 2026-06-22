// types/index.ts

import { Session } from "next-auth";

export type ChatSession = {
    _id: string;
    title: string;
    createdAt: string;
};

export type CustomSession = Session;