'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm text-brand-300">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>{t('hero_badge')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span>{t('hero_title_1')}</span><br />
              <span className="gradient-text">{t('hero_title_2')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-lg">
              {t('hero_sub')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#install"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-xl hover:shadow-brand-500/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                <span>{t('hero_cta_1')}</span>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium px-6 py-3 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{t('hero_cta_2')}</span>
              </Link>
            </div>
            <p className="text-xs text-slate-500">{t('hero_footnote')}</p>
          </div>

          <div className="relative">
            <div className="glow absolute inset-0 rounded-2xl" />
            <div className="code-bg rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-600 ml-2 font-mono">PR #42 &middot; feat/user-auth</span>
              </div>
              <div className="p-4 space-y-3 text-sm font-mono leading-relaxed">
                <div className="diff-remove px-3 py-2 rounded text-slate-400">{'- function getUser(id) {'}</div>
                <div className="diff-remove px-3 py-2 rounded text-slate-400">{'-   const data = fetch(`/users/` + id);'}</div>
                <div className="diff-remove px-3 py-2 rounded text-slate-400">{'-   return data.json();'}</div>
                <div className="diff-remove px-3 py-2 rounded text-slate-400">{'- }'}</div>
                <div className="diff-add px-3 py-2 rounded text-slate-200">{'+ function getUser(id) {'}</div>
                <div className="diff-add px-3 py-2 rounded text-slate-200">{'+   if (!id) throw new Error(\'id is required\');'}</div>
                <div className="diff-add px-3 py-2 rounded text-slate-200">{'+   const data = await fetch(`/users/` + id);'}</div>
                <div className="diff-add px-3 py-2 rounded text-slate-200">{'+   return data.json();'}</div>
                <div className="diff-add px-3 py-2 rounded text-slate-200">{'+ }'}</div>
                <div className="mt-4 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 shrink-0 mt-0.5">AI</div>
                    <div className="space-y-1">
                      <div className="text-brand-300 font-semibold text-xs uppercase tracking-wider">{t('mockup_review_found')}</div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li className="flex items-start gap-2"><span className="text-yellow-400 shrink-0">{'\u26A0'}</span> <span>{t('mockup_item_1')}</span></li>
                        <li className="flex items-start gap-2"><span className="text-red-400 shrink-0">{'\u2715'}</span> <span>{t('mockup_item_2')}</span></li>
                        <li className="flex items-start gap-2"><span className="text-green-400 shrink-0">{'\u2713'}</span> <span>{t('mockup_item_3')}</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
