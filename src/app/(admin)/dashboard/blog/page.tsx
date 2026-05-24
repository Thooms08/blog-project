// app/dashboard/blog/page.tsx
import prisma from "@/lib/prisma";
import BlogListClient from "@/components/BlogListClient";

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  // Ambil semua data blog dari database
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <BlogListClient posts={posts} />;
}