const DEEPSEEK_BASE = 'https://api.deepseek.com/v1';

interface FindingInput {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  filePath: string | null;
  lineStart: number | null;
  lineEnd: number | null;
  suggestion: string | null;
}

export interface ReviewResult {
  qualityScore: number;
  summary: string;
  findings: FindingInput[];
}

const SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the following git diff and identify bugs, security vulnerabilities, logic errors, and code quality issues.

For each issue found, return a JSON object with:
- severity: "ERROR" (definite bug/security issue), "WARNING" (potential issue), or "INFO" (suggestion)
- title: short description of the issue
- description: detailed explanation of why it's a problem
- filePath: the file path where the issue occurs (from the diff header), or null if unknown
- lineStart: the starting line number, or null if unknown
- lineEnd: the ending line number, or null if unknown
- suggestion: a concrete code suggestion to fix the issue, or null

Also provide:
- qualityScore: an integer from 0-100 rating the overall code quality
- summary: a one-sentence summary of the review

Respond with valid JSON only, no markdown. Format:
{"qualityScore": 85, "summary": "...", "findings": [...]}`;

export async function reviewDiff(diff: string): Promise<ReviewResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL ?? 'deepseek-chat';

  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Review this diff:\n\n${diff}` },
      ],
      max_tokens: 4096,
      temperature: 0.1,
    }),
  });

  if (!res.ok) throw new Error(`DeepSeek API error: ${res.status}`);

  const data = await res.json();
  let content: string;

  if (data.choices?.[0]?.message?.content) {
    content = data.choices[0].message.content;
  } else {
    throw new Error('Unexpected DeepSeek response format');
  }

  content = content.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();

  const parsed: ReviewResult = JSON.parse(content);

  return {
    qualityScore: parsed.qualityScore ?? 0,
    summary: parsed.summary ?? '',
    findings: Array.isArray(parsed.findings) ? parsed.findings : [],
  };
}
