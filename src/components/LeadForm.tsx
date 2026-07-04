'use client';
import { useState } from 'react';
import { site } from '@/lib/content';

type State = 'idle' | 'submitting' | 'success' | 'error';

const services = ['Roof — storm/insurance', 'Roof — repair or replacement', 'Siding', 'Gutters', 'Not sure yet'];

/**
 * Lead capture with the one qualifying question (storm/insurance Y/N) so leads
 * route correctly internally. Posts to /api/lead. That endpoint is currently a
 * stub — see its TODO for wiring to email/CRM. No secrets are required to run.
 */
export default function LeadForm() {
  const [state, setState] = useState<State>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company) return; // honeypot filled → silently drop
    setState('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('bad status');
      setState('success');
      form.reset();
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-[20px] border border-line bg-card p-8 text-center shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
        <div className="mb-2 font-display text-[24px] font-bold">Thanks — we’ve got it.</div>
        <p className="text-[16px] text-muted">
          A member of our crew will reach out shortly. Need us now? Call{' '}
          <a href={`tel:${site.phone}`} className="font-bold text-accent-deep">{site.phoneDisplay}</a>.
        </p>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent-deep';

  return (
    <form onSubmit={onSubmit} className="rounded-[20px] border border-line bg-card p-6 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)] sm:p-8">
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-display text-[13px] font-bold text-ink">Name</span>
          <input name="name" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-display text-[13px] font-bold text-ink">Phone</span>
          <input name="phone" type="tel" required className={inputCls} />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block font-display text-[13px] font-bold text-ink">Email</span>
        <input name="email" type="email" className={inputCls} />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block font-display text-[13px] font-bold text-ink">Property address</span>
        <input name="address" className={inputCls} />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block font-display text-[13px] font-bold text-ink">What do you need?</span>
        <select name="service" className={inputCls} defaultValue="">
          <option value="" disabled>Choose one…</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      {/* The qualifying question — routes the lead internally */}
      <fieldset className="mt-5">
        <legend className="mb-2 font-display text-[13px] font-bold text-ink">Is this related to storm or insurance damage?</legend>
        <div className="flex gap-3">
          {['Yes', 'No', 'Not sure'].map((v) => (
            <label key={v} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-bg px-4 py-2.5 text-[14px] font-semibold has-[:checked]:border-accent has-[:checked]:bg-[oklch(0.94_0.03_80)] has-[:checked]:text-accent-deep">
              <input type="radio" name="stormRelated" value={v} className="accent-accent" defaultChecked={v === 'Not sure'} />
              {v}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block">
        <span className="mb-1.5 block font-display text-[13px] font-bold text-ink">Anything else? (optional)</span>
        <textarea name="message" rows={3} className={inputCls} />
      </label>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="mt-6 w-full rounded-full bg-accent px-8 py-4 font-display text-[16px] font-bold text-accent-ink transition-colors hover:bg-accent-hi disabled:opacity-60"
      >
        {state === 'submitting' ? 'Sending…' : 'Request my free inspection'}
      </button>

      {state === 'error' ? (
        <p className="mt-4 text-center text-[14px] text-accent-deep">
          Something went wrong. Please call{' '}
          <a href={`tel:${site.phone}`} className="font-bold underline">{site.phoneDisplay}</a> or email{' '}
          <a href={`mailto:${site.email}`} className="font-bold underline">{site.email}</a>.
        </p>
      ) : null}
    </form>
  );
}
