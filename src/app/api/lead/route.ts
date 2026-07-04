import { NextResponse } from 'next/server';

/**
 * Lead intake endpoint (stub).
 * TODO: wire to email (e.g. Resend) or a CRM webhook. Keep the response
 * shape { ok: true } — the form depends on it.
 */
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const name = String(data.name ?? '').trim();
  const phone = String(data.phone ?? '').trim();
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: 'name and phone are required' }, { status: 400 });
  }

  // For now: log the lead so it's visible in hosting logs.
  console.log('[lead]', JSON.stringify(data));

  return NextResponse.json({ ok: true });
}
