import prisma from '@/lib/prisma';
import ClientDashboard from './ClientDashboard';

export default async function DashboardPage() {
  // Fetch data on server
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  const totalViews = posts.reduce((acc, post) => acc + post.views, 0);
  const totalBlog = posts.length;

  const initialData = { totalViews, totalBlog };

  return <ClientDashboard initialData={initialData} />;
}