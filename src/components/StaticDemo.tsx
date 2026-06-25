'use client';

import { useLang } from '@/context/LangContext';

const codeLines = [
  { type: 'normal', text: 'function getUser(id) {' },
  { type: 'diff-remove', text: '  return fetch(`/api/users/${id}`).then(r => r.json())' },
  { type: 'diff-add', text: '  const res = await fetch(`/api/users/${id}`);' },
  { type: 'diff-add', text: '  if (!res.ok) throw new Error(\'Failed to fetch\');' },
  { type: 'diff-add', text: '  return res.json();' },
  { type: 'normal', text: '}' },
];

type ColorKey = 'red' | 'yellow' | 'green';

const findings: { key: string; color: ColorKey }[] = [
  { key: 'demo_finding_1', color: 'red' },
  { key: 'demo_finding_2', color: 'yellow' },
  { key: 'demo_finding_3', color: 'green' },
];

const colorMap: Record<ColorKey, { dot: string; bg: string; border: string; text: string }> = {
  red: { dot: 'bg-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
  yellow: { dot: 'bg-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  green: { dot: 'bg-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
};

export default function StaticDemo() {
  const { t } = useLang();

  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-brand-400 font-medium">{t('demo_label')}</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-10">{t('demo_title')}</h2>

        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-900/80 border-b border-slate-800">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-slate-500 font-mono">getUser.ts</span>
          </div>
          <div className="p-4 font-mono text-sm leading-relaxed">
            {codeLines.map((line, i) => {
              if (line.type === 'diff-remove') {
                return (
                  <div key={i} className="bg-red-900/20 text-red-300 -mx-4 px-4 py-0.5 border-l-2 border-red-500">
                    <span className="text-red-500 mr-3 select-none">-</span>{line.text}
                  </div>
                );
              }
              if (line.type === 'diff-add') {
                return (
                  <div key={i} className="bg-green-900/20 text-green-300 -mx-4 px-4 py-0.5 border-l-2 border-green-500">
                    <span className="text-green-500 mr-3 select-none">+</span>{line.text}
                  </div>
                );
              }
              return (
                <div key={i} className="text-slate-300 -mx-4 px-4 py-0.5">
                  <span className="text-slate-600 mr-3 select-none">{' '}</span>{line.text}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {findings.map((f) => {
            const c = colorMap[f.color];
            return (
              <div key={f.key} className={`${c.bg} ${c.border} border rounded-xl p-4 flex items-start gap-3`}>
                <span className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 shrink-0`} />
                <div>
                  <p className={`font-semibold text-sm ${c.text}`}>{t(`${f.key}_title`)}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{t(`${f.key}_desc`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
