import Reveal from './Reveal';
import BASlider from './BASlider';

/**
 * Homepage before/after — real drone before/after pair, matching angles.
 * Media slots: /media/home-before.jpg + /media/home-after.jpg (see MEDIA.md)
 */
export default function BeforeAfter() {
  return (
    <section className="px-[6vw] py-28">
      <div className="mx-auto max-w-wrap">
        <Reveal>
          <p className="eyebrow text-accent-deep">Real projects</p>
          <h2 className="mb-4 mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-bold">Drag to see the difference.</h2>
          <p className="mb-12 max-w-[560px] text-[17px] text-muted">Every roof we replace is documented before and after. Here&rsquo;s what a full storm-damage replacement looks like.</p>
        </Reveal>

        <Reveal>
          <BASlider
            before="/media/home-before.jpg"
            after="/media/home-after.jpg"
            altBefore="Roof before replacement"
            altAfter="Roof after replacement"
            priority
            className="shadow-[0_30px_60px_-30px_oklch(0.2_0.02_60/0.35)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
