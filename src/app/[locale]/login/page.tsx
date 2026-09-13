import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'تسجيل الدخول — Orminal ERP' : 'Sign in — Orminal ERP' };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  // Only honor same-locale internal paths to avoid open-redirects.
  const { redirect } = await searchParams;
  const redirectTo =
    redirect && redirect.startsWith(`/${locale}/`) ? redirect : `/${locale}/partners/dashboard`;

  return (
    <AuthShell
      locale={locale}
      title={dict.auth.loginTitle}
      body={dict.auth.loginBody}
      bullets={[dict.about.point1Body, dict.about.point2Body, dict.about.point3Body]}
    >
      <LoginForm locale={locale} dict={dict} redirectTo={redirectTo} />
    </AuthShell>
  );
}
