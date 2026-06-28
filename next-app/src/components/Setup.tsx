'use client';

import { useLang } from '@/context/LangContext';

const steps = [
  { key: 'setup_step_1' },
  { key: 'setup_step_2' },
  { key: 'setup_step_3' },
];

export default function Setup() {
  const { t } = useLang();

  return (
    <section id="setup" className="py-24 px-4 bg-slate-900/30 text-center">
      <span className="text-xs uppercase tracking-widest text-brand-400 font-medium">{t('setup_label')}</span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-2">{t('setup_title')}</h2>
      <p className="text-slate-400 max-w-xl mx-auto mb-14">{t('setup_sub')}</p>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-left">
        {steps.map((s, i) => (
          <div key={s.key} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="w-8 h-8 bg-brand-500/20 text-brand-400 rounded-lg flex items-center justify-center text-sm font-bold mb-4">
              {i + 1}
            </div>
            <span className="text-xs uppercase tracking-wider text-brand-400/80 font-medium">{t(`${s.key}_label`)}</span>
            <h3 className="text-lg font-semibold mt-1 mb-2">{t(`${s.key}_title`)}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{t(`${s.key}_desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
