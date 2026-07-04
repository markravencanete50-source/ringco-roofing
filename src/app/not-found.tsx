import Link from 'next/link';
import MultiCta from '@/components/MultiCta';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center px-[6vw] pt-32">
      <div className="mx-auto max-w-wrap">
        <p className="eyebrow text-accent-deep">404</p>
        <h1 className="mb-4 mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold">We couldn’t find that page.</h1>
        <p className="mb-8 max-w-[520px] text-[17px] text-muted">
          It may have moved. Head back home, or get straight to a free inspection.
        </p>
        <div className="mb-6"><MultiCta /></div>
        <Link href="/" className="font-display font-bold text-accent-deep">← Back to home</Link>
      </div>
    </section>
  );
}
