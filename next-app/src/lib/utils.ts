export function getRequiredEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}. Check your .env file.`);
  }
  return val;
}

export function parseGithubId(userId: string | undefined): number | null {
  if (!userId) return null;
  const id = parseInt(userId, 10);
  if (isNaN(id) || id <= 0) return null;
  return id;
}

export async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number } = {}): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...fetchOptions, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}
