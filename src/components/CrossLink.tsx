import Link from 'next/link';
import Reveal from './Reveal';

/** Inline internal-link band pointing a visitor to the most relevant next page. */
export default function CrossLink({ eyebrow, title, body, href, cta }: { eyebrow: string; title: string; body: string; href: string; cta: string }) {
  return (
    <section className="px-[6vw] py-16">
      <div className="mx-auto max-w-wrap">
        <Reveal>
          <Link
            href={href}
            className="group flex flex-col items-start justify-between gap-6 rounded-[20px] border border-line bg-card p-8 shadow-[0_20px_40px_-34px_oklch(0.2_0.02_60/0.3)] transition-transform duration-300 hover:-translate-y-1 md:flex-row md:items-center"
          >
            <div>
              <p className="eyebrow text-accent-deep">{eyebrow}</p>
              <h3 className="mb-1.5 mt-2 font-display text-[22px] font-bold">{title}</h3>
              <p className="max-w-[560px] text-[15.5px] text-muted">{body}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-display font-bold text-accent-ink transition-colors group-hover:bg-accent-hi">
              {cta} <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
