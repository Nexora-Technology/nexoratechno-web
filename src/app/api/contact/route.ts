import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactBody {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  subject?: string;
}

async function createTransporter() {
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

function validateBody(body: Partial<ContactBody>): string | null {
  if (!body.name?.trim()) return 'Name is required';
  if (!body.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Valid email is required';
  if (!body.message?.trim() || body.message.length < 10) return 'Message must be at least 10 characters';
  return null;
}

export async function POST(req: NextRequest) {
  // Log env vars on each request to verify they are loaded (mask password)
  console.log('[Contact API] ENV check:', {
    SMTP_HOST: process.env.SMTP_HOST || '(not set)',
    SMTP_PORT: process.env.SMTP_PORT || '(not set)',
    SMTP_USER: process.env.SMTP_USER || '(not set)',
    SMTP_PASS: process.env.SMTP_PASS ? '***' : '(not set)',
    SMTP_FROM: process.env.SMTP_FROM || '(not set)',
    CONTACT_TO: process.env.CONTACT_TO || '(not set, fallback to SMTP_USER)',
  });
  try {
    const body: ContactBody = await req.json();
    const validationError = validateBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const transporter = await createTransporter();

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      subject: `[Nexora Contact] ${body.subject || 'New inquiry'} from ${body.name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        ${body.company ? `<p><strong>Company:</strong> ${body.company}</p>` : ''}
        ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ''}
        ${body.subject ? `<p><strong>Subject:</strong> ${body.subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${body.message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: body.email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}