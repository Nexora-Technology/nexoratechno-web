import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { parseContact, contactEmailHtml, contactSubject } from '@/lib/contact';

// CONTACT_DRY_RUN=1 renders the message without sending it (local development
// and tests); never set it in production.
function createTransporter() {
  if (process.env.CONTACT_DRY_RUN === '1') return nodemailer.createTransport({ jsonTransport: true });
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const MAX_BODY_BYTES = 20_000;

export async function POST(req: NextRequest) {
  if (Number(req.headers.get('content-length')) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  // Honeypot: the hidden `website` field is only ever filled in by bots.
  if (body && typeof body === 'object' && (body as { website?: unknown }).website) {
    return NextResponse.json({ success: true });
  }
  const parsed = parseContact(body);
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const info = await createTransporter().sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      subject: contactSubject(parsed.data),
      html: contactEmailHtml(parsed.data),
      replyTo: parsed.data.email,
    });
    // jsonTransport returns the rendered message instead of sending it.
    if (process.env.CONTACT_DRY_RUN === '1') console.info('[Contact API] dry run', (info as { message?: string }).message);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
