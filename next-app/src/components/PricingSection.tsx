'use client'

import { useLang } from '@/context/LangContext'
import { useState } from 'react'

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function PricingSection() {
  const { t } = useLang()

  const plans = [
    {
      name: 'pricing_free_name',
      desc: 'pricing_free_desc',
      price: '$0',
      periodKey: 'pricing_per_month',
      features: [t('pricing_free_1'), t('pricing_free_2'), t('pricing_free_3')],
      cta: 'pricing_free_cta',
      popular: false,
    },
    {
      name: 'pricing_pro_name',
      desc: 'pricing_pro_desc',
      price: '$49',
      periodKey: 'pricing_per_month',
      features: [t('pricing_pro_1'), t('pricing_pro_2'), t('pricing_pro_3'), t('pricing_pro_4'), t('pricing_pro_5')],
      cta: 'pricing_pro_cta',
      note: t('pricing_pro_note'),
      popular: true,
    },
    {
      name: 'pricing_team_name',
      desc: 'pricing_team_desc',
      price: '$199',
      periodKey: 'pricing_per_month',
      features: [t('pricing_team_1'), t('pricing_team_2'), t('pricing_team_3'), t('pricing_team_4'), t('pricing_team_5')],
      cta: 'pricing_team_cta',
      note: t('pricing_team_note'),
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 px-4 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-500 text-sm font-semibold tracking-wide uppercase">{t('pricing_label')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mt-3">{t('pricing_title')}</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">{t('pricing_sub')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={
                plan.popular
                  ? 'bg-slate-900 border-2 border-brand-500 scale-105 rounded-2xl p-8 relative'
                  : 'bg-slate-900/50 border border-slate-800 rounded-2xl p-8'
              }
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-slate-900 text-xs font-bold px-4 py-1 rounded-full">
                  {t('pricing_pro_badge')}
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-100">{t(plan.name)}</h3>
              <p className="text-slate-400 text-sm mt-1">{t(plan.desc)}</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-bold text-slate-100">{plan.price}</span>
                <span className="text-slate-400 ml-1">{t(plan.periodKey)}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex gap-3 text-slate-300">
                    <CheckIcon />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                className={
                  plan.popular
                    ? 'w-full bg-brand-500 hover:bg-brand-600 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-colors'
                    : 'w-full border border-slate-700 hover:border-slate-500 text-slate-100 font-semibold py-3 px-6 rounded-xl transition-colors'
                }
              >
                {t(plan.cta)}
              </button>
              {plan.note && <p className="text-slate-500 text-xs text-center mt-3">{plan.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
