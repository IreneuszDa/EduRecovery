import prisma from '@/prisma';
export const connectToDatabase = async () => {
    try {
        await prisma.$connect();
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    }

}