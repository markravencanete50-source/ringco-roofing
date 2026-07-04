import { reviews } from '@/lib/content';

/**
 * Gently auto-scrolling review rail (CSS marquee, pauses on hover/touch).
 * Five real reviews with named cities.
 */
export default function ReviewsMarquee() {
  const loop = [...reviews, ...reviews];
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <div className="flex w-max gap-6 animate-marquee-slow group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
        {loop.map((r, i) => (
          <figure key={i} className="w-[380px] shrink-0 rounded-3xl border border-[oklch(0.26_0.02_55)] bg-[oklch(0.18_0.02_50)] p-7">
            <div className="mb-4 text-[15px] tracking-[0.1em] text-accent-hi">★★★★★</div>
            <blockquote className="text-[15.5px] leading-relaxed text-[oklch(0.85_0.02_70)]">&ldquo;{r.quote}&rdquo;</blockquote>
            <figcaption className="mt-5">
              <div className="font-display text-[15px] font-bold text-[oklch(0.98_0.01_80)]">{r.name}</div>
              <div className="text-[13px] text-[oklch(0.6_0.02_60)]">{r.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
