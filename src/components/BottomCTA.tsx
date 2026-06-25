'use client'

import { useLang } from '@/context/LangContext'
import { useState } from 'react'

export default function BottomCTA() {
  const { t } = useLang()

  return (
    <section id="install" className="py-24 px-4 bg-slate-950">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">{t('bottom_title')}</h2>
        <p className="text-slate-400 mt-4 mb-10 max-w-xl mx-auto">{t('bottom_sub')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-brand-500 hover:bg-brand-600 text-slate-900 font-semibold py-3 px-8 rounded-xl transition-colors">
            {t('bottom_cta')}
          </button>
          <button className="border border-slate-700 hover:border-slate-500 text-slate-100 font-semibold py-3 px-8 rounded-xl transition-colors">
            {t('bottom_doc')}
          </button>
        </div>
        <p className="text-slate-500 text-sm mt-8">{t('bottom_footnote')}</p>
      </div>
    </section>
  )
}
