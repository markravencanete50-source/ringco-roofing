import Reveal from './Reveal';
import { clsx } from './clsx';

type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
  tone?: 'light' | 'dark';
  eyebrowColor?: string;
};

/** Reusable eyebrow + H2 + optional subhead, with the standard reveal. */
export default function SectionHead({ eyebrow, title, sub, tone = 'light', eyebrowColor }: Props) {
  const dark = tone === 'dark';
  return (
    <Reveal>
      <p className={clsx('eyebrow', eyebrowColor ?? (dark ? 'text-blue' : 'text-[oklch(0.6_0.15_55)]'))}>{eyebrow}</p>
      <h2 className={clsx('mt-3.5 max-w-[680px] font-display text-[clamp(28px,4vw,44px)] font-bold', dark && 'text-[oklch(0.98_0.01_80)]')}>
        {title}
      </h2>
      {sub ? (
        <p className={clsx('mt-4 max-w-[620px] text-[17px] leading-relaxed', dark ? 'text-[oklch(0.75_0.02_60)]' : 'text-muted')}>
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
