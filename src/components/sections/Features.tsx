import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icon';
import { features } from '@/content/features';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function Features({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section id="features" className="container-page scroll-mt-24 py-20 sm:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="chip mx-auto bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
          {dict.features.kicker}
        </p>
        <h2 className="section-title mt-4">
          {dict.features.title} <span className="text-brand-600 dark:text-brand-300">Orminal ERP</span>
        </h2>
        <p className="muted mt-3 text-base leading-relaxed">{dict.features.subtitle}</p>
      </Reveal>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <Reveal as="li" key={feature.id} delay={(i % 4) * 0.08}>
            <article className="card card-hover group h-full">
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lift transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.tone}`}
              >
                <Icon name={feature.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{feature.title[locale]}</h3>
              <p className="muted mt-2 text-sm leading-relaxed">{feature.body[locale]}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
