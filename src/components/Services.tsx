import Link from 'next/link';
import Image from 'next/image';
import Reveal from './Reveal';
import { services } from '@/lib/content';

export default function Services() {
  return (
    <section className="relative overflow-hidden px-[6vw] pb-24 pt-28">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-16 -top-20 h-[440px] w-[440px] animate-drift1 rounded-full bg-[radial-gradient(circle,oklch(0.68_0.15_55/0.16),transparent_68%)] blur-[22px]" />
        <div className="absolute -bottom-28 -right-14 h-[520px] w-[520px] animate-drift2 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.13_230/0.12),transparent_68%)] blur-[26px]" />
        <div className="absolute inset-0 bg-[linear-gradient(oklch(0.5_0.02_60/0.05)_1px,transparent_1px),linear-gradient(90deg,oklch(0.5_0.02_60/0.05)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(circle_at_50%_30%,#000_0%,transparent_72%)]" />
      </div>

      <div className="relative z-[1] mx-auto max-w-wrap">
        <Reveal>
          <p className="eyebrow text-[oklch(0.6_0.15_55)]">What we do</p>
          <h2 className="mb-4 mt-3.5 max-w-[640px] font-display text-[clamp(30px,4vw,46px)] font-bold">Built for Oklahoma&rsquo;s worst weather, finished to the highest standard.</h2>
          <p className="max-w-[600px] text-[17px] text-muted">Four core services, one accountable crew. No subcontractor guesswork — just work we stand behind for 15 years.</p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08}>
              <div className="group relative h-full">
                <div className="relative z-[1] flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_18px_40px_-30px_oklch(0.2_0.02_60/0.4)] transition-transform duration-500 group-hover:-translate-y-1.5">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={s.image} alt={s.title} fill sizes="(max-width:768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute left-3.5 top-3.5 z-[2] rounded-full bg-[oklch(0.99_0.005_80/0.92)] px-3 py-1.5 font-display text-[11px] font-bold tracking-wide text-[oklch(0.2_0.02_55)]">{s.tag}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2.5 font-display text-[21px] font-bold">{s.title}</h3>
                    <p className="mb-4 flex-1 text-[15px] text-muted">{s.blurb}</p>
                    <Link href={s.href} className="inline-flex items-center gap-1.5 font-display text-[14.5px] font-bold text-accent-deep">
                      Learn more <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
