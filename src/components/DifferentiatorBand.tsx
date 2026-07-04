import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { differentiators } from '@/lib/content';

/**
 * The genuine white-space claim no OKC competitor leads with: our own crew,
 * family-owned, straight talk on claims. Stated once, prominently.
 */
export default function DifferentiatorBand() {
  return (
    <section className="px-[6vw] py-20 md:py-28">
      <div className="mx-auto max-w-wrap">
        <SectionHead
          eyebrow="Why Ringco"
          title="The crew on your roof works for us — not a subcontractor you have never met."
          sub="It sounds simple. In the OKC metro, almost no one can actually say it."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {differentiators.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.08}>
              <div className="h-full rounded-[18px] border border-line bg-card p-7 shadow-[0_20px_40px_-32px_oklch(0.2_0.02_60/0.3)]">
                <div className="mb-4 h-1 w-10 rounded-full bg-accent" />
                <h3 className="mb-2.5 font-display text-[19px] font-bold">{d.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{d.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
