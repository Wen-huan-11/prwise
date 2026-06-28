import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { parseGithubId } from '@/lib/utils';

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const githubId = parseGithubId((session?.user as { id?: string } | undefined)?.id);
  if (!githubId) return null;
  return prisma.user.findUnique({ where: { githubId } });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const repos = await prisma.repository.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { reviews: true } },
    },
  });

  return NextResponse.json(repos);
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const repo = await prisma.repository.findFirst({
    where: { id, userId: user.id },
  });
  if (!repo) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
  }

  const reviewIds = await prisma.review.findMany({
    where: { repositoryId: id },
    select: { id: true },
  }).then((rows) => rows.map((r) => r.id));

  await prisma.$transaction([
    prisma.finding.deleteMany({ where: { reviewId: { in: reviewIds } } }),
    prisma.review.deleteMany({ where: { repositoryId: id } }),
    prisma.repository.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}
