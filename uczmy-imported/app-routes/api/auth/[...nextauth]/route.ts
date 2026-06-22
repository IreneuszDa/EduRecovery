// THIS IS THE NEW, SIMPLIFIED CONTENT FOR: app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- Import from our new file!

const handler = NextAuth(authOptions);
console.log("NextAuth handler loaded");
console.log("authOptions", authOptions.providers?.length);

export { handler as GET, handler as POST };