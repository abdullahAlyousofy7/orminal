import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { TrialForm } from '@/components/auth/TrialForm';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'تجربة مجانية — Orminal ERP' : 'Free trial — Orminal ERP' };
}

export default async function TrialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <AuthShell
      locale={locale}
      title={dict.trial.title}
      body={dict.trial.body}
      bullets={[dict.about.point1Body, dict.about.point2Body, dict.about.point3Body]}
    >
      <TrialForm locale={locale} dict={dict} />
    </AuthShell>
  );
}
