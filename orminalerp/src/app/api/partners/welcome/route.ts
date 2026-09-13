import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const FROM = process.env.CONTACT_FROM_EMAIL ?? 'Orminal ERP <onboarding@resend.dev>';
const TEAM = process.env.CONTACT_TO_EMAIL ?? 'orminalerp@gmail.com';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orminal-erp.vercel.app';

/** Welcome email for a newly registered partner, plus an internal notification. */
export async function POST(request: Request) {
  let body: { email?: string; companyName?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const email = String(body.email ?? '');
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info('[partners/welcome] RESEND_API_KEY missing — skipping email', { email });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const ar = body.locale !== 'en';
  const company = body.companyName ?? '';
  const dashboard = `${SITE}/${ar ? 'ar' : 'en'}/partners/dashboard`;

  const html = ar
    ? `<div dir="rtl" style="font-family:system-ui,sans-serif;line-height:1.9">
        <h2 style="color:#0f4bab">مرحبًا بك في شبكة شركاء Orminal ERP</h2>
        <p>تم إنشاء حساب الشريك الخاص بـ <b>${company}</b> بنجاح.</p>
        <p>يمكنك الدخول إلى لوحة الشركاء ومتابعة عملائك وعروضك من الرابط التالي:</p>
        <p><a href="${dashboard}" style="background:#0f4bab;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none">لوحة الشركاء</a></p>
        <p style="color:#64748b;font-size:13px">سيتواصل معك فريق الشراكات لاستكمال التأهيل والتدريب.</p>
      </div>`
    : `<div style="font-family:system-ui,sans-serif;line-height:1.8">
        <h2 style="color:#0f4bab">Welcome to the Orminal ERP partner network</h2>
        <p>The partner account for <b>${company}</b> was created successfully.</p>
        <p>Open your partner dashboard to track clients and quotes:</p>
        <p><a href="${dashboard}" style="background:#0f4bab;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none">Partner dashboard</a></p>
        <p style="color:#64748b;font-size:13px">Our partnerships team will reach out for enablement and training.</p>
      </div>`;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: ar ? 'مرحبًا بك في شركاء Orminal ERP' : 'Welcome to Orminal ERP partners',
      html,
    });
    await resend.emails.send({
      from: FROM,
      to: TEAM,
      subject: `New partner registration — ${company || email}`,
      html: `<p>New partner: <b>${company}</b> (${email})</p>`,
    });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error('[partners/welcome] send failed', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
