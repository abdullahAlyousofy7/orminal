import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { termsSections, termsUpdated } from '@/content/terms';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'الشروط والأحكام — Orminal ERP' : 'Terms & conditions — Orminal ERP' };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="pb-16">
      <section className="hero-shell relative overflow-hidden py-16 text-white">
        <div className="absolute inset-0 bg-hero-grid [background-size:44px_44px] opacity-30" />
        <div className="container-page relative">
          <FileText className="h-9 w-9 text-sky2" />
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">{dict.terms.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">{dict.terms.intro}</p>
          <p className="mt-4 text-xs text-white/60">
            {dict.terms.updated}: <span dir="ltr">{termsUpdated}</span>
          </p>
        </div>
      </section>

      <div className="container-page mt-12 grid gap-10 lg:grid-cols-[260px_1fr]">
        <nav className="lg:sticky lg:top-24 lg:h-fit">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide muted">{dict.terms.toc}</p>
          <ul className="space-y-1.5 text-sm">
            {termsSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 font-semibold transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-white/5"
                >
                  {section.title[locale]}
                </a>
              </li>
            ))}
          </ul>
          <Link href={`/${locale}`} className="btn-outline mt-6 w-full">
            {dict.nav.backHome}
          </Link>
        </nav>

        <article className="space-y-8">
          {termsSections.map((section, i) => (
            <Reveal as="section" key={section.id} delay={Math.min(i * 0.05, 0.3)}>
              <div id={section.id} className="card scroll-mt-28">
                <h2 className="font-display text-lg font-bold text-brand-700 dark:text-brand-300">
                  {section.title[locale]}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((p, idx) => (
                    <p key={idx} className="muted text-sm leading-loose">
                      {p[locale]}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </article>
      </div>
    </div>
  );
}
