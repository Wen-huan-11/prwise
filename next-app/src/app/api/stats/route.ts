import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [users, repositories, reviews, findings] = await Promise.all([
    prisma.user.count(),
    prisma.repository.count(),
    prisma.review.count(),
    prisma.finding.count(),
  ]);

  return NextResponse.json({ users, repositories, reviews, findings });
}
