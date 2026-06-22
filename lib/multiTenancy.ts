// @/lib/multiTenancy.ts
// Multi-tenancy middleware for ensuring data isolation between schools

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import SchoolOrganization from "@/models/schoolOrganization";

/**
 * Get the current user's school context
 * Returns the school ID if the user belongs to a school, null otherwise
 */
export async function getSchoolContext(userId: string): Promise<string | null> {
    try {
        await connectMongoDB();
        const user = await User.findById(userId).select('school').lean();
        return user?.school?.toString() || null;
    } catch (error) {
        console.error("[MULTI_TENANCY] Error getting school context:", error);
        return null;
    }
}

/**
 * Verify that a user has access to a specific school's data
 */
export async function verifySchoolAccess(
    userId: string,
    targetSchoolId: string
): Promise<boolean> {
    try {
        await connectMongoDB();
        const user = await User.findById(userId).select('school profileType').lean();

        if (!user) return false;

        // User must belong to the same school
        if (user.school?.toString() !== targetSchoolId) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("[MULTI_TENANCY] Error verifying school access:", error);
        return false;
    }
}

/**
 * Get school settings for rate limiting and feature flags
 */
export async function getSchoolSettings(schoolId: string) {
    try {
        await connectMongoDB();
        const school = await SchoolOrganization.findById(schoolId)
            .select('settings apiUsageLimit currentApiUsage subscriptionStatus')
            .lean();

        return school;
    } catch (error) {
        console.error("[MULTI_TENANCY] Error getting school settings:", error);
        return null;
    }
}

/**
 * Increment API usage counter for a school
 * Used for ekonomia API - tracking usage to control costs
 */
export async function incrementSchoolApiUsage(schoolId: string): Promise<boolean> {
    try {
        await connectMongoDB();
        const school = await SchoolOrganization.findById(schoolId);

        if (!school) return false;

        // Check if limit exceeded
        if (school.currentApiUsage >= school.apiUsageLimit) {
            console.warn(`[MULTI_TENANCY] School ${schoolId} has exceeded API limit`);
            return false;
        }

        // Increment usage
        school.currentApiUsage += 1;
        await school.save();

        return true;
    } catch (error) {
        console.error("[MULTI_TENANCY] Error incrementing API usage:", error);
        return false;
    }
}

/**
 * API Route wrapper that ensures multi-tenancy isolation
 * Automatically injects school context into the handler
 */
export function withSchoolContext(
    handler: (
        req: NextRequest,
        session: any,
        schoolId: string
    ) => Promise<NextResponse>
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        try {
            const session = await getServerSession(authOptions);

            if (!session || !session.user) {
                return NextResponse.json(
                    { error: "Nie jesteś zalogowany.", code: "UNAUTHORIZED" },
                    { status: 401 }
                );
            }

            const schoolId = await getSchoolContext(session.user.id);

            if (!schoolId) {
                return NextResponse.json(
                    {
                        error: "Nie należysz do żadnej szkoły.",
                        code: "NO_SCHOOL_CONTEXT"
                    },
                    { status: 403 }
                );
            }

            // Check subscription status
            const schoolSettings = await getSchoolSettings(schoolId);
            if (schoolSettings?.subscriptionStatus === 'suspended') {
                return NextResponse.json(
                    {
                        error: "Subskrypcja szkoły jest zawieszona. Skontaktuj się z administratorem.",
                        code: "SUBSCRIPTION_SUSPENDED"
                    },
                    { status: 403 }
                );
            }

            return handler(req, session, schoolId);
        } catch (error) {
            console.error("[MULTI_TENANCY] Error in school context wrapper:", error);
            return NextResponse.json(
                { error: "Błąd kontekstu szkoły.", code: "CONTEXT_ERROR" },
                { status: 500 }
            );
        }
    };
}

/**
 * Build a MongoDB query filter that includes school isolation
 * Use this to ensure all queries are scoped to the user's school
 */
export function withSchoolFilter(
    schoolId: string,
    additionalFilter: Record<string, any> = {}
): Record<string, any> {
    return {
        school: schoolId,
        ...additionalFilter,
    };
}

/**
 * Validate that a document belongs to a specific school
 * Use before update/delete operations
 */
export async function validateDocumentOwnership(
    Model: any,
    documentId: string,
    schoolId: string
): Promise<boolean> {
    try {
        await connectMongoDB();
        const doc = await Model.findOne({
            _id: documentId,
            school: schoolId
        }).select('_id').lean();

        return !!doc;
    } catch (error) {
        console.error("[MULTI_TENANCY] Error validating document ownership:", error);
        return false;
    }
}
