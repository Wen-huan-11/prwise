import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [users, repositories, reviews, findings] = await Promise.all([
    prisma.user.count(),
    prisma.repository.count(),
    prisma.review.count(),
    prisma.finding.count(),
  ]);

  return NextResponse.json({ users, repositories, reviews, findings });
}
