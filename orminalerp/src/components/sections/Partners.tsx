import Link from 'next/link';
import { ArrowRight, Award, ExternalLink, GraduationCap, Headphones, Puzzle } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icon';
import { sectors } from '@/content/features';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function Partners({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const benefits = [
    { icon: Award, label: dict.partners.benefit1 },
    { icon: GraduationCap, label: dict.partners.benefit2 },
    { icon: Headphones, label: dict.partners.benefit3 },
  ];

  return (
    <section id="partners" className="scroll-mt-24 py-20 sm:py-24" style={{ background: 'var(--surface)' }}>
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto grid max-w-sm grid-cols-2 gap-4">
            {[
              'bg-amber-400 text-amber-900',
              'bg-brand-800 text-white/80',
              'bg-brand-800 text-white/80',
              'bg-amber-400 text-amber-900',
            ].map((tone, i) => (
              <div
                key={i}
                className={`flex aspect-square items-center justify-center rounded-2xl shadow-card transition duration-500 hover:-translate-y-1.5 hover:rotate-2 ${tone}`}
                style={{ animation: `float ${6 + i}s ease-in-out ${i * 0.4}s infinite` }}
              >
                <Puzzle className="h-12 w-12" />
              </div>
            ))}
            <span className="absolute inset-0 m-auto h-6 w-6 rounded-full bg-accent-500 ring-8 ring-[color:var(--surface)]" />
            <span className="absolute inset-0 m-auto h-6 w-6 animate-pulseRing rounded-full bg-accent-500/50" />
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.1}>
          <p className="chip bg-accent-50 text-accent-600 dark:bg-accent-500/10">{dict.partners.kicker}</p>
          <h2 className="section-title mt-4">
            {dict.partners.title} <span className="text-brand-600 dark:text-brand-300">Orminal ERP</span>
          </h2>
          <p className="muted mt-4 text-base leading-relaxed">{dict.partners.body}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {benefits.map(({ icon: Glyph, label }) => (
              <li key={label} className="chip border bg-transparent">
                <Glyph className="h-3.5 w-3.5 text-brand-500" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/partners/register`} className="btn-primary">
              {dict.partners.join}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link href={`/${locale}/partners/login`} className="btn-outline">
              {dict.partners.login}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="container-page mt-20">
        <Reveal className="text-center">
          <h3 className="section-title">
            {locale === 'ar' ? 'قطاعات الأعمال التي ' : 'Business sectors '}
            <span className="text-brand-600 dark:text-brand-300">
              {locale === 'ar' ? 'نخدمها' : 'we serve'}
            </span>
          </h3>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sectors.map((sector, i) => (
            <Reveal as="li" key={sector.id} delay={(i % 6) * 0.06}>
              <div className="card card-hover flex h-full flex-col items-center gap-3 p-4 text-center">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${sector.tone}`}>
                  <Icon name={sector.icon} className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold leading-snug">{sector.label[locale]}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
