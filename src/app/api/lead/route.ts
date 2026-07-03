import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';

export const runtime = 'nodejs';

type Body = {
  service?: string; timeline?: string; address?: string;
  name?: string; phone?: string; email?: string; notes?: string;
  company?: string; source?: string; page?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }

  // Honeypot: real users never fill this.
  if (body.company && body.company.trim() !== '') {
    return NextResponse.json({ ok: true }); // silently drop bots
  }

  const name = (body.name ?? '').trim();
  const phone = (body.phone ?? '').trim();
  if (name.length < 2 || phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ ok: false, error: 'Name and phone are required.' }, { status: 422 });
  }

  const lead = {
    name,
    phone,
    email: (body.email ?? '').trim(),
    service: (body.service ?? '').trim(),
    timeline: (body.timeline ?? '').trim(),
    address: (body.address ?? '').trim(),
    notes: (body.notes ?? '').trim(),
    source: (body.source ?? 'direct').slice(0, 200),
    page: (body.page ?? '').slice(0, 200),
    status: 'new',
    createdAt: FieldValue.serverTimestamp(),
  };

  try {
    await getAdminDb().collection('leads').add(lead);
  } catch (e) {
    console.error('Firestore write failed', e);
    return NextResponse.json({ ok: false, error: 'Could not save.' }, { status: 500 });
  }

  // Fire-and-forget email notification (won't block the response on failure).
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_TO) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.LEAD_NOTIFY_FROM ?? 'leads@ringcoroofing.com',
        to: process.env.LEAD_NOTIFY_TO,
        subject: `New lead: ${name} — ${lead.service || 'inquiry'}`,
        text: [
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Email: ${lead.email || '—'}`,
          `Service: ${lead.service || '—'}`,
          `Timeline: ${lead.timeline || '—'}`,
          `Address: ${lead.address || '—'}`,
          `Notes: ${lead.notes || '—'}`,
          `Source: ${lead.source}`,
        ].join('\n'),
      });
    } catch (e) {
      console.error('Email notify failed', e);
    }
  }

  return NextResponse.json({ ok: true });
}
