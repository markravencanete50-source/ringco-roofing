import { clsx } from './clsx';

type Props = {
  children: React.ReactNode;
  /** Visual tone of the band. */
  tone?: 'light' | 'panel' | 'panel-2';
  className?: string;
  id?: string;
  /** Constrain inner content to the site wrap width. Default true. */
  wrap?: boolean;
};

const tones = {
  light: 'bg-bg text-ink',
  panel: 'bg-panel text-[oklch(0.95_0.01_80)]',
  'panel-2': 'bg-panel-2 text-[oklch(0.95_0.01_80)]',
};

/** Consistent page section: shared horizontal padding + vertical rhythm. */
export default function Section({ children, tone = 'light', className, id, wrap = true }: Props) {
  return (
    <section id={id} className={clsx('px-[6vw] py-20 md:py-28', tones[tone], className)}>
      {wrap ? <div className="mx-auto max-w-wrap">{children}</div> : children}
    </section>
  );
}
