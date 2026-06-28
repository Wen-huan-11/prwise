import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { fetchPullRequestDiff } from '@/lib/github';
import { reviewDiff } from '@/lib/ai';
import { parseGithubId, getRequiredEnv, fetchWithTimeout } from '@/lib/utils';

const PR_URL_PATTERN = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/pull\/(\d+)$/;

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  const githubId = parseGithubId((session?.user as { id?: string } | undefined)?.id);
  if (!githubId) return null;
  return prisma.user.findUnique({ where: { githubId } });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: {
      repository: true,
      findings: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const body = await request.json();

  // ── Demo mode: review a raw code snippet (no auth required) ──
  if (body.code && typeof body.code === 'string') {
    if (body.code.length > 10000) {
      return NextResponse.json({ error: 'Code snippet exceeds 10KB limit for demo mode' }, { status: 413 });
    }
    try {
      const result = await reviewDiff(body.code, true, body.lang ?? 'zh');
      return NextResponse.json({
        status: 'COMPLETED',
        qualityScore: result.qualityScore,
        summary: result.summary,
        findingsCount: result.findings.length,
        findings: result.findings,
      });
    } catch (err) {
      return NextResponse.json({
        error: err instanceof Error ? err.message : 'Review failed',
      }, { status: 500 });
    }
  }

  // ── PR URL mode (requires login) ──
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prUrl } = body;

  if (!prUrl || typeof prUrl !== 'string') {
    return NextResponse.json({ error: 'Missing prUrl or code' }, { status: 400 });
  }

  const match = prUrl.match(PR_URL_PATTERN);
  if (!match) {
    return NextResponse.json(
      { error: 'Invalid PR URL. Expected: https://github.com/owner/repo/pull/123' },
      { status: 400 }
    );
  }

  const [, owner, repo, pullNumberStr] = match;
  const pullNumber = parseInt(pullNumberStr, 10);

  // ── Check review quota ──
  if (user.reviewsUsed >= user.reviewsLimit) {
    return NextResponse.json(
      { error: `Monthly review limit reached (${user.reviewsLimit}). Upgrade to Pro for unlimited reviews.` },
      { status: 403 }
    );
  }

  // ── Check for duplicate PR review ──
  const existing = await prisma.review.findFirst({
    where: {
      prNumber: pullNumber,
      repository: { fullName: `${owner}/${repo}` },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (existing && existing.status === 'COMPLETED') {
    return NextResponse.json(
      { error: `PR #${pullNumber} has already been reviewed.`, reviewId: existing.id },
      { status: 409 }
    );
  }

  let repository = await prisma.repository.findFirst({
    where: { fullName: `${owner}/${repo}` },
  });

  if (!repository) {
    const githubToken = getRequiredEnv('GITHUB_TOKEN');
    const repoRes = await fetchWithTimeout(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: { Authorization: `Bearer ${githubToken}` },
        timeout: 15000,
      }
    );
    if (!repoRes.ok) {
      return NextResponse.json({ error: 'Repository not found on GitHub' }, { status: 404 });
    }
    const repoData = await repoRes.json();

    repository = await prisma.repository.create({
      data: {
        githubId: repoData.id,
        name: repo,
        fullName: `${owner}/${repo}`,
        owner,
        private: repoData.private,
        userId: user.id,
      },
    });
  }

  const [review] = await prisma.$transaction([
    prisma.review.create({
      data: {
        prNumber: pullNumber,
        prTitle: `PR #${pullNumber}`,
        status: 'IN_PROGRESS',
        repositoryId: repository.id,
        userId: user.id,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { reviewsUsed: { increment: 1 } },
    }),
  ]);

  try {
    const diff = await fetchPullRequestDiff(owner, repo, pullNumber);

    const result = await reviewDiff(diff);

    const findings = await Promise.all(
      result.findings.map((f) =>
        prisma.finding.create({
          data: {
            severity: f.severity,
            title: f.title,
            description: f.description,
            filePath: f.filePath,
            lineStart: f.lineStart,
            lineEnd: f.lineEnd,
            suggestion: f.suggestion,
            reviewId: review.id,
          },
        })
      )
    );

    await prisma.review.update({
      where: { id: review.id },
      data: {
        diffUrl: `https://github.com/${owner}/${repo}/pull/${pullNumber}.diff`,
        status: 'COMPLETED',
        qualityScore: result.qualityScore,
        findingsCount: findings.length,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      reviewId: review.id,
      repository: { fullName: repository.fullName },
      prNumber: pullNumber,
      status: 'COMPLETED',
      qualityScore: result.qualityScore,
      summary: result.summary,
      findingsCount: findings.length,
      findings: result.findings,
    });
  } catch (err) {
    // Rollback the usage increment on failure
    await prisma.user.update({
      where: { id: user.id },
      data: { reviewsUsed: { decrement: 1 } },
    });

    await prisma.review.update({
      where: { id: review.id },
      data: { status: 'FAILED' },
    });
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Review failed',
      reviewId: review.id,
    }, { status: 500 });
  }
}
