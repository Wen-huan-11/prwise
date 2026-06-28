import { prisma } from './prisma';

type LogLevel = 'ERROR' | 'WARN' | 'INFO';

interface LogInput {
  level: LogLevel;
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  reviewId?: string;
}

export async function persistLog(input: LogInput): Promise<void> {
  try {
    await prisma.log.create({
      data: {
        level: input.level,
        source: input.source,
        message: input.message,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        userId: input.userId ?? null,
        reviewId: input.reviewId ?? null,
      },
    });
  } catch {
    // persistLog must never crash the caller; fallback to console
    console.error(`[log-fallback] ${input.level} ${input.source} ${input.message}`);
  }
}
