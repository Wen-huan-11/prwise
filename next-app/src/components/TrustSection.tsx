'use client';

import { useLang } from '@/context/LangContext';

const languages = [
  'JS', 'TS', 'Python', 'Go', 'Rust', 'Java', 'Ruby',
  'C#', 'PHP', 'Swift', 'Kotlin', 'Scala', 'Shell', 'SQL', 'GraphQL',
];

export default function TrustSection() {
  const { t } = useLang();

  return (
    <section className="py-20 px-4 bg-slate-900/30 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-2">{t('trust_title')}</h2>
      <p className="text-slate-400 max-w-xl mx-auto mb-12">{t('trust_sub')}</p>
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3 mb-14">
        {languages.map((lang) => (
          <span
            key={lang}
            className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 text-sm text-slate-300 font-mono"
          >
            {lang}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>{t('trust_oss_1')}</span>
        <span className="text-slate-600">{t('trust_oss_2')}</span>
        <span>{t('trust_oss_3')}</span>
      </div>
    </section>
  );
}
