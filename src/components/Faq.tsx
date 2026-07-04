import JsonLd from './JsonLd';

export type QA = { q: string; a: string };

/** FAQ accordion that also emits FAQPage structured data from the same list. */
export default function Faq({ items, schema = true }: { items: QA[]; schema?: boolean }) {
  return (
    <div className="mx-auto max-w-[820px]">
      <div className="divide-y divide-[oklch(0.26_0.02_55)]">
        {items.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[18px] font-bold text-[oklch(0.95_0.01_80)]">
              {f.q}
              <span className="shrink-0 text-accent transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[16px] leading-relaxed text-[oklch(0.72_0.02_60)]">{f.a}</p>
          </details>
        ))}
      </div>
      {schema ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      ) : null}
    </div>
  );
}
