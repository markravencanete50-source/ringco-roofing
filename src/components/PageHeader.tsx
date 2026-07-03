export default function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_100%_at_20%_0%,oklch(0.22_0.03_50)_0%,oklch(0.14_0.02_50)_70%)] px-[6vw] pb-16 pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(oklch(0.5_0.02_60/0.05)_1px,transparent_1px),linear-gradient(90deg,oklch(0.5_0.02_60/0.05)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(circle_at_30%_20%,#000_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-wrap">
        <p className="eyebrow text-accent-hi">{eyebrow}</p>
        <h1 className="mt-3.5 max-w-[820px] font-display text-[clamp(32px,5vw,56px)] font-bold leading-[1.06] text-[oklch(0.98_0.01_80)]">{title}</h1>
        {sub && <p className="mt-5 max-w-[620px] text-[clamp(16px,1.6vw,19px)] text-[oklch(0.82_0.02_70)]">{sub}</p>}
      </div>
    </section>
  );
}
