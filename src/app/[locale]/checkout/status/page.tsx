import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
import { planById, type Cycle, type PlanId } from '@/content/pricing';
import { isLocale, pick, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'ar' ? 'حالة الدفع — Orminal ERP' : 'Payment status — Orminal ERP' };
}

type Subscription = {
  planId: PlanId;
  cycle: Cycle;
  amount: number;
  currency: string;
  status: string;
  startedAt: string;
  renewsAt: string;
};

export default async function CheckoutStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const { status = 'error' } = await searchParams;
  const success = status === 'success';

  const supabase = await getSupabaseServer();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  const subscription = (data?.user?.user_metadata as { subscription?: Subscription } | undefined)?.subscription;

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', { dateStyle: 'long' }).format(new Date(iso));

  const view = success
    ? { Icon: CircleCheck, tone: 'text-emerald-600', title: dict.checkout.statusSuccessTitle, body: dict.checkout.statusSuccessBody }
    : status === 'failed'
      ? { Icon: CircleX, tone: 'text-red-600', title: dict.checkout.statusFailedTitle, body: dict.checkout.statusFailedBody }
      : { Icon: CircleAlert, tone: 'text-amber-600', title: dict.checkout.statusErrorTitle, body: dict.checkout.statusErrorBody };

  const { Icon } = view;

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-xl">
        <div className="card text-center">
          <span className={`mx-auto inline-flex h-16 w-16 items-center justify-center ${view.tone}`}>
            <Icon className="h-16 w-16" strokeWidth={1.5} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">{view.title}</h1>
          <p className="muted mx-auto mt-3 max-w-md text-sm leading-relaxed">{view.body}</p>

          {success && subscription && (
            <dl className="mt-8 space-y-2 text-start">
              <Row label={dict.checkout.subPlan} value={pick(planById(subscription.planId).name, locale)} />
              <Row
                label={dict.configurator.cycle}
                value={subscription.cycle === 'annual' ? dict.pricing.annual : dict.pricing.monthly}
              />
              <Row label={dict.checkout.amountDue} value={`${subscription.amount} ${subscription.currency}`} ltr />
              <Row label={dict.checkout.subStarted} value={fmtDate(subscription.startedAt)} />
              <Row label={dict.checkout.subRenews} value={fmtDate(subscription.renewsAt)} />
            </dl>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {success ? (
              <Link href={`/${locale}/partners/dashboard`} className="btn-primary">
                {dict.checkout.goDashboard}
              </Link>
            ) : (
              <Link href={`/${locale}/pricing/configure`} className="btn-primary">
                {dict.checkout.retryPayment}
              </Link>
            )}
            <Link href={`/${locale}`} className="btn-outline">
              {dict.nav.backHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm">
      <dt className="muted">{label}</dt>
      <dd className="font-semibold" dir={ltr ? 'ltr' : undefined}>
        {value}
      </dd>
    </div>
  );
}
