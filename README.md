# Ringco Roofing & Construction — Website

Next.js 14 (App Router) + Tailwind CSS + TypeScript implementation of the Ringco marketing site.
Design reference: `Ringco Homepage 2026.dc.html` (open in a browser to see the target design — it is git-ignored and not part of the app).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Structure

- `src/app/` — routes: `/` (home), `/services`, `/insurance-claims`
- `src/components/` — one component per homepage section (Hero, Marquee, Services, Process, Stats, BeforeAfter, Certifications, Reviews, CtaBand) plus shared Header, Footer, Button, PageHeader, Reveal (scroll-in animation), StickyMobileCta
- `src/lib/content.ts` — ALL copy, nav, services, stats, reviews, contact info. Edit content here, not in components.
- `tailwind.config.ts` + `src/app/globals.css` — design tokens (oklch color vars, Space Grotesk / Manrope fonts, wrap width)

## Notes for implementation

- Fonts load via `next/font/google` in `layout.tsx` (Space Grotesk = display, Manrope = body).
- Images are Unsplash placeholders (`next.config.mjs` allows `images.unsplash.com`). Replace with real project photos before launch.
- `Reveal` respects `prefers-reduced-motion`.
- Phone/email/address live in `src/lib/content.ts` → `site`.
- Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) for canonical metadata.

## TODO before launch

- [ ] Replace Unsplash placeholders with real job-site photography
- [ ] Real logo asset in Header/Footer
- [ ] Hook the CTA/contact actions to a form or booking flow
- [ ] Verify license/cert claims (GAF, BBB) with the client
