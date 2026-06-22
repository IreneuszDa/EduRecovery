import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { rateLimiter } from "@/lib/rate-limiter";

type UserFromDb = {
    _id: string;
    id: string;
    name: string;
    email: string;
    profileType: number;
    password?: string;
};

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                console.log("[AUTH] Authorize function started.");

                if (!credentials?.email || !credentials?.password) {
                    console.log("[AUTH-FAIL] Missing credentials (email or password).");
                    return null;
                }

                const { email, password } = credentials;
                // ✅ FIX: Access the header using bracket notation as `req.headers` is an object, not a Headers instance.
                const ip = req.headers?.["x-forwarded-for"] as string ?? "127.0.0.1";
                console.log(`[AUTH] Attempting login for email: ${email} from IP: ${ip}`);

                try {
                    // Rate limiting check
                    console.log(`[AUTH] Checking rate limit for IP: ${ip}`);
                    await rateLimiter.consume(ip);
                    console.log(`[AUTH] Rate limit check passed for IP: ${ip}`);

                    await connectMongoDB();
                    console.log(`[AUTH] Connected to MongoDB. Searching for user with email: ${email}`);
                    const user = await User.findOne({ email });

                    if (!user) {
                        console.log(`[AUTH-FAIL] User not found for email: ${email}. Aborting login.`);
                        return null;
                    }

                    console.log(`[AUTH] User found for email: ${email}. Comparing passwords...`);
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log(`[AUTH] Password comparison result: ${passwordsMatch ? "Match" : "No match"}`);

                    if (!passwordsMatch) {
                        console.log(`[AUTH-FAIL] Passwords do not match for user: ${email}. Aborting login.`);
                        return null;
                    }

                    // On successful login, reset the rate limiter
                    console.log(`[AUTH] Login successful for user: ${email}. Resetting rate limiter for IP: ${ip}.`);
                    await rateLimiter.delete(ip);

                    console.log(`[AUTH-SUCCESS] Returning user object for successful login: ${email}`);
                    return user; // On success, return the user object

                } catch (error: any) {
                    console.error("[AUTH-ERROR] An unexpected error occurred during authorization:", error);
                    // Handle rate limiting error specifically
                    if (error?.msBeforeNext) {
                        console.log(`[AUTH-FAIL] Rate limit exceeded for IP: ${ip}.`);
                        throw new Error("Too many login attempts. Please try again later.");
                    }
                    // Return null for other errors to prevent login
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            console.log(`[JWT Callback] Trigger: ${trigger}, User: ${!!user}, Session: ${!!session}`);
            if (user) {
                console.log("[JWT Callback] User object received. Populating token with user data.");
                const dbUser = user as UserFromDb;
                token.id = dbUser.id;
                token.profileType = dbUser.profileType;
            }
            console.log(`[JWT Callback] Returning token. Token ID: ${token.id}, ProfileType: ${token.profileType}`);
            return token;
        },
        async session({ session, token, trigger }) {
            console.log(`[Session Callback] Trigger: ${trigger}, Token: ${!!token}`);
            if (token && session.user) {
                console.log("[Session Callback] Token received. Populating session with token data.");
                session.user.id = token.id as string;
                session.user.profileType = token.profileType as number;
            }
            console.log(`[Session Callback] Returning session. Session user ID: ${session.user.id}, ProfileType: ${session.user.profileType}`);
            return session;
        },
    },
};
