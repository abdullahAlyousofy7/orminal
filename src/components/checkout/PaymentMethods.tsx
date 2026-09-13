'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export type CheckoutMethod = {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
};

export function PaymentMethods({
  locale,
  dict,
  amount,
  currency,
  methods,
  onSelect,
  selectingId,
  onBack,
  error,
  isTest,
}: {
  locale: Locale;
  dict: Dictionary;
  amount: number;
  currency: string;
  methods: CheckoutMethod[];
  onSelect: (id: number) => void;
  selectingId: number | null;
  onBack: () => void;
  error?: string;
  isTest?: boolean;
}) {
  const busy = selectingId !== null;

  return (
    <div className="pb-24">
      <section className="hero-shell relative overflow-hidden py-14 text-center text-white">
        <div className="absolute inset-0 bg-hero-grid [background-size:44px_44px] opacity-30" />
        <div className="container-page relative">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{dict.checkout.payTitle}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">{dict.checkout.paySubtitle}</p>
        </div>
      </section>

      <div className="container-page -mt-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={onBack} disabled={busy} className="btn-outline disabled:opacity-60">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {dict.checkout.back}
            </button>
            <div className="text-end">
              <p className="text-xs muted">{dict.checkout.amountDue}</p>
              <p className="font-display text-2xl font-extrabold text-brand-600 dark:text-brand-300" dir="ltr">
                {amount} {currency}
              </p>
            </div>
          </div>

          {/* Selected provider */}
          <div className="card flex items-center gap-4 border-2 border-brand-500 bg-brand-50/60 dark:bg-brand-500/10">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
              <Check className="h-5 w-5" />
            </span>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-900 text-white">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-lg font-bold">{dict.checkout.provider}</p>
              <p className="text-xs muted">{dict.checkout.providerNote}</p>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600 dark:bg-red-500/10">{error}</p>
          )}

          {/* Payment methods grid */}
          <div className="card">
            <h2 className="mb-1 font-display text-lg font-bold">{dict.checkout.provider}</h2>
            <p className="mb-4 text-xs muted">{dict.checkout.providerNote}</p>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {methods.map((method) => {
                const loading = selectingId === method.id;
                const name = locale === 'ar' ? method.nameAr : method.nameEn;
                return (
                  <li key={method.id}>
                    <motion.button
                      type="button"
                      whileHover={busy ? undefined : { y: -3 }}
                      onClick={() => onSelect(method.id)}
                      disabled={busy}
                      aria-busy={loading}
                      className="flex h-full w-full flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition hover:border-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex h-14 w-full items-center justify-center">
                        {loading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={method.imageUrl || '/placeholder.svg'}
                            alt={name}
                            className="max-h-12 w-auto object-contain"
                            loading="lazy"
                          />
                        )}
                      </span>
                      <span className="text-xs font-bold leading-snug">{name}</span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>

            {methods.length === 0 && <p className="py-8 text-center text-sm muted">{dict.checkout.noMethods}</p>}
          </div>

          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] muted">
            <ShieldCheck className="h-3.5 w-3.5" />
            {dict.checkout.secured}
            {isTest ? ` · ${dict.checkout.testMode}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
