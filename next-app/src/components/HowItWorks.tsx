'use client';

import { useLang } from '@/context/LangContext';

const steps = [
  { key: 'how_step_1', descKey: 'how_step_1_desc' },
  { key: 'how_step_2', descKey: 'how_step_2_desc' },
  { key: 'how_step_3', descKey: 'how_step_3_desc' },
];

export default function HowItWorks() {
  const { t } = useLang();

  return (
    <section id="how" className="py-24 px-4 bg-slate-900/30">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">{t('how_label')}</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('how_title')}</h2>
      </div>
      <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-8 relative">
        <div className="hidden md:block absolute top-12 left-[calc(100%/6)] right-[calc(100%/6)] h-px bg-slate-700" />
        {steps.map((step, i) => (
          <div key={step.key} className="text-center space-y-4 relative">
            <div className="w-14 h-14 mx-auto bg-brand-500/10 border border-brand-500/20 rounded-full flex items-center justify-center text-lg font-bold text-brand-500">
              {i + 1}
            </div>
            <h3 className="text-lg font-semibold text-white">{t(step.key)}</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">{t(step.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
