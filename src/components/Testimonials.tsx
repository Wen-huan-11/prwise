'use client'

import { useLang } from '@/context/LangContext'
import { useState } from 'react'

export default function Testimonials() {
  const { t } = useLang()

  const testimonials = [
    { quote: 'testimonial_1_quote', author: 'testimonial_1_author', role: 'testimonial_1_role' },
    { quote: 'testimonial_2_quote', author: 'testimonial_2_author', role: 'testimonial_2_role' },
    { quote: 'testimonial_3_quote', author: 'testimonial_3_author', role: 'testimonial_3_role' },
  ]

  return (
    <section id="testimonials" className="py-24 px-4 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-500 text-sm font-semibold tracking-wide uppercase">{t('testimonials_label')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mt-3">{t('testimonials_title')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <svg className="w-8 h-8 text-brand-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>
              <p className="text-slate-300 mb-6 leading-relaxed">{t(item.quote)}</p>
              <div>
                <p className="text-slate-100 font-semibold">{t(item.author)}</p>
                <p className="text-slate-400 text-sm">{t(item.role)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
