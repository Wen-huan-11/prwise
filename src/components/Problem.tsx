'use client';

import { useLang } from '@/context/LangContext';

export default function Problem() {
  const { t } = useLang();

  return (
    <section id="problem" className="py-24 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">{t('problem_label')}</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('problem_title')}</h2>
      </div>
      <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
          <span className="text-3xl block">🐢</span>
          <h3 className="text-lg font-semibold text-white">{t('problem_1_title')}</h3>
          <p className="text-sm text-slate-400">{t('problem_1_desc')}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
          <span className="text-3xl block">🧠</span>
          <h3 className="text-lg font-semibold text-white">{t('problem_2_title')}</h3>
          <p className="text-sm text-slate-400">{t('problem_2_desc')}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
          <span className="text-3xl block">🔥</span>
          <h3 className="text-lg font-semibold text-white">{t('problem_3_title')}</h3>
          <p className="text-sm text-slate-400">{t('problem_3_desc')}</p>
        </div>
      </div>
      <p className="text-center text-sm text-slate-500 mt-8">{t('problem_footer')}</p>
    </section>
  );
}
