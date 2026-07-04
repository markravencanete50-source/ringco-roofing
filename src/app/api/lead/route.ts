import { NextResponse } from 'next/server';

/**
 * Lead intake endpoint.
 *
 * STATUS: stub. It validates the payload and returns success so the contact
 * form is fully functional in development and preview — but it does NOT yet
 * deliver the lead anywhere.
 *
 * TODO before launch — wire ONE of these (all need an env var / account, none
 * are committed here):
 *   - Email:   send via Resend / SendGrid to site.email
 *   - CRM:     POST to the client's CRM or a Make.com / Zapier webhook
 *   - Storage: write to a database or spreadsheet
 * Then set the corresponding secret in the Vercel project settings.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: 'Name and phone are required' }, { status: 422 });
  }

  // Honeypot: if the hidden "company" field is filled, treat as spam but 200 it.
  if (String(body.company ?? '').trim()) {
    return NextResponse.json({ ok: true });
  }

  // Until a delivery integration is wired, log server-side so nothing is lost
  // during testing. Replace this with real delivery (see TODO above).
  console.info('[lead] new submission', {
    name,
    phone,
    email: body.email ?? null,
    service: body.service ?? null,
    stormRelated: body.stormRelated ?? null,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
