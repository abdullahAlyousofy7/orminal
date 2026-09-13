import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';
import type { Locale } from '@/i18n/config';

/** Split auth layout: form on one side, motivational gradient panel on the other. */
export function AuthShell({
  locale,
  title,
  body,
  bullets,
  children,
  wide = false,
}: {
  locale: Locale;
  title: string;
  body: string;
  bullets: string[];
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="container-page py-12 sm:py-16">
      <div
        className={`mx-auto grid overflow-hidden rounded-3xl border shadow-card lg:grid-cols-[1fr_.85fr] ${
          wide ? 'max-w-6xl' : 'max-w-5xl'
        }`}
        style={{ background: 'var(--surface)' }}
      >
        <div className="p-7 sm:p-10">
          <div className="mb-7 lg:hidden">
            <Logo locale={locale} />
          </div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>
          <p className="muted mt-2 text-sm leading-relaxed">{body}</p>
          <div className="mt-7">{children}</div>
        </div>

        <aside className="hero-shell relative hidden flex-col justify-between p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-hero-grid [background-size:40px_40px] opacity-25" />
          <div className="relative">
            <Logo locale={locale} variant="inverse" />
            <p className="mt-10 font-display text-2xl font-extrabold leading-snug">
              {locale === 'ar'
                ? 'انطلق مع منصة تنمو بنمو أعمالك'
                : 'Grow with a platform that scales with you'}
            </p>
            <ul className="mt-7 space-y-3 text-sm text-white/80">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky2" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={`/${locale}`}
            className="relative inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowRight className="h-3.5 w-3.5 ltr:rotate-180" />
            {locale === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
          </Link>
        </aside>
      </div>
    </div>
  );
}
