import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const FROM = process.env.CONTACT_FROM_EMAIL ?? 'Orminal ERP <onboarding@resend.dev>';
const TO = process.env.CONTACT_TO_EMAIL ?? 'orminalerp@gmail.com';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Contact + trial-request intake. Emails via Resend when RESEND_API_KEY is set. */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const email = String(payload.email ?? '');
  const name = String(payload.name ?? '');
  if (!/^\S+@\S+\.\S+$/.test(email) || !name.trim()) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Keep the UX intact on deployments without email credentials.
    console.info('[contact] RESEND_API_KEY missing — logging submission instead', {
      name,
      email,
      subject: payload.subject,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const rows = ['name', 'email', 'phone', 'company', 'plan', 'subject', 'message', 'locale']
    .filter((key) => payload[key])
    .map((key) => `<tr><td style="padding:6px 10px;color:#64748b">${key}</td><td style="padding:6px 10px"><b>${escapeHtml(payload[key])}</b></td></tr>`)
    .join('');

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Orminal ERP — ${String(payload.subject ?? 'New enquiry')}`,
      html: `<div style="font-family:system-ui,sans-serif"><h2 style="color:#0f4bab">Orminal ERP — new submission</h2><table style="border-collapse:collapse;font-size:14px">${rows}</table></div>`,
    });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error('[contact] send failed', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
