'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  ChevronDown,
  Coins,
  FileText,
  LogIn,
  Users,
} from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

const orbs = [
  { icon: Coins, top: '12%', start: '8%', delay: 0, key: 'orbAccounting' as const },
  { icon: Boxes, top: '58%', start: '4%', delay: 0.6, key: 'orbInventory' as const },
  { icon: FileText, top: '30%', start: '78%', delay: 0.3, key: 'orbSales' as const },
  { icon: Users, top: '70%', start: '72%', delay: 0.9, key: 'orbHr' as const },
  { icon: BarChart3, top: '6%', start: '52%', delay: 1.2, key: 'orbReports' as const },
];

/** Hero: gradient shell, floating ERP glyphs, parallax dashboard preview. */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  const stats = [
    { value: '+1,250', label: dict.hero.statsClients },
    { value: '99.9%', label: dict.hero.statsUptime },
    { value: '+3,400', label: dict.hero.statsBranches },
    { value: '24/7', label: dict.hero.statsSupport },
  ];

  return (
    <section id="top" ref={ref} className="hero-shell relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid [background-size:52px_52px] opacity-40" />
      <div className="pointer-events-none absolute inset-0">
        {orbs.map(({ icon: Glyph, top, start, delay, key }) => (
          <motion.div
            key={key}
            className="absolute hidden lg:block"
            style={{ top, insetInlineStart: start }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay }}
          >
            <div className="glass animate-float rounded-2xl px-3 py-2.5 text-white/90" style={{ animationDelay: `${delay}s` }}>
              <div className="flex items-center gap-2">
                <Glyph className="h-4 w-4 text-sky2" />
                <span className="text-xs font-semibold">{dict.hero[key]}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div style={{ opacity: fade }} className="container-page relative z-10 pb-16 pt-14 text-center sm:pb-24 sm:pt-24">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="chip mx-auto border border-white/20 bg-white/10 text-white/90 backdrop-blur"
        >
          <BadgeCheck className="h-3.5 w-3.5 text-sky2" />
          {dict.hero.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mx-auto mt-6 max-w-4xl font-display text-[1.75rem] font-extrabold leading-[1.28] text-white xs:text-3xl sm:text-5xl sm:leading-[1.22] lg:text-6xl"
        >
          {dict.hero.titleLead} <span className="gradient-text">{dict.hero.titleHighlight}</span>{' '}
          {dict.hero.titleTail}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          {dict.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mx-auto mt-9 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center"
        >
          <Link
            href={`/${locale}/trial`}
            className="btn justify-center bg-white px-6 text-brand-800 hover:bg-sky2 hover:text-white"
          >
            {dict.hero.ctaTrial}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/login`}
            className="btn justify-center border border-white/25 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20"
          >
            <LogIn className="h-4 w-4" />
            {dict.hero.ctaLogin}
          </Link>
        </motion.div>

        <motion.div
          style={{ y }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.32 }}
          className="mx-auto mt-10 max-w-4xl sm:mt-14"
        >
          <DashboardPreview locale={locale} />
        </motion.div>

        <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
            >
              <p className="font-display text-2xl font-extrabold text-white sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-white/60">{s.label}</p>
            </motion.li>
          ))}
        </ul>

        <a
          href="#features"
          className="mt-12 inline-flex flex-col items-center gap-1 text-[11px] font-semibold text-white/60 transition hover:text-white"
        >
          {dict.common.scrollDown}
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </motion.div>

      <div
        className="absolute inset-x-0 bottom-0 h-16"
        style={{ background: 'linear-gradient(to top, var(--page), transparent)' }}
      />
    </section>
  );
}

/** Stylised product screenshot built with CSS only (no heavy image payload). */
function DashboardPreview({ locale }: { locale: Locale }) {
  const ar = locale === 'ar';
  const bars = [42, 68, 52, 84, 60, 92, 74];
  const rows = ar
    ? [
        ['فاتورة مبيعات #10428', 'الفرع الرئيسي', '2,480 USD'],
        ['أمر شراء #3391', 'مستودع صنعاء', '9,120 USD'],
        ['قيد يومية #77120', 'الحسابات العامة', '640 USD'],
      ]
    : [
        ['Sales invoice #10428', 'Main branch', '2,480 USD'],
        ['Purchase order #3391', "Sana'a warehouse", '9,120 USD'],
        ['Journal entry #77120', 'General ledger', '640 USD'],
      ];

  return (
    <div className="glass overflow-hidden rounded-3xl p-3 shadow-2xl">
      <div className="flex items-center gap-1.5 px-2 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-500/80" />
        <span className="ms-2 text-[10px] text-white/50">app.orminal-erp.com</span>
      </div>
      <div className="grid gap-3 rounded-2xl bg-white/95 p-4 text-start dark:bg-brand-950/90 sm:grid-cols-3">
        <div className="space-y-3 sm:col-span-2">
          <div className="flex items-end justify-between gap-2 rounded-xl border p-4">
            <div>
              <p className="text-[10px] muted">{ar ? 'إيرادات هذا الشهر' : 'Revenue this month'}</p>
              <p className="font-display text-xl font-extrabold text-[color:var(--ink)]">184,920 USD</p>
              <p className="text-[10px] font-semibold text-accent-500">+12.4%</p>
            </div>
            <div className="flex h-16 items-end gap-1.5">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="w-2.5 rounded-t bg-gradient-to-t from-brand-600 to-sky2"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <ul className="space-y-2">
            {rows.map(([a, b, c]) => (
              <li key={a} className="flex items-center justify-between rounded-xl border px-3 py-2.5 text-[11px]">
                <span className="font-semibold text-[color:var(--ink)]">{a}</span>
                <span className="muted hidden sm:inline">{b}</span>
                <span className="font-bold text-brand-600" dir="ltr">
                  {c}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          {[
            [ar ? 'صافي الربح' : 'Net profit', '38,410', 'text-accent-500'],
            [ar ? 'المخزون' : 'Inventory', '12,904', 'text-brand-600'],
            [ar ? 'مستحقات العملاء' : 'Receivables', '24,120', 'text-amber-500'],
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-xl border p-3">
              <p className="text-[10px] muted">{label}</p>
              <p className={`font-display text-base font-extrabold ${tone}`} dir="ltr">
                {value} USD
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
