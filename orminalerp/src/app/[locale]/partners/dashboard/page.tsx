import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { BarChart3, Briefcase, CheckCircle2, Coins, Sparkles, Star } from 'lucide-react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { planById, type Cycle, type PlanId } from '@/content/pricing';
import { getSupabaseServer, supabaseServerConfigured } from '@/lib/supabase/server';
import { isLocale, pick, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'لوحة الشريك — Orminal ERP' : 'Partner dashboard — Orminal ERP' };
}

type PartnerRow = {
  company_name?: string | null;
  contact_name?: string | null;
  country?: string | null;
  city?: string | null;
  activity?: string | null;
  phone?: string | null;
};

type Subscription = {
  planId: PlanId;
  cycle: Cycle;
  amount: number;
  currency: string;
  status: string;
  modules?: string[];
  startedAt: string;
  renewsAt: string;
};

export default async function PartnerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  if (!supabaseServerConfigured) {
    return (
      <div className="container-page py-20">
        <div className="card mx-auto max-w-xl text-center">
          <h1 className="font-display text-xl font-bold">{dict.auth.dashboardTitle}</h1>
          <p className="muted mt-3 text-sm">{dict.auth.notConfigured}</p>
          <Link href={`/${locale}`} className="btn-outline mt-6">
            {dict.nav.backHome}
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await getSupabaseServer();
  const { data: auth } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  const user = auth?.user;
  if (!user) redirect(`/${locale}/partners/login`);

  const { data } = await supabase!.from('partners').select('*').eq('id', user.id).maybeSingle();
  const meta = (user.user_metadata ?? {}) as PartnerRow;
  const partner: PartnerRow = { ...meta, ...((data ?? {}) as PartnerRow) };

  const subscription = (user.user_metadata as { subscription?: Subscription } | undefined)?.subscription;
  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', { dateStyle: 'long' }).format(new Date(iso));

  const stats = [
    { icon: Briefcase, label: dict.auth.leads, value: '12' },
    { icon: BarChart3, label: dict.auth.deals, value: '4' },
    { icon: Coins, label: dict.auth.commission, value: '1,840 USD' },
    { icon: Star, label: dict.auth.tier, value: locale === 'ar' ? 'فضي' : 'Silver' },
  ];

  const profileRows: [string, string | null | undefined][] = [
    [dict.auth.companyName, partner.company_name],
    [dict.auth.contactName, partner.contact_name],
    [dict.auth.email, user.email],
    [dict.auth.phone, partner.phone],
    [dict.auth.country, partner.country],
    [dict.auth.city, partner.city],
    [dict.auth.activity, partner.activity],
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            {dict.auth.dashboardTitle}
          </p>
          <h1 className="section-title mt-3">
            {dict.auth.dashboardWelcome}
            {partner.company_name ? ` — ${partner.company_name}` : ''}
          </h1>
          <p className="muted mt-2 text-sm">{dict.auth.dashboardBody}</p>
        </div>
        <SignOutButton locale={locale} label={dict.auth.logout} />
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Glyph, label, value }) => (
          <li key={label} className="card">
            <Glyph className="h-5 w-5 text-brand-600 dark:text-brand-300" />
            <p className="muted mt-3 text-xs">{label}</p>
            <p className="font-display text-2xl font-extrabold" dir="ltr">
              {value}
            </p>
          </li>
        ))}
      </ul>

      <section className="card mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-300" />
            {dict.checkout.subTitle}
          </h2>
          {subscription && (
            <span className="chip inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {dict.checkout.subActive}
            </span>
          )}
        </div>

        {subscription ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                [dict.checkout.subPlan, pick(planById(subscription.planId).name, locale)],
                [
                  dict.configurator.cycle,
                  subscription.cycle === 'annual' ? dict.pricing.annual : dict.pricing.monthly,
                ],
                [dict.checkout.amountDue, `${subscription.amount} ${subscription.currency}`],
                [dict.checkout.subModules, String(subscription.modules?.length ?? 0)],
                [dict.checkout.subStarted, fmtDate(subscription.startedAt)],
                [dict.checkout.subRenews, fmtDate(subscription.renewsAt)],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm"
              >
                <dt className="muted">{label}</dt>
                <dd className="font-semibold" dir="ltr">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-5 text-sm">
            <p className="muted">{dict.checkout.subNone}</p>
            <Link href={`/${locale}/pricing/configure`} className="btn-outline">
              {dict.checkout.subBrowse}
            </Link>
          </div>
        )}
      </section>

      <section className="card mt-8">
        <h2 className="font-display text-lg font-bold">{dict.auth.profile}</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {profileRows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm">
              <dt className="muted">{label}</dt>
              <dd className="font-semibold">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
