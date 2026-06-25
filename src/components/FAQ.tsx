'use client'

import { useLang } from '@/context/LangContext'
import { useState } from 'react'

export default function FAQ() {
  const { t } = useLang()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const items = Array.from({ length: 8 }, (_, i) => i + 1)

  return (
    <section id="faq" className="py-24 px-4 bg-slate-900/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-500 text-sm font-semibold tracking-wide uppercase">{t('faq_label')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mt-3">{t('faq_title')}</h2>
        </div>
        <div className="space-y-3">
          {items.map((i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-slate-100 font-medium"
                >
                  <span>{t(`faq_q${i}`)}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`px-5 transition-all duration-200 ${isOpen ? 'pb-4' : 'h-0 pb-0 overflow-hidden'}`}>
                  {isOpen && <p className="text-slate-400 leading-relaxed">{t(`faq_a${i}`)}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
