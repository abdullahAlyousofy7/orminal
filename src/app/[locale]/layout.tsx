import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { dir, isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === 'ar';
  const title = ar
    ? 'Orminal ERP — إدارة أعمالك بذكاء في مكان واحد'
    : 'Orminal ERP — run your business intelligently, in one place';
  const description = ar
    ? 'نظام ERP سحابي متكامل: محاسبة، مخزون، مبيعات ونقاط بيع، موارد بشرية، وتحليلات لحظية.'
    : 'An integrated cloud ERP: accounting, inventory, sales and POS, HR and real-time analytics.';

  return {
    metadataBase: new URL('https://orminal-erp.vercel.app'),
    title,
    description,
    keywords: ar
      ? ['نظام ERP', 'برنامج محاسبة', 'إدارة مخزون', 'نقاط بيع', 'Orminal']
      : ['ERP system', 'accounting software', 'inventory', 'POS', 'Orminal'],
    icons: { icon: '/logo.png' },
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: '/ar', en: '/en' },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: 'Orminal ERP',
      images: [{ url: '/og.svg', width: 1200, height: 630 }],
      locale: ar ? 'ar_YE' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.svg'] },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Cairo:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-[100dvh] flex-col">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
          >
            {locale === 'ar' ? 'تجاوز إلى المحتوى' : 'Skip to content'}
          </a>
          <Navbar locale={locale} dict={dict} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
        </Providers>
      </body>
    </html>
  );
}
