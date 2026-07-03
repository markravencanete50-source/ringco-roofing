import Reveal from './Reveal';
import { steps } from '@/lib/content';

export default function Process() {
  return (
    <section className="bg-panel px-[6vw] py-28">
      <div className="mx-auto max-w-wrap">
        <Reveal>
          <p className="eyebrow text-blue">The claim, handled</p>
          <h2 className="mt-3.5 max-w-[600px] font-display text-[clamp(28px,4vw,42px)] font-bold text-[oklch(0.98_0.01_80)]">Most roofers install. We manage the whole claim.</h2>
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[oklch(0.32_0.02_55)] font-display text-[15px] font-bold text-blue">{s.n}</div>
                <h3 className="mb-2.5 font-display text-[19px] font-bold text-[oklch(0.98_0.01_80)]">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-[oklch(0.68_0.02_60)]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
