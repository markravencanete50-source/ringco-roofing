import Reveal from './Reveal';
import { certs } from '@/lib/content';

export default function Certifications() {
  return (
    <section className="px-[6vw] pb-28">
      <div className="mx-auto grid max-w-wrap gap-6 md:grid-cols-3">
        {certs.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <div className="rounded-[18px] bg-card px-6 py-8 text-center shadow-[0_20px_40px_-28px_oklch(0.2_0.02_60/0.25)]">
              <div className={`mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full font-display text-[13px] font-bold ${c.kind === 'gaf' ? 'bg-accent text-accent-ink' : 'bg-blue text-[oklch(0.99_0.01_80)]'}`}>{c.badge}</div>
              <div className="mb-1.5 font-display text-[16px] font-bold">{c.title}</div>
              <p className="text-[14px] text-muted">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
