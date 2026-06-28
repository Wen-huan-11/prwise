'use client';

import { useLang } from '@/context/LangContext';

const features = [
  { icon: '🔍', color: 'red', key: 'feature_1_title', descKey: 'feature_1_desc' },
  { icon: '🔒', color: 'yellow', key: 'feature_2_title', descKey: 'feature_2_desc' },
  { icon: '📊', color: 'blue', key: 'feature_3_title', descKey: 'feature_3_desc' },
  { icon: '⚡', color: 'green', key: 'feature_4_title', descKey: 'feature_4_desc' },
  { icon: '🎯', color: 'purple', key: 'feature_5_title', descKey: 'feature_5_desc' },
  { icon: '🔗', color: 'cyan', key: 'feature_6_title', descKey: 'feature_6_desc' },
];

const bgColors: Record<string, string> = {
  red: 'bg-red-500/10',
  yellow: 'bg-yellow-500/10',
  blue: 'bg-blue-500/10',
  green: 'bg-green-500/10',
  purple: 'bg-purple-500/10',
  cyan: 'bg-cyan-500/10',
};

export default function Features() {
  const { t } = useLang();

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">{t('features_label')}</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('features_title')}</h2>
      </div>
      <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.key} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className={`w-10 h-10 ${bgColors[f.color]} rounded-lg flex items-center justify-center text-lg`}>
              {f.icon}
            </div>
            <h3 className="text-base font-semibold text-white">{t(f.key)}</h3>
            <p className="text-sm text-slate-400">{t(f.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
