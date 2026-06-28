'use client';

import { useLang } from '@/context/LangContext';

export default function DocsPage() {
  const { t } = useLang();
  const sections = [
    { titleKey: 'docs_quickstart_title', descKey: 'docs_quickstart_desc', time: '5 min' },
    { titleKey: 'docs_config_title', descKey: 'docs_config_desc', time: '10 min' },
    { titleKey: 'docs_api_title', descKey: 'docs_api_desc', time: '15 min' },
  ];

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold">{t('docs_title')}</h1>
          <p className="text-slate-400">{t('docs_sub')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((s, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition">
              <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center text-lg font-bold text-brand-400">{i + 1}</div>
              <h3 className="font-semibold">{t(s.titleKey)}</h3>
              <p className="text-sm text-slate-400">{t(s.descKey)}</p>
              <div className="text-xs text-slate-600">{s.time}</div>
            </div>
          ))}
        </div>
        <div className="mt-16 p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
          <p className="text-slate-400 text-sm">📄 完整文档正在编写中。如有问题请 <a href="#" className="text-brand-400 hover:underline">联系我们</a>。</p>
        </div>
      </div>
    </div>
  );
}
