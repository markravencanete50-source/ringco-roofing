import Link from 'next/link';
import Reveal from './Reveal';
import { paths } from '@/lib/content';
import { clsx } from './clsx';

/**
 * Homepage "pick your path" router — the three real visitor intents get a
 * dedicated card that sends them to depth instead of making the homepage carry
 * every service at once.
 */
export default function PathRouter() {
  return (
    <section className="relative z-[2] -mt-16 px-[6vw] md:-mt-20">
      <div className="mx-auto grid max-w-wrap gap-5 md:grid-cols-3">
        {paths.map((p, i) => {
          const accent = p.tone === 'accent';
          return (
            <Reveal key={p.href + p.title} delay={i * 0.08}>
              <Link
                href={p.href}
                className={clsx(
                  'group flex h-full flex-col rounded-[20px] border p-7 shadow-[0_24px_50px_-30px_oklch(0.2_0.02_60/0.5)] transition-transform duration-300 hover:-translate-y-1.5',
                  accent
                    ? 'border-transparent bg-accent text-accent-ink'
                    : 'border-line bg-card text-ink',
                )}
              >
                <span className={clsx('eyebrow', accent ? 'text-[oklch(0.2_0.02_50/0.8)]' : 'text-accent-deep')}>{p.kicker}</span>
                <h3 className="mb-2.5 mt-3 font-display text-[21px] font-bold leading-tight">{p.title}</h3>
                <p className={clsx('mb-6 flex-1 text-[15px]', accent ? 'text-[oklch(0.24_0.02_50/0.85)]' : 'text-muted')}>{p.body}</p>
                <span className="inline-flex items-center gap-1.5 font-display text-[14.5px] font-bold">
                  {p.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
