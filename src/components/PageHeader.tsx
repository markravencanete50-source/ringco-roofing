type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
};

/** Dark hero band for interior pages. Top padding clears the fixed header. */
export default function PageHeader({ eyebrow, title, sub }: Props) {
  return (
    <section className="bg-panel-2 px-[6vw] pb-20 pt-44">
      <div className="mx-auto max-w-wrap">
        <p className="eyebrow text-accent-hi">{eyebrow}</p>
        <h1 className="mt-4 max-w-[820px] font-display text-[clamp(34px,4.6vw,56px)] font-bold leading-[1.08] tracking-[-0.01em] text-[oklch(0.98_0.01_80)]">
          {title}
        </h1>
        {sub ? (
          <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-[oklch(0.75_0.02_60)]">{sub}</p>
        ) : null}
      </div>
    </section>
  );
}
