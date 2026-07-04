import MediaImg from './MediaImg';

type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
  /** Optional static image (drone still) behind the band, with a light overlay. */
  image?: string;
  imageLabel?: string;
};

/** Dark hero band for interior pages. Top padding clears the fixed header. */
export default function PageHeader({ eyebrow, title, sub, image, imageLabel }: Props) {
  return (
    <section className="relative overflow-hidden bg-panel-2 px-[6vw] pb-20 pt-44">
      {image ? (
        <>
          <div className="absolute inset-0 opacity-30">
            <MediaImg src={image} alt="" slotLabel={imageLabel ?? 'drone still'} sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.14_0.02_50/0.6)_0%,oklch(0.14_0.02_50/0.92)_100%)]" />
        </>
      ) : null}
      <div className="relative mx-auto max-w-wrap">
        <p className="eyebrow animate-fadeUp text-accent-hi">{eyebrow}</p>
        <h1 className="mt-4 max-w-[820px] animate-fadeUp font-display text-[clamp(34px,4.6vw,56px)] font-bold leading-[1.08] tracking-[-0.01em] text-[oklch(0.98_0.01_80)]" style={{ animationDelay: '100ms' }}>
          {title}
        </h1>
        {sub ? (
          <p className="mt-5 max-w-[640px] animate-fadeUp text-[17px] leading-relaxed text-[oklch(0.75_0.02_60)]" style={{ animationDelay: '200ms' }}>{sub}</p>
        ) : null}
      </div>
    </section>
  );
}
