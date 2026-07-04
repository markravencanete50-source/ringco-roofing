import Reveal from './Reveal';
import { reviews } from '@/lib/content';

/** Full review feed rendered as cards — fixes the empty-widget pattern. */
export default function ReviewsGrid({ filter }: { filter?: string }) {
  const list = filter ? reviews.filter((r) => r.service === filter) : reviews;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {list.map((r, i) => (
        <Reveal key={r.name + i} delay={(i % 3) * 0.06}>
          <figure className="flex h-full flex-col rounded-[18px] border border-line bg-card p-7 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
            <div className="mb-3 text-[16px] tracking-[0.1em] text-accent" aria-label={`${r.rating} out of 5 stars`}>
              {'★'.repeat(r.rating)}
            </div>
            <blockquote className="mb-5 flex-1 text-[15.5px] leading-relaxed text-ink">{r.quote}</blockquote>
            <figcaption className="flex items-center justify-between border-t border-line pt-4">
              <span>
                <span className="block font-display text-[15px] font-bold">{r.name}</span>
                <span className="text-[13px] text-muted">{r.role}</span>
              </span>
              <span className="rounded-full bg-[oklch(0.94_0.03_80)] px-2.5 py-1 font-display text-[11px] font-bold text-accent-deep">{r.service}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
