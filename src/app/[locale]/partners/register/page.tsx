import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { PartnerRegisterForm } from '@/components/auth/PartnerRegisterForm';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'إنشاء حساب شريك — Orminal ERP' : 'Create a partner account — Orminal ERP' };
}

export default async function PartnerRegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <AuthShell
      locale={locale}
      wide
      title={dict.auth.partnerRegisterTitle}
      body={dict.auth.partnerRegisterBody}
      bullets={[dict.partners.benefit1, dict.partners.benefit2, dict.partners.benefit3]}
    >
      <PartnerRegisterForm locale={locale} dict={dict} />
    </AuthShell>
  );
}
