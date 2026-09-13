import { NextResponse } from 'next/server';
import { computeQuote, sanitizeConfig } from '@/content/quote';
import { initiatePayment, myfatoorahConfig } from '@/lib/myfatoorah';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!data?.user) {
    return NextResponse.json({ error: 'auth' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { config?: unknown } | null;
  const config = sanitizeConfig(body?.config);
  if (!config) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const quote = computeQuote(config);
  if (quote.total <= 0) {
    return NextResponse.json({ error: 'amount' }, { status: 400 });
  }

  try {
    const methods = await initiatePayment(quote.total);
    return NextResponse.json({
      amount: quote.total,
      currency: myfatoorahConfig.currency,
      isTest: myfatoorahConfig.isTest,
      // Direct-payment methods expect card submission, not a redirect — hide them.
      methods: methods
        .filter((m) => !m.IsDirectPayment)
        .map((m) => ({
          id: m.PaymentMethodId,
          code: m.PaymentMethodCode,
          nameAr: m.PaymentMethodAr,
          nameEn: m.PaymentMethodEn,
          imageUrl: m.ImageUrl,
        })),
    });
  } catch (error) {
    console.log('[v0] InitiatePayment failed:', (error as Error).message);
    return NextResponse.json({ error: 'gateway' }, { status: 502 });
  }
}
