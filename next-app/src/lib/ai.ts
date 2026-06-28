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

function buildSystemPrompt(isSnippet: boolean, lang: string): string {
  const base = `You are an expert code reviewer. Analyze the provided code and identify bugs, security vulnerabilities, logic errors, and code quality issues.

For each issue found, return a JSON object with:
- severity: "ERROR" (definite bug/security issue), "WARNING" (potential issue), or "INFO" (suggestion)
- title: short description of the issue
- description: detailed explanation of why it's a problem
- filePath: the file path where the issue occurs, or null if unknown
- lineStart: the starting line number, or null if unknown
- lineEnd: the ending line number, or null if unknown
- suggestion: a concrete code suggestion to fix the issue, or null

Also provide:
- qualityScore: an integer from 0-100 rating the overall code quality
- summary: a one-sentence summary of the review

Respond with valid JSON only, no markdown. Format:
{"qualityScore": 85, "summary": "...", "findings": [...]}`;

  let extra = '';
  if (isSnippet) {
    extra += '\n\nNote: The user has submitted a raw code snippet (not a git diff). Review it as standalone code.';
  } else {
    extra += '\n\nNote: The input is a git diff. Use the diff header to determine file paths and line numbers.';
  }

  if (lang === 'zh') {
    extra += `\n\nImportant language rule: The user interface is in Chinese. You MUST return the review in Chinese:
- title, description, summary MUST be written in Chinese
- suggestion should be in Chinese, but any code examples inside suggestion MUST remain in English (do not translate variable names, function names, or API names)
- Keep technical terms in English if they have no common Chinese equivalent`;
  } else {
    extra += '\n\nRespond in English.';
  }

  return base + extra;
}

export async function reviewDiff(diff: string, isSnippet = false, lang = 'zh'): Promise<ReviewResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL ?? 'deepseek-chat';

  const label = isSnippet ? 'code snippet' : 'diff';

  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt(isSnippet, lang) },
        { role: 'user', content: `Review this ${label}:\n\n${diff}` },
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
