import Reveal from './Reveal';
import Button from './Button';
import { caseStudy } from '@/lib/content';

/**
 * Featured named case study — the McRoof pattern (specific, outcome-led proof)
 * that beats a generic testimonial carousel. Copy is kept honest; verified
 * specifics are wired in via content.ts (see TODOs there).
 */
export default function CaseStudy({ showCta = true }: { showCta?: boolean }) {
  return (
    <section className="bg-panel px-[6vw] py-20 md:py-28">
      <div className="mx-auto max-w-wrap">
        <Reveal>
          <div className="grid items-center gap-10 rounded-[24px] border border-[oklch(0.26_0.02_55)] bg-[oklch(0.19_0.02_50)] p-8 md:p-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="eyebrow text-blue">{caseStudy.kicker}</p>
              <h2 className="mb-5 mt-3.5 font-display text-[clamp(24px,3.4vw,38px)] font-bold text-[oklch(0.98_0.01_80)]">
                {caseStudy.title}
              </h2>
              <p className="mb-4 text-[16.5px] leading-relaxed text-[oklch(0.78_0.02_60)]">{caseStudy.summary}</p>
              <p className="text-[16.5px] leading-relaxed text-[oklch(0.78_0.02_60)]">{caseStudy.outcome}</p>
              {showCta ? (
                <div className="mt-8">
                  <Button href="/insurance-claims" className="!px-7 !py-3.5">See how we handle claims</Button>
                </div>
              ) : null}
            </div>
            <div className="rounded-[18px] border border-[oklch(0.3_0.02_55)] bg-[oklch(0.15_0.02_50)] p-8 text-center">
              <div className="eyebrow mb-3 text-[oklch(0.6_0.02_60)]">{caseStudy.metricLabel}</div>
              <div className="font-display text-[clamp(26px,3vw,34px)] font-bold leading-tight text-accent-hi">
                {caseStudy.metricValue}
              </div>
              <div className="mt-6 border-t border-[oklch(0.28_0.02_55)] pt-5 text-[14px] text-[oklch(0.6_0.02_60)]">
                {caseStudy.homeowner}
                <br />vs. {caseStudy.insurer}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
