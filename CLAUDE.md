# CLAUDE.md — Ringco Roofing site

Next.js 14 (App Router) + Tailwind marketing site for Ringco Roofing and
Construction (Oklahoma County, OK). No CMS — all copy/data lives in
`src/lib/content.ts`.

## Commands
- `npm install` then `npm run dev` — local dev
- `npm run build` — must pass before any push
- `npm run lint`

## Deploy / Git
- Push to `main` deploys production (Vercel-style host assumed).
- Before pushing: run `npm run build` and fix any type/lint errors.

## Conventions
- **All copy and data** (services, steps, stats, reviews, cities, team,
  gallery items, FAQs, claim story) live in `src/lib/content.ts`. Edit there,
  not in components.
- **Design tokens** are CSS variables in `src/app/globals.css` (colors as
  oklch, motion tokens `--ease-out` / `--dur-micro|comp|section`). Tailwind
  maps them in `tailwind.config.ts` (`duration-micro/comp/section`,
  `ease-out`). Use the tokens — don't invent per-component easings/durations.
- The accent (weathered orange-red) is for CTAs only, never decorative.
- Fonts: Zilla Slab (display) + Manrope (body) via `next/font` in
  `src/app/layout.tsx`.
- **Reduced motion**: a global kill-switch in `globals.css` disables
  animation/transition durations. JS-driven motion components
  (`Reveal`, `ClaimProcess`, `Parallax`, `ClaimStory`) also check
  `prefers-reduced-motion` and render the final state. Keep that pattern
  for any new motion.
- **Media**: real photos/videos go in `public/media/` — exact filenames in
  `/MEDIA.md`. `MediaImg` renders a striped placeholder when a file is
  missing; keep using it for any local media (`unoptimized` is intentional).
- Shared motion primitives: `Reveal` (fade-up on scroll), `ClaimProcess`
  (scroll-driven line-draw, shared by Home + Insurance Claims), `BASlider`
  (before/after drag), `Parallax`, `Accordion`, `AreaMap`. Reuse these
  instead of new one-off effects — the whole site should feel like one system.

## Lead form
`src/components/LeadForm.tsx` posts JSON to `src/app/api/lead/route.ts`,
which currently only validates + logs. TODO: wire to email (Resend) or a CRM
webhook. Keep the `{ ok: true }` response shape.
