import { getRequiredEnv, fetchWithTimeout } from './utils';

export async function fetchPullRequestDiff(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<string> {
  const token = getRequiredEnv('GITHUB_TOKEN');

  const res = await fetchWithTimeout(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3.diff' },
      timeout: 30000,
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch PR diff (HTTP ${res.status}) for ${owner}/${repo}#${pullNumber}`);
  return res.text();
}

/**
 * Post a review comment to a GitHub Pull Request.
 * Uses the GitHub PR Reviews API to create a formal review comment.
 */
export async function postPRReviewComment(
  owner: string,
  repo: string,
  pullNumber: number,
  body: string
): Promise<void> {
  const token = getRequiredEnv('GITHUB_TOKEN');

  const res = await fetchWithTimeout(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ body, event: 'COMMENT' }),
      timeout: 15000,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to post PR review comment (HTTP ${res.status}) for ${owner}/${repo}#${pullNumber}: ${errText}`);
  }
}
