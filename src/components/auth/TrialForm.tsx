'use client';

import { useState } from 'react';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { plans } from '@/content/pricing';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function TrialForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, subject: 'Free trial request', locale }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-accent-500/40 bg-accent-50 p-6 text-center dark:bg-accent-500/10">
        <CircleCheck className="mx-auto h-8 w-8 text-accent-500" />
        <p className="mt-3 text-sm font-semibold text-accent-600">{dict.trial.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="t-name">
          {dict.contact.name}
        </label>
        <input id="t-name" name="name" required className="field" autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="t-company">
          {dict.auth.companyName}
        </label>
        <input id="t-company" name="company" required className="field" autoComplete="organization" />
      </div>
      <div>
        <label className="label" htmlFor="t-email">
          {dict.contact.email}
        </label>
        <input id="t-email" name="email" type="email" required dir="ltr" className="field" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="t-phone">
          {dict.contact.phone}
        </label>
        <input id="t-phone" name="phone" required dir="ltr" className="field" autoComplete="tel" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="t-plan">
          {dict.configurator.plan}
        </label>
        <select id="t-plan" name="plan" className="field" defaultValue="professional">
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name[locale]}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="t-message">
          {dict.contact.message}
        </label>
        <textarea id="t-message" name="message" rows={4} className="field resize-y" />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status === 'sending'} className="btn-primary min-w-[10rem] disabled:opacity-60">
          {status === 'sending' ? dict.contact.sending : dict.trial.submit}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </button>
        {status === 'error' && <p className="text-sm font-semibold text-red-500">{dict.contact.error}</p>}
      </div>
    </form>
  );
}
