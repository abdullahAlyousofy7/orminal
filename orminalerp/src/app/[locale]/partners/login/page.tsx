import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'تسجيل دخول الشركاء — Orminal ERP' : 'Partner sign in — Orminal ERP' };
}

export default async function PartnerLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <AuthShell
      locale={locale}
      title={dict.auth.partnerLoginTitle}
      body={dict.auth.partnerLoginBody}
      bullets={[dict.partners.benefit1, dict.partners.benefit2, dict.partners.benefit3]}
    >
      <LoginForm
        locale={locale}
        dict={dict}
        redirectTo={`/${locale}/partners/dashboard`}
        registerHref={`/${locale}/partners/register`}
      />
    </AuthShell>
  );
}
