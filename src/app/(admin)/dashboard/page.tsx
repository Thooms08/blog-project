import prisma from '@/lib/prisma';
import ClientDashboard from './ClientDashboard';
import DashboardStats from './DashboardStats';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [aggregate, totalBlog] = await Promise.all([
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.count(),
  ]);

  const totalViews = aggregate._sum.views ?? 0;

  return (
    <ClientDashboard
      stats={<DashboardStats totalViews={totalViews} totalBlog={totalBlog} />}
    />
  );
}