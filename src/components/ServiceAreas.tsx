import Reveal from './Reveal';
import { serviceAreas, site } from '@/lib/content';

/** Service-area list — local proof + supports LocalBusiness areaServed. */
export default function ServiceAreas({ tone = 'light' }: { tone?: 'light' | 'panel' }) {
  const dark = tone === 'panel';
  return (
    <Reveal>
      <div className="flex flex-wrap gap-2.5">
        {serviceAreas.map((a) => (
          <span
            key={a}
            className={
              dark
                ? 'rounded-full border border-[oklch(0.3_0.02_55)] bg-[oklch(0.18_0.02_50)] px-4 py-2 font-display text-[13.5px] font-semibold text-[oklch(0.85_0.02_70)]'
                : 'rounded-full border border-line bg-card px-4 py-2 font-display text-[13.5px] font-semibold text-ink'
            }
          >
            {a}
          </span>
        ))}
      </div>
      <p className={`mt-4 text-[14px] ${dark ? 'text-[oklch(0.6_0.02_60)]' : 'text-muted'}`}>
        Serving {site.area} and the surrounding metro.
      </p>
    </Reveal>
  );
}
