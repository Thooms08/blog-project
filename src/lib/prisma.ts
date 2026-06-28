import { PrismaClient } from '@/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

function parseDbUrl(url: string) {
  // Format: mariadb://user:password@host:port/database
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: u.username,
    password: u.password,
    database: u.pathname.replace('/', ''),
  };
}

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;

  const config = dbUrl
    ? parseDbUrl(dbUrl)
    : {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'flavory_blog',
      };

  const adapter = new PrismaMariaDb({ ...config, connectionLimit: 5 });
  return new PrismaClient({ adapter, log: ['query'] });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
