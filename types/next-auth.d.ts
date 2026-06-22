// FILE: types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the built-in JWT interface
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        profileType: number; // <-- ADD THIS LINE
    }
}

// Extend the built-in Session interface
declare module "next-auth" {
    interface Session {
        error?: "RefreshAccessTokenError" | string;
        user: {
            id?: string;
            profileType?: number;
            [key: string]: any;
        };
    }
}

