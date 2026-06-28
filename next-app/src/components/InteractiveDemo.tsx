'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';

interface Finding {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  filePath: string | null;
  lineStart: number | null;
  lineEnd: number | null;
  suggestion: string | null;
}

interface ReviewResponse {
  status: string;
  qualityScore: number;
  summary: string;
  findingsCount: number;
  findings: Finding[];
}

const severityStyles: Record<string, { icon: string; border: string; bg: string; titleClass: string; iconClass: string }> = {
  ERROR: { icon: '✕', border: 'border-red-500/20', bg: 'bg-red-500/5', titleClass: 'text-red-300', iconClass: 'text-red-400' },
  WARNING: { icon: '⚠', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5', titleClass: 'text-yellow-300', iconClass: 'text-yellow-400' },
  INFO: { icon: '✓', border: 'border-green-500/20', bg: 'bg-green-500/5', titleClass: 'text-green-300', iconClass: 'text-green-400' },
};

export default function InteractiveDemo() {
  const { t, lang } = useLang();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleCode = `function getUser(id) {
  const data = fetch(\`/users/\${id}\`);
  return data.json();
}`;

  const loadSample = () => setCode(sampleCode);

  const startReview = async () => {
    if (!code.trim()) return;
    setStatus('loading');
    setStatusText('Parsing code...');
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, lang }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data: ReviewResponse = await res.json();
      setResult(data);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <section className="py-24 px-4 bg-slate-900/30" id="interactive">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <span className="text-sm uppercase tracking-widest text-slate-500 font-medium">{t('interactive_label')}</span>
          <h2 className="text-3xl sm:text-4xl font-bold">{t('interactive_title')}</h2>
          <p className="text-slate-400 text-sm">{t('interactive_sub')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="code-bg rounded-2xl border border-slate-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-600 ml-2 font-mono">code.ts</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-transparent text-slate-200 font-mono text-sm p-4 border-0 outline-none resize-none placeholder-slate-600 focus:ring-0"
                placeholder={t('interactive_placeholder')}
                spellCheck={false}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={startReview}
                disabled={status === 'loading' || !code.trim()}
                className="flex-1 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/25 text-sm"
              >
                {status === 'loading' ? t('interactive_btn_loading') : t('interactive_btn')}
              </button>
              <button
                onClick={loadSample}
                className="px-4 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl transition-all text-sm"
              >
                {t('interactive_sample_btn')}
              </button>
            </div>
          </div>

          <div className="code-bg rounded-2xl border border-slate-800 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="w-5 h-5 bg-brand-500 rounded flex items-center justify-center text-[10px] font-bold text-slate-950">AI</div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Review Results</span>
            </div>
            <div className="p-4 space-y-3 min-h-[200px]">
              {status === 'loading' && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <span className="font-mono text-xs">{statusText}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1">
                    <div className="bg-brand-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              )}
              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-red-300 text-sm font-medium">审查失败</div>
                  <div className="text-xs text-slate-500 mt-1">{errorMsg}</div>
                </div>
              )}
              {status === 'done' && result && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">质量评分</span>
                    <span className="text-sm font-bold text-brand-300">{result.qualityScore}/100</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{result.summary}</p>
                  {result.findings.length === 0 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-green-300 text-sm">✓ 未发现问题，代码质量很好！</div>
                    </div>
                  )}
                  {result.findings.map((f, i) => {
                    const s = severityStyles[f.severity] || severityStyles.INFO;
                    return (
                      <div
                        key={i}
                        className="review-item flex items-start gap-3 p-3 rounded-lg border"
                        style={{ borderColor: s.border.replace('border-', ''), background: s.bg.replace('bg-', '') }}
                      >
                        <span className={`${s.iconClass} shrink-0 mt-0.5 font-bold`}>{s.icon}</span>
                        <div className="min-w-0">
                          <div className={`${s.titleClass} font-medium text-sm`}>{f.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{f.description}</div>
                          {f.suggestion && (
                            <div className="text-xs text-slate-400 mt-1">💡 {f.suggestion}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {status === 'idle' && (
                <p className="text-sm text-slate-600 text-center py-8">{t('interactive_no_result')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
