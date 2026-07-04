import MultiCta from './MultiCta';

export default function CtaBand({
  title = 'Storm rolled through? Get a free inspection before you file.',
  sub = 'No cost, no obligation. We’ll tell you straight whether you have a claim worth filing.',
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_120%_at_80%_0%,oklch(0.24_0.04_55)_0%,oklch(0.14_0.02_50)_60%)] px-[6vw] py-28">
      <div className="mx-auto max-w-wrap text-center">
        <h2 className="mx-auto mb-4.5 max-w-[720px] font-display text-[clamp(30px,4.4vw,50px)] font-bold text-[oklch(0.98_0.01_80)]">{title}</h2>
        <p className="mx-auto mb-8 max-w-[560px] text-[17px] text-[oklch(0.78_0.02_70)]">{sub}</p>
        <MultiCta align="center" estimateLabel="Book my free inspection" />
      </div>
    </section>
  );
}
