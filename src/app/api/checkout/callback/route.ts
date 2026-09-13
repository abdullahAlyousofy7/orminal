import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/myfatoorah';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { CheckoutConfig } from '@/content/quote';
import { PENDING_COOKIE } from '../execute/route';

export const dynamic = 'force-dynamic';

type PendingOrder = {
  invoiceId: number;
  userId: string;
  config: CheckoutConfig;
  amount: number;
  currency: string;
};

/**
 * MyFatoorah redirects the customer here (CallBackUrl / ErrorUrl) after payment,
 * appending `paymentId`. We verify the real status, then activate the plan for
 * the signed-in user and start the subscription cycle.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'ar';
  const paymentId = url.searchParams.get('paymentId') || url.searchParams.get('PaymentId');

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || url.origin).replace(/\/+$/, '');
  const statusUrl = (status: string) => `${siteUrl}/${locale}/checkout/status?status=${status}`;

  const cookieStore = await cookies();
  const pendingRaw = cookieStore.get(PENDING_COOKIE)?.value;

  if (!paymentId) {
    return NextResponse.redirect(statusUrl('failed'));
  }

  try {
    const payment = await getPaymentStatus(paymentId);

    if (payment.InvoiceStatus !== 'Paid') {
      const res = NextResponse.redirect(statusUrl('failed'));
      res.cookies.delete(PENDING_COOKIE);
      return res;
    }

    const pending = pendingRaw ? (JSON.parse(pendingRaw) as PendingOrder) : null;
    const supabase = await getSupabaseServer();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    const user = data?.user;

    // Only activate when the verified invoice matches the pending order and user.
    if (
      user &&
      pending &&
      pending.userId === user.id &&
      pending.invoiceId === payment.InvoiceId
    ) {
      const startedAt = new Date();
      const renewsAt = new Date(startedAt);
      if (pending.config.cycle === 'annual') {
        renewsAt.setFullYear(renewsAt.getFullYear() + 1);
      } else {
        renewsAt.setMonth(renewsAt.getMonth() + 1);
      }

      const subscription = {
        planId: pending.config.planId,
        cycle: pending.config.cycle,
        modules: pending.config.selected,
        addons: pending.config.counts,
        amount: pending.amount,
        currency: pending.currency,
        status: 'active' as const,
        invoiceId: payment.InvoiceId,
        paymentId,
        startedAt: startedAt.toISOString(),
        renewsAt: renewsAt.toISOString(),
      };

      const { error } = await supabase!.auth.updateUser({ data: { subscription } });
      if (error) {
        console.log('[v0] Failed to persist subscription:', error.message);
      }
    }

    const res = NextResponse.redirect(statusUrl('success'));
    res.cookies.delete(PENDING_COOKIE);
    return res;
  } catch (error) {
    console.log('[v0] Payment verification failed:', (error as Error).message);
    return NextResponse.redirect(statusUrl('error'));
  }
}
