# Ringco Roofing & Construction — Website

Next.js 14 (App Router) + Tailwind CSS + TypeScript. Full 6-page marketing site:
`/` (home), `/services` (hub), `/insurance-claims`, `/gallery`, `/about`, `/contact`,
plus `/api/lead` (form intake stub).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build — run before every push
```

## Add your real media (do this first)

Drop photos/drone videos into `public/media/` using the exact filenames listed
in **[MEDIA.md](./MEDIA.md)**. Missing files render as labeled striped
placeholders, so the site never looks broken — but the hero drone loop, gallery
before/afters, and team photos are the highest-impact content on the site.

## Structure

- `src/app/` — routes (one folder per page) + `api/lead/route.ts`
- `src/components/` — sections + shared primitives:
  - Motion system: `Reveal` (scroll fade-up), `ClaimProcess` (scroll-driven
    line-draw stepper, shared by Home & Insurance Claims), `BASlider`
    (before/after drag slider, shared by Home & Gallery), `Parallax`,
    `Accordion`, `ClaimStory` (animated denied→approved stepper)
  - `MediaImg` — local-media image with striped-placeholder fallback
  - `AreaMap` — styled service-area map with city pins (About + Contact)
- `src/lib/content.ts` — **ALL copy and data**: nav, services, steps, stats,
  reviews, certs, cities, team, gallery items, OK insurance facts, claim story,
  FAQs. Edit content here, not in components.
- `src/app/globals.css` + `tailwind.config.ts` — design tokens: oklch color
  vars, weathered orange-red accent (CTAs only), motion tokens
  (`--ease-out`, 200/400/800 ms), global reduced-motion kill-switch.

## Deploying

1. `npm run build` locally — must pass.
2. Commit and push to `main` (production deploy).
3. Set `NEXT_PUBLIC_SITE_URL` in the host env (see `.env.example`).

## TODO before launch

- [ ] Drop real media into `public/media/` per MEDIA.md (esp. team photos — biggest credibility gap)
- [ ] Update `galleryItems` in `content.ts` to match the real jobs (titles, cities, which have drone clips)
- [ ] Wire `src/app/api/lead/route.ts` to email (Resend) or CRM webhook
- [ ] Real logo asset in Header/Footer
- [ ] Verify license/cert claims (GAF, BBB) and review quotes with the client
- [ ] Confirm drafted copy: team names/roles/bios, 15-city list, claim story details
