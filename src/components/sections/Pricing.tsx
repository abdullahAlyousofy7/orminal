'use client';

import Link from 'next/link';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';
import { compareGroups, plans, type CellValue, type Cycle, type PlanId } from '@/content/pricing';
import type { I18nText, Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

const toneRing: Record<string, string> = {
  brand: 'border-brand-500/40',
  accent: 'border-accent-500/60',
  navy: 'border-brand-900/40',
};

const toneBadge: Record<string, string> = {
  brand: 'bg-brand-600 text-white',
  accent: 'bg-accent-500 text-white',
  navy: 'bg-brand-900 text-white',
};

function Cell({ value, locale, dict }: { value: CellValue; locale: Locale; dict: Dictionary }) {
  if (value === true)
    return (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-white"
        title={dict.pricing.included}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  if (value === false)
    return (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-white"
        title={dict.pricing.notIncluded}
      >
        <X className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  if (typeof value === 'number') return <span className="font-bold">{value}</span>;
  return <span className="text-xs font-semibold">{(value as I18nText)[locale]}</span>;
}

export function Pricing({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [cycle, setCycle] = useState<Cycle>('annual');

  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-24" style={{ background: 'var(--surface)' }}>
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="chip mx-auto bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            {dict.pricing.kicker}
          </p>
          <h2 className="section-title mt-4">
            {dict.pricing.title} <span className="text-brand-600 dark:text-brand-300">Orminal ERP</span>
          </h2>
          <p className="muted mt-3 text-base leading-relaxed">{dict.pricing.subtitle}</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="inline-flex items-center rounded-full border p-1" style={{ background: 'var(--page)' }}>
            {(['monthly', 'annual'] as Cycle[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCycle(c)}
                aria-pressed={cycle === c}
                className={`relative rounded-full px-5 py-2 text-sm font-bold transition ${
                  cycle === c ? 'text-white' : 'muted hover:text-brand-600'
                }`}
              >
                {cycle === c && (
                  <motion.span
                    layoutId="cycle-pill"
                    className="absolute inset-0 rounded-full bg-brand-700"
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  />
                )}
                <span className="relative z-10">{c === 'monthly' ? dict.pricing.monthly : dict.pricing.annual}</span>
              </button>
            ))}
          </div>
          <span className="chip bg-accent-50 text-accent-600 dark:bg-accent-500/10">
            <Sparkles className="h-3.5 w-3.5" />
            {dict.pricing.savePercent}
          </span>
        </div>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const price = plan.price[cycle];
            const equivalent = cycle === 'annual' ? Math.round((price / 12) * 100) / 100 : price * 12;
            return (
              <motion.li
                key={plan.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div
                  className={`card card-hover relative flex h-full flex-col border-2 ${toneRing[plan.tone]} ${
                    plan.popular ? 'lg:-translate-y-3 shadow-lift' : ''
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 chip bg-accent-500 text-white shadow-lift">
                      {dict.pricing.popular}
                    </span>
                  )}
                  <span className={`chip self-start ${toneBadge[plan.tone]}`}>{plan.name[locale]}</span>
                  <p className="muted mt-3 min-h-[2.75rem] text-sm leading-relaxed">{plan.blurb[locale]}</p>

                  <div className="mt-5 flex items-end gap-1.5" dir="ltr">
                    <span className="font-display text-4xl font-extrabold">{price}</span>
                    <span className="pb-1 text-sm font-bold muted">USD</span>
                  </div>
                  <p className="muted mt-1 text-xs">
                    {cycle === 'annual' ? dict.pricing.perYear : dict.pricing.perMonth} —{' '}
                    {dict.pricing.equivalent} {equivalent} USD{' '}
                    {cycle === 'annual' ? dict.common.perMonthShort : dict.common.perYearShort}
                  </p>
                  <p className="mt-1 text-[11px] text-brand-600 dark:text-brand-300">{dict.pricing.taxNote}</p>

                  <div className="mt-6 grid gap-2">
                    <Link
                      href={`/${locale}/pricing/configure?plan=${plan.id}&cycle=${cycle}`}
                      className="btn-primary w-full"
                    >
                      {dict.pricing.buyNow}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                    <Link href={`/${locale}/trial`} className="btn-outline w-full">
                      {dict.pricing.tryFree}
                    </Link>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="section-title">{dict.pricing.compareTitle}</h3>
            <p className="muted mt-3 text-sm">{dict.pricing.compareSubtitle}</p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border shadow-card">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead className="sticky top-[70px] z-10" style={{ background: 'var(--surface)' }}>
                <tr>
                  <th className="w-[38%] p-4 text-start text-xs font-bold uppercase tracking-wide muted">
                    {dict.pricing.compareTitle}
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="p-4 text-center">
                      <span className={`chip ${toneBadge[plan.tone]}`}>{plan.name[locale]}</span>
                      <p className="mt-2 font-display text-lg font-extrabold" dir="ltr">
                        {plan.price[cycle]} USD
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareGroups.map((group) => (
                  <Fragment key={group.id}>
                    <tr className="bg-brand-50/80 dark:bg-brand-500/10">
                      <td colSpan={plans.length + 1} className="px-4 py-3 font-display text-sm font-extrabold text-brand-700 dark:text-brand-300">
                        {group.title[locale]}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={`${group.id}-${row.label.en}`} className="border-t transition hover:bg-brand-50/50 dark:hover:bg-white/5">
                        <td className="px-4 py-3 font-semibold">{row.label[locale]}</td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="px-4 py-3 text-center">
                            <Cell value={row.values[plan.id as PlanId]} locale={locale} dict={dict} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
