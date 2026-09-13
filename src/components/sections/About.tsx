import { Globe, ShieldCheck, TrendingUp } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function About({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const points = [
    { icon: Globe, title: dict.about.point1, body: dict.about.point1Body },
    { icon: ShieldCheck, title: dict.about.point2, body: dict.about.point2Body },
    { icon: TrendingUp, title: dict.about.point3, body: dict.about.point3Body },
  ];

  return (
    <section id="about" className="container-page scroll-mt-24 py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            {dict.about.kicker}
          </p>
          <h2 className="section-title mt-4">{dict.about.title}</h2>
          <p className="muted mt-4 text-base leading-relaxed">{dict.about.body}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {points.map(({ icon: Glyph, title, body }) => (
              <div key={title} className="card p-4">
                <Glyph className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                <dt className="mt-3 text-sm font-bold">{title}</dt>
                <dd className="muted mt-1 text-xs leading-relaxed">{body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="hero-shell relative overflow-hidden rounded-3xl p-8 text-white">
            <div className="absolute inset-0 bg-hero-grid [background-size:40px_40px] opacity-30" />
            <div className="relative">
              <p className="font-display text-2xl font-extrabold leading-snug">
                {locale === 'ar'
                  ? 'نظام رقمي واحد.. يدير أدق تفاصيل مؤسستك بذكاء'
                  : 'A single digital system.. managing the finest details of your organization by intelligently'}
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-6">
                {[
                  ['%100', locale === 'ar' ? 'تحكم مركزي' : 'Centralized Control'],
                  ['+8', locale === 'ar' ? 'وحدات تشغيلية' : 'Operational Modules'],
                  ['%99.9', locale === 'ar' ? 'توافر سحابي' : ' Cloud Uptime'],
                  ['+12', locale === 'ar' ? 'قطاعات مدعومة' : 'Supported Industries'],
                ].map(([value, label]) => (
                  <li key={label}>
                    <p className="font-display text-3xl font-extrabold text-sky2">{value}</p>
                    <p className="mt-1 text-xs text-white/70">{label}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
