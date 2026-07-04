'use client';
import { useMemo, useState } from 'react';
import { clsx } from './clsx';

const NEEDS = [
  { id: 'roofing', label: 'Roofing' },
  { id: 'siding', label: 'Siding' },
  { id: 'gutters', label: 'Gutters' },
  { id: 'not-sure', label: 'Not sure' },
];

const STORM = [
  { id: 'yes', label: 'Yes — storm damage' },
  { id: 'no', label: 'No' },
  { id: 'unsure', label: 'Not sure' },
];

type Status = 'idle' | 'sending' | 'done' | 'error';

function Chip({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={clsx(
        'flex items-center gap-2 rounded-full border-[1.5px] px-4 py-2.5 font-display text-[14px] font-bold transition-[background-color,border-color,color] duration-micro ease-out',
        selected
          ? 'border-accent bg-accent text-accent-ink'
          : 'border-line bg-card text-ink hover:border-accent-deep',
      )}
    >
      <span className={clsx('grid h-4 w-4 place-items-center rounded-full text-[10px] leading-none transition-colors duration-micro', selected ? 'bg-[oklch(1_0_0/0.25)]' : 'border border-line bg-transparent text-transparent')}>
        ✓
      </span>
      {label}
    </button>
  );
}

const inputCls =
  'w-full rounded-xl border-[1.5px] border-line bg-card px-4 py-3.5 text-[15.5px] text-ink outline-none transition-colors duration-micro placeholder:text-[oklch(0.62_0.015_60)] focus:border-accent';

/**
 * Lead form. Single page (no pagination — that increases drop-off), but a thin
 * top progress bar fills as fields are completed so a long form doesn't feel long.
 * Submit shows a loading state before confirmation.
 */
export default function LeadForm({ defaultService }: { defaultService?: string }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: '',
    need: NEEDS.some((n) => n.id === defaultService) ? (defaultService as string) : '',
    storm: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const progress = useMemo(() => {
    const checks = [
      form.name.trim().length > 1,
      form.phone.trim().length >= 7,
      form.email.includes('@'),
      form.address.trim().length > 4,
      form.need !== '',
      form.storm !== '',
    ];
    return checks.filter(Boolean).length / checks.length;
  }, [form]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-3xl border border-line bg-card p-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.62_0.10_160/0.15)] text-[24px] text-[oklch(0.5_0.10_160)]">✓</div>
        <h3 className="mb-2 font-display text-[26px] font-bold">Got it — we&rsquo;ll call you today.</h3>
        <p className="mx-auto max-w-[420px] text-[15.5px] text-muted">
          Your request is in. A real person (not a call center) will reach out within business hours — usually much sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative overflow-hidden rounded-3xl border border-line bg-card">
      {/* Progress-through-form cue: thin top border fills as fields complete */}
      <div className="h-1 w-full bg-[oklch(0.92_0.01_78)]">
        <div className="h-full bg-accent transition-[width] duration-comp ease-out" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="grid gap-5 p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="font-display text-[13.5px] font-bold">Name</span>
            <input className={inputCls} placeholder="Your name" value={form.name} onChange={set('name')} required autoComplete="name" />
          </label>
          <label className="grid gap-1.5">
            <span className="font-display text-[13.5px] font-bold">Phone</span>
            <input className={inputCls} type="tel" placeholder="(405) 555-0100" value={form.phone} onChange={set('phone')} required autoComplete="tel" />
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="font-display text-[13.5px] font-bold">Email</span>
            <input className={inputCls} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
          </label>
          <label className="grid gap-1.5">
            <span className="font-display text-[13.5px] font-bold">Property address</span>
            <input className={inputCls} placeholder="Street, city" value={form.address} onChange={set('address')} required autoComplete="street-address" />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2.5 font-display text-[13.5px] font-bold">What do you need?</legend>
          <div className="flex flex-wrap gap-2.5">
            {NEEDS.map((n) => (
              <Chip key={n.id} label={n.label} selected={form.need === n.id} onClick={() => setForm((f) => ({ ...f, need: n.id }))} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2.5 font-display text-[13.5px] font-bold">Is this storm-related?</legend>
          <div className="flex flex-wrap gap-2.5">
            {STORM.map((n) => (
              <Chip key={n.id} label={n.label} selected={form.storm === n.id} onClick={() => setForm((f) => ({ ...f, storm: n.id }))} />
            ))}
          </div>
        </fieldset>

        <label className="grid gap-1.5">
          <span className="font-display text-[13.5px] font-bold">Anything else? <span className="font-body text-[12.5px] font-semibold text-muted">(optional)</span></span>
          <textarea className={clsx(inputCls, 'min-h-[96px] resize-y')} placeholder="Leak location, storm date, insurance carrier…" value={form.message} onChange={set('message')} />
        </label>

        <button
          type="submit"
          disabled={status === 'sending'}
          className={clsx(
            'mt-1 flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-4 font-display text-[16px] font-bold text-accent-ink transition-[background-color,transform,box-shadow] duration-micro ease-out',
            status === 'sending' ? 'cursor-wait opacity-85' : 'hover:-translate-y-0.5 hover:bg-accent-hi hover:shadow-[0_12px_30px_-8px_oklch(0.62_0.155_40/0.55)]',
          )}
        >
          {status === 'sending' ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[oklch(1_0_0/0.4)] border-t-[oklch(1_0_0)]" />
              Sending…
            </>
          ) : (
            'Request my free estimate'
          )}
        </button>
        {status === 'error' ? (
          <p className="text-center text-[14px] font-semibold text-accent-deep">Something went wrong — please call us instead, or try again.</p>
        ) : null}
        <p className="text-center text-[12.5px] text-muted">Free, no-obligation. We never share your information.</p>
      </div>
    </form>
  );
}
