import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { computeQuote, sanitizeConfig } from '@/content/quote';
import { executePayment, myfatoorahConfig } from '@/lib/myfatoorah';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const PENDING_COOKIE = 'orminal_checkout';

export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  const user = data?.user;
  if (!user) {
    return NextResponse.json({ error: 'auth' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { config?: unknown; paymentMethodId?: unknown; locale?: unknown }
    | null;

  const config = sanitizeConfig(body?.config);
  const paymentMethodId = Number(body?.paymentMethodId);
  const locale = body?.locale === 'en' ? 'en' : 'ar';

  if (!config || !Number.isInteger(paymentMethodId) || paymentMethodId <= 0) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const quote = computeQuote(config);
  if (quote.total <= 0) {
    return NextResponse.json({ error: 'amount' }, { status: 400 });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  if (!siteUrl) {
    console.log('[v0] NEXT_PUBLIC_SITE_URL is not set — cannot build MyFatoorah callback URL.');
    return NextResponse.json({ error: 'config' }, { status: 500 });
  }
  const callbackUrl = `${siteUrl}/api/checkout/callback?locale=${locale}`;

  const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
  const customerName = meta.contact_name || meta.company_name || user.email || 'Orminal Customer';

  try {
    const result = await executePayment({
      PaymentMethodId: paymentMethodId,
      InvoiceValue: quote.total,
      DisplayCurrencyIso: myfatoorahConfig.currency,
      CustomerName: customerName,
      CustomerEmail: user.email ?? undefined,
      CallBackUrl: callbackUrl,
      ErrorUrl: callbackUrl,
      Language: locale === 'ar' ? 'AR' : 'EN',
      CustomerReference: user.id,
      UserDefinedField: user.id,
    });

    // Stash the pending order so the callback can activate it after verification.
    const cookieStore = await cookies();
    cookieStore.set(
      PENDING_COOKIE,
      JSON.stringify({
        invoiceId: result.InvoiceId,
        userId: user.id,
        config,
        amount: quote.total,
        currency: myfatoorahConfig.currency,
      }),
      { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 },
    );

    return NextResponse.json({ paymentUrl: result.PaymentURL, invoiceId: result.InvoiceId });
  } catch (error) {
    console.log('[v0] ExecutePayment failed:', (error as Error).message);
    return NextResponse.json({ error: 'gateway' }, { status: 502 });
  }
}
