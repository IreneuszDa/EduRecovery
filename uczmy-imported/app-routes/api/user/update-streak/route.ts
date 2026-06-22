// FILE: app/api/user/update-streak/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user'; // <-- The ONLY source for the User model

// Helper function to check if `today` is the day after `lastLogin`
// Your logic here was correct!
const areConsecutiveDays = (today: Date, lastLogin: Date): boolean => {
    const lastLoginDay = new Date(lastLogin);
    lastLoginDay.setHours(0, 0, 0, 0);

    const checkDay = new Date(lastLoginDay);
    checkDay.setDate(checkDay.getDate() + 1); // Get the day after lastLogin

    const todayDay = new Date(today);
    todayDay.setHours(0, 0, 0, 0);

    return todayDay.getTime() === checkDay.getTime();
}

// Helper function to check if two dates are the same calendar day
const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}


export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        await connectMongoDB();

        // Use the imported User model which has the full schema
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const today = new Date();
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;

        // Initialize streakCount if it doesn't exist
        if (typeof user.streakCount !== 'number') {
            user.streakCount = 0;
        }

        if (lastLogin) {
            // If already logged in today, do nothing to the streak.
            if (isSameDay(today, lastLogin)) {
                return NextResponse.json({ streakCount: user.streakCount, message: "Streak already updated today." });
            }

            // If the last login was yesterday, increment the streak.
            if (areConsecutiveDays(today, lastLogin)) {
                user.streakCount += 1;
            } else {
                // If they missed a day (or more), reset streak to 1.
                user.streakCount = 1;
            }
        } else {
            // First login ever, start the streak at 1.
            user.streakCount = 1;
        }

        // Update the last login date to now and save.
        user.lastLogin = today;
        await user.save();

        return NextResponse.json({ streakCount: user.streakCount });

    } catch (error) {
        console.error("Error updating streak:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}