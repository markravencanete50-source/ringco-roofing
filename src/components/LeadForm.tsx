'use client';
import { useState } from 'react';
import { clsx } from './clsx';

const SERVICES = ['Roof replacement', 'Roof repair', 'Storm / insurance claim', 'Siding', 'Gutters', 'Not sure yet'];
const TIMELINES = ['Emergency — leaking now', 'Within 2 weeks', 'This month', 'Just getting quotes'];

type Data = {
  service: string; timeline: string; address: string;
  name: string; phone: string; email: string; notes: string;
};

const empty: Data = { service: '', timeline: '', address: '', name: '', phone: '', email: '', notes: '' };

export default function LeadForm() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>(empty);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const set = (k: keyof Data, v: string) => setD((p) => ({ ...p, [k]: v }));

  const steps = ['Service', 'Property', 'Contact'];
  const canNext =
    (step === 0 && d.service && d.timeline) ||
    (step === 1 && d.address.trim().length > 3) ||
    step === 2;

  async function submit() {
    if (!d.name.trim() || !d.phone.trim()) return;
    setState('sending');
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...d,
          company: '', // honeypot (kept empty by real users)
          source: params.get('utm_source') ?? document.referrer ?? 'direct',
          page: window.location.pathname,
        }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done')
    return (
      <div className="rounded-3xl border border-line bg-card p-10 text-center shadow-[0_30px_60px_-40px_oklch(0.2_0.02_60/0.4)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent font-display text-2xl text-accent-ink">✓</div>
        <h3 className="mb-2 font-display text-[24px] font-bold">Request received.</h3>
        <p className="text-muted">Thanks, {d.name.split(' ')[0]}. We&rsquo;ll call you at {d.phone} shortly to lock in your free inspection.</p>
      </div>
    );

  return (
    <div className="rounded-3xl border border-line bg-card p-6 shadow-[0_30px_60px_-40px_oklch(0.2_0.02_60/0.4)] sm:p-9">
      <div className="mb-7 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={clsx('flex h-7 w-7 items-center justify-center rounded-full font-display text-[13px] font-bold transition-colors', i <= step ? 'bg-accent text-accent-ink' : 'bg-[oklch(0.9_0.01_75)] text-muted')}>{i + 1}</div>
            <span className={clsx('hidden text-[13px] font-semibold sm:block', i <= step ? 'text-ink' : 'text-muted')}>{s}</span>
            {i < steps.length - 1 && <div className={clsx('h-0.5 flex-1 rounded transition-colors', i < step ? 'bg-accent' : 'bg-[oklch(0.9_0.01_75)]')} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <label className="mb-2 block font-display text-[15px] font-bold">What do you need?</label>
          <div className="mb-6 grid grid-cols-2 gap-2.5">
            {SERVICES.map((s) => (
              <button key={s} onClick={() => set('service', s)} className={clsx('rounded-xl border px-4 py-3 text-left text-[14px] font-semibold transition-colors', d.service === s ? 'border-accent bg-[oklch(0.68_0.15_55/0.08)] text-ink' : 'border-line text-muted hover:border-accent-deep')}>{s}</button>
            ))}
          </div>
          <label className="mb-2 block font-display text-[15px] font-bold">How soon?</label>
          <div className="grid gap-2.5">
            {TIMELINES.map((t) => (
              <button key={t} onClick={() => set('timeline', t)} className={clsx('rounded-xl border px-4 py-3 text-left text-[14px] font-semibold transition-colors', d.timeline === t ? 'border-accent bg-[oklch(0.68_0.15_55/0.08)] text-ink' : 'border-line text-muted hover:border-accent-deep')}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <label className="mb-2 block font-display text-[15px] font-bold">Property address</label>
          <input value={d.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Main St, Oklahoma City, OK" className="mb-5 w-full rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-accent" />
          <label className="mb-2 block font-display text-[15px] font-bold">Anything we should know? <span className="font-body font-normal text-muted">(optional)</span></label>
          <textarea value={d.notes} onChange={(e) => set('notes', e.target.value)} rows={4} placeholder="Missing shingles after the last storm, water spot on the ceiling…" className="w-full resize-none rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-accent" />
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block font-display text-[15px] font-bold">Your name</label>
            <input value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Smith" className="w-full rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-2 block font-display text-[15px] font-bold">Phone</label>
            <input value={d.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" placeholder="(405) 555-0123" className="w-full rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-2 block font-display text-[15px] font-bold">Email <span className="font-body font-normal text-muted">(optional)</span></label>
            <input value={d.email} onChange={(e) => set('email', e.target.value)} inputMode="email" placeholder="jane@email.com" className="w-full rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-accent" />
          </div>
          {state === 'error' && <p className="text-[14px] font-semibold text-[oklch(0.55_0.2_25)]">Something went wrong. Please call us at (405) 470-7696.</p>}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button onClick={() => setStep((s) => s - 1)} className="font-display text-[14px] font-bold text-muted hover:text-ink">← Back</button>
        ) : <span />}
        {step < 2 ? (
          <button disabled={!canNext} onClick={() => setStep((s) => s + 1)} className="rounded-full bg-accent px-7 py-3.5 font-display text-[15px] font-bold text-accent-ink transition-colors hover:bg-accent-hi disabled:cursor-not-allowed disabled:opacity-40">Continue</button>
        ) : (
          <button disabled={!d.name.trim() || !d.phone.trim() || state === 'sending'} onClick={submit} className="rounded-full bg-accent px-7 py-3.5 font-display text-[15px] font-bold text-accent-ink transition-colors hover:bg-accent-hi disabled:cursor-not-allowed disabled:opacity-40">
            {state === 'sending' ? 'Sending…' : 'Get my free estimate'}
          </button>
        )}
      </div>
    </div>
  );
}
