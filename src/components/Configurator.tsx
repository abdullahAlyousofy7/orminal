'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CircleCheck, Minus, Plus, Ticket } from 'lucide-react';
import { Icon } from '@/components/Icon';
import { PaymentMethods, type CheckoutMethod } from '@/components/checkout/PaymentMethods';
import { addons, discountCodes, moduleGroups, unitPrice } from '@/content/modules';
import { plans, type Cycle, type PlanId } from '@/content/pricing';
import { baseIncluded, type CheckoutConfig } from '@/content/quote';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type Counts = Record<'users' | 'branches' | 'warehouses' | 'employees', number>;

export function Configurator({
  locale,
  dict,
  initialPlan,
  initialCycle,
}: {
  locale: Locale;
  dict: Dictionary;
  initialPlan: PlanId;
  initialCycle: Cycle;
}) {
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [cycle, setCycle] = useState<Cycle>(initialCycle);
  const [selected, setSelected] = useState<string[]>(() => [...baseIncluded[initialPlan]]);
  const [counts, setCounts] = useState<Counts>({ users: 1, branches: 1, warehouses: 1, employees: 1 });
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [codeState, setCodeState] = useState<'idle' | 'ok' | 'bad'>('idle');

  const router = useRouter();
  const [step, setStep] = useState<'configure' | 'paying'>('configure');
  const [methods, setMethods] = useState<CheckoutMethod[]>([]);
  const [payAmount, setPayAmount] = useState(0);
  const [payCurrency, setPayCurrency] = useState('USD');
  const [isTest, setIsTest] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  const plan = plans.find((p) => p.id === planId) ?? plans[0];
  const included = baseIncluded[planId];

  function toggle(id: string) {
    if (included.includes(id)) return;
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function switchPlan(next: PlanId) {
    setPlanId(next);
    setSelected((prev) => Array.from(new Set([...baseIncluded[next], ...prev])));
  }

  const totals = useMemo(() => {
    const base = plan.price[cycle];
    const modulesTotal = moduleGroups
      .flatMap((g) => g.items)
      .filter((item) => selected.includes(item.id) && !included.includes(item.id))
      .reduce((sum, item) => sum + unitPrice(item.price, cycle), 0);
    const addonsTotal = addons.reduce(
      (sum, addon) => sum + unitPrice(addon.price, cycle) * Math.max(0, counts[addon.id] - 1),
      0,
    );
    const subtotal = base + modulesTotal + addonsTotal;
    const total = Math.round(subtotal * (1 - discount) * 100) / 100;
    return { base, modulesTotal: Math.round(modulesTotal * 100) / 100, addonsTotal: Math.round(addonsTotal * 100) / 100, total };
  }, [plan, cycle, selected, included, counts, discount]);

  function applyCode() {
    const rate = discountCodes[code.trim().toUpperCase()];
    if (rate) {
      setDiscount(rate);
      setCodeState('ok');
    } else {
      setDiscount(0);
      setCodeState('bad');
    }
  }

  function buildConfig(): CheckoutConfig {
    return { planId, cycle, selected, counts, code: codeState === 'ok' ? code : '' };
  }

  async function onContinue() {
    setCheckoutError('');
    setLoadingMethods(true);
    try {
      const res = await fetch('/api/checkout/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: buildConfig() }),
      });
      if (res.status === 401) {
        const back = `/${locale}/pricing/configure?plan=${planId}&cycle=${cycle}`;
        router.push(`/${locale}/login?redirect=${encodeURIComponent(back)}`);
        return;
      }
      if (!res.ok) {
        setCheckoutError(dict.checkout.methodsError);
        return;
      }
      const data = (await res.json()) as {
        amount: number;
        currency: string;
        isTest: boolean;
        methods: CheckoutMethod[];
      };
      setMethods(data.methods);
      setPayAmount(data.amount);
      setPayCurrency(data.currency);
      setIsTest(data.isTest);
      setStep('paying');
    } catch {
      setCheckoutError(dict.checkout.methodsError);
    } finally {
      setLoadingMethods(false);
    }
  }

  async function payWith(paymentMethodId: number) {
    setSelectingId(paymentMethodId);
    setCheckoutError('');
    try {
      const res = await fetch('/api/checkout/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: buildConfig(), paymentMethodId, locale }),
      });
      if (!res.ok) {
        setCheckoutError(dict.checkout.executeError);
        setSelectingId(null);
        return;
      }
      const data = (await res.json()) as { paymentUrl: string };
      // In the v0 preview the app runs inside a cross-origin iframe, so open the
      // gateway in a new tab; otherwise navigate the current tab.
      if (window.self !== window.top) {
        window.open(data.paymentUrl, '_blank', 'noopener');
        setSelectingId(null);
      } else {
        window.location.href = data.paymentUrl;
      }
    } catch {
      setCheckoutError(dict.checkout.executeError);
      setSelectingId(null);
    }
  }

  const cycleSuffix = cycle === 'annual' ? dict.configurator.perUnitYear : dict.configurator.perUnitMonth;

  if (step === 'paying') {
    return (
      <PaymentMethods
        locale={locale}
        dict={dict}
        amount={payAmount}
        currency={payCurrency}
        methods={methods}
        onSelect={payWith}
        selectingId={selectingId}
        onBack={() => {
          setStep('configure');
          setCheckoutError('');
        }}
        error={checkoutError}
        isTest={isTest}
      />
    );
  }

  return (
    <div className="pb-24">
      <section className="hero-shell relative overflow-hidden py-16 text-center text-white">
        <div className="absolute inset-0 bg-hero-grid [background-size:44px_44px] opacity-30" />
        <div className="container-page relative">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{dict.configurator.title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">{dict.configurator.subtitle}</p>
        </div>
      </section>

      <div className="container-page -mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="card">
            <p className="label">{dict.configurator.plan}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => switchPlan(p.id)}
                  aria-pressed={p.id === planId}
                  className={`rounded-xl border-2 p-3 text-start transition ${
                    p.id === planId
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'hover:border-brand-300'
                  }`}
                >
                  <span className="block text-sm font-bold">{p.name[locale]}</span>
                  <span className="muted mt-1 block text-xs" dir="ltr">
                    {p.price[cycle]} USD
                  </span>
                </button>
              ))}
            </div>

            <p className="label mt-5">{dict.configurator.cycle}</p>
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
                      layoutId="config-cycle"
                      className="absolute inset-0 rounded-full bg-brand-700"
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    />
                  )}
                  <span className="relative z-10">{c === 'monthly' ? dict.pricing.monthly : dict.pricing.annual}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold">{dict.configurator.modules}</h2>
              <p className="text-xs muted">
                {selected.length} {dict.configurator.selectedCount}
              </p>
            </div>

            <div className="space-y-6">
              {moduleGroups.map((group) => (
                <div key={group.id}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                      <Icon name={group.icon} className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-bold">{group.title[locale]}</h3>
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item) => {
                      const isIncluded = included.includes(item.id);
                      const isOn = selected.includes(item.id);
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => toggle(item.id)}
                            aria-pressed={isOn}
                            disabled={isIncluded}
                            className={`relative flex h-full w-full flex-col items-start gap-1 rounded-xl border-2 p-3 text-start transition ${
                              isOn
                                ? 'border-accent-500 bg-accent-50/70 dark:bg-accent-500/10'
                                : 'hover:border-brand-300'
                            } ${isIncluded ? 'cursor-default opacity-90' : ''}`}
                          >
                            <span className="absolute end-2 top-2">
                              {isOn ? (
                                <CircleCheck className="h-4 w-4 text-accent-500" />
                              ) : (
                                <span className="block h-4 w-4 rounded-full border" />
                              )}
                            </span>
                            <span className="pe-6 text-xs font-bold leading-snug">{item.label[locale]}</span>
                            <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-300" dir="ltr">
                              {isIncluded
                                ? dict.configurator.included
                                : `${unitPrice(item.price, cycle)} USD ${cycleSuffix}`}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 font-display text-lg font-bold">{dict.configurator.addons}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {addons.map((addon) => (
                <li
                  key={addon.id}
                  className="flex items-center justify-between gap-3 rounded-xl border p-3"
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                      <Icon name={addon.icon} className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs font-bold">{dict.configurator[addon.labelKey]}</span>
                      <span className="block text-[11px] muted" dir="ltr">
                        {unitPrice(addon.price, cycle)} USD {cycleSuffix}
                      </span>
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCounts((c) => ({ ...c, [addon.id]: Math.max(1, c[addon.id] - 1) }))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition hover:border-brand-400"
                      aria-label="-"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{counts[addon.id]}</span>
                    <button
                      type="button"
                      onClick={() => setCounts((c) => ({ ...c, [addon.id]: Math.min(999, c[addon.id] + 1) }))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white transition hover:bg-accent-600"
                      aria-label="+"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{dict.configurator.summary}</h2>
              <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {cycle === 'annual' ? dict.pricing.annual : dict.pricing.monthly}
              </span>
            </div>

            <dl className="space-y-2 text-sm">
              {[
                [`${dict.configurator.base} — ${plan.name[locale]}`, totals.base],
                [dict.configurator.modulesTotal, totals.modulesTotal],
                [dict.configurator.addonsTotal, totals.addonsTotal],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between gap-2">
                  <dt className="muted">{label as string}</dt>
                  <dd className="font-bold" dir="ltr">
                    {value as number} USD
                  </dd>
                </div>
              ))}
              {discount > 0 && (
                <div className="flex items-center justify-between gap-2 text-accent-500">
                  <dt>{dict.configurator.codeApplied}</dt>
                  <dd className="font-bold">-{Math.round(discount * 100)}%</dd>
                </div>
              )}
            </dl>

            <div>
              <label className="label" htmlFor="discount">
                {dict.configurator.discountCode}
              </label>
              <div className="flex gap-2">
                <input
                  id="discount"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeState('idle');
                  }}
                  className="field"
                  placeholder="ORMINAL10"
                  dir="ltr"
                />
                <button type="button" onClick={applyCode} className="btn-outline shrink-0 px-4">
                  <Ticket className="h-4 w-4" />
                  {dict.configurator.apply}
                </button>
              </div>
              {codeState === 'bad' && <p className="mt-1 text-xs text-red-500">{dict.configurator.invalidCode}</p>}
              {codeState === 'ok' && <p className="mt-1 text-xs text-accent-500">{dict.configurator.codeApplied}</p>}
            </div>

            <div className="flex items-end justify-between border-t pt-4">
              <span className="text-sm font-bold">{dict.configurator.total}</span>
              <motion.span
                key={totals.total}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl font-extrabold text-brand-600 dark:text-brand-300"
                dir="ltr"
              >
                {totals.total} USD
              </motion.span>
            </div>
            <p className="text-[11px] muted">{dict.pricing.taxNote}</p>

            {checkoutError && (
              <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-500/10">
                {checkoutError}
              </p>
            )}
            <button
              type="button"
              onClick={onContinue}
              disabled={loadingMethods}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loadingMethods ? dict.checkout.preparing : dict.configurator.continue}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>

            <Link href={`/${locale}#pricing`} className="block text-center text-xs font-semibold muted link-quiet">
              {dict.configurator.backToPricing}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
