'use client';

import { useState } from 'react';
import { Headphones, Mail, MapPin, Phone, Send } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="container-page scroll-mt-24 pb-16 pt-20 sm:pb-24 sm:pt-24">
      <div className="overflow-hidden rounded-3xl border shadow-card" style={{ background: 'var(--surface)' }}>
        <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
          <div className="p-8 sm:p-10">
            <p className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              {dict.contact.kicker}
            </p>
            <h2 className="section-title mt-4">{dict.contact.title}</h2>
            <p className="muted mt-2 text-sm">{dict.contact.subtitle}</p>

            <form onSubmit={onSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="c-name">
                  {dict.contact.name}
                </label>
                <input id="c-name" name="name" required className="field" autoComplete="name" />
              </div>
              <div>
                <label className="label" htmlFor="c-email">
                  {dict.contact.email}
                </label>
                <input id="c-email" name="email" type="email" required className="field" autoComplete="email" />
              </div>
              <div>
                <label className="label" htmlFor="c-phone">
                  {dict.contact.phone}
                </label>
                <input id="c-phone" name="phone" className="field" autoComplete="tel" dir="ltr" />
              </div>
              <div>
                <label className="label" htmlFor="c-subject">
                  {dict.contact.subject}
                </label>
                <input id="c-subject" name="subject" required className="field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="c-message">
                  {dict.contact.message}
                </label>
                <textarea id="c-message" name="message" rows={5} required className="field resize-y" />
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button type="submit" disabled={status === 'sending'} className="btn-primary min-w-[9rem] disabled:opacity-60">
                  {status === 'sending' ? dict.contact.sending : dict.contact.send}
                  <Send className="h-4 w-4 rtl:-scale-x-100" />
                </button>
                {status === 'sent' && <p className="text-sm font-semibold text-accent-500">{dict.contact.success}</p>}
                {status === 'error' && <p className="text-sm font-semibold text-red-500">{dict.contact.error}</p>}
              </div>
            </form>
          </div>

          <div className="hero-shell relative p-8 text-white sm:p-10">
            <div className="absolute inset-0 bg-hero-grid [background-size:38px_38px] opacity-25" />
            <div className="relative space-y-6">
              <Headphones className="h-10 w-10 text-sky2" />
              <p className="font-display text-xl font-extrabold leading-snug">
                {locale === 'ar'
                  ? 'فريق الدعم والمبيعات جاهز للرد خلال ساعات العمل'
                  : 'Sales and support reply within working hours'}
              </p>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-sky2" />
                  <span>
                    <span className="block text-xs text-white/60">{dict.contact.emailUs}</span>
                    orminalerp@gmail.com
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-sky2" />
                  <span>
                    <span className="block text-xs text-white/60">{dict.contact.callUs}</span>
                    <span dir="ltr">+967 737 719 291</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-sky2" />
                  <span>
                    <span className="block text-xs text-white/60">{dict.contact.visitUs}</span>
                    {dict.contact.address}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
