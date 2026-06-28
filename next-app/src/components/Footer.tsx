'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-slate-800/50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-500 rounded-lg flex items-center justify-center text-xs font-bold text-slate-950">P</div>
              <span className="font-semibold">PRwise</span>
            </div>
            <p className="text-slate-500 text-xs">{t('footer_desc')}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">{t('footer_product')}</h4>
            <ul className="space-y-2 text-slate-500">
              <li><Link href="/#features" className="hover:text-white transition">{t('footer_features')}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">{t('footer_pricing')}</Link></li>
              <li><Link href="/demo" className="hover:text-white transition">{t('footer_demo')}</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">{t('footer_resources')}</h4>
            <ul className="space-y-2 text-slate-500">
              <li><Link href="/docs" className="hover:text-white transition">{t('footer_docs')}</Link></li>
              <li><a href="#" className="hover:text-white transition">{t('footer_marketplace')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footer_api')}</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">{t('footer_company')}</h4>
            <ul className="space-y-2 text-slate-500">
              <li><Link href="/privacy" className="hover:text-white transition">{t('footer_privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">{t('footer_terms')}</Link></li>
              <li><a href="#" className="hover:text-white transition">{t('footer_contact')}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800/50 text-center text-xs text-slate-600">
          {t('footer_copyright')}
        </div>
      </div>
    </footer>
  );
}
