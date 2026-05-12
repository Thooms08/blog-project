import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
        const totalViews = posts.reduce((acc, post) => acc + post.views, 0);
        const totalBlog = posts.length;

        return NextResponse.json({ totalViews, totalBlog });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ totalViews: 0, totalBlog: 0 }, { status: 500 });
    }
}
