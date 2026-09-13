import { notFound } from 'next/navigation';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Partners } from '@/components/sections/Partners';
import { Knowledge } from '@/components/sections/Knowledge';
import { Pricing } from '@/components/sections/Pricing';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Features locale={locale} dict={dict} />
      <Partners locale={locale} dict={dict} />
      <Knowledge locale={locale} dict={dict} />
      <Pricing locale={locale} dict={dict} />
      <About locale={locale} dict={dict} />
      <Contact locale={locale} dict={dict} />
    </>
  );
}
