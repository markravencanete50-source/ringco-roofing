# MEDIA.md — where your photos & drone footage go

Drop your real files into `public/media/` using these exact filenames.
Until a file exists, the site shows a striped placeholder with the slot name
(so nothing looks broken — but real media is the biggest upgrade on the site).

**Formats:** photos `.jpg` (≤ 400 KB ideally, ~1600px wide; hero poster up to 2000px).
Videos `.mp4` (H.264, muted-friendly, 6–10 s loops, ≤ 8 MB each if possible).

## Home
| File | What it should be |
|---|---|
| `public/media/home-hero.mp4` | Slow descending or lateral drone pass over a finished Ringco roof, 6–8 s loop |
| `public/media/home-hero-poster.jpg` | Sharp drone still (same job) — paints instantly before video buffers |
| `public/media/home-before.jpg` | Real before shot (matching angle to the after) |
| `public/media/home-after.jpg` | Real after shot — same angle as before |
| `public/media/cta-drone.jpg` | Wide drone still used (dimmed) behind the final CTA band |

## Service imagery (Home cards + Services hub)
| File | What it should be |
|---|---|
| `public/media/services/roofing.jpg` | Finished roof, close/mid shot |
| `public/media/services/siding.jpg` | Finished siding elevation |
| `public/media/services/gutters.jpg` | Seamless gutter run / downspout detail |
| `public/media/services/storm.jpg` | Storm damage or adjuster-meeting shot |
| `public/media/services-hero.jpg` | Static drone still behind the Services page header |

## Gallery (`src/lib/content.ts` → `galleryItems`)
Eight jobs scaffolded, `job-01` … `job-08`. For each:
- `public/media/gallery/job-0N-before.jpg`
- `public/media/gallery/job-0N-after.jpg`
- Optional: `public/media/gallery/job-0N-drone.mp4` — looping drone clip of that
  specific finished job (currently declared on job-01 and job-04; add/remove the
  `video:` field per item in `content.ts` to match what you actually have).

Edit titles/cities/scopes in `content.ts` to match the real jobs.

## About
| File | What it should be |
|---|---|
| `public/media/about-hero.jpg` | Warm shot: crew / truck / local area (NOT a roof close-up) |
| `public/media/about-story.jpg` | Crew on site |
| `public/media/team/brantlon.jpg` | Portrait, roughly 4:5 crop |
| `public/media/team/blake.jpg` | Portrait, roughly 4:5 crop |
| `public/media/team/victor.jpg` | Portrait, roughly 4:5 crop |

> Per the design brief: real team photos matter more than any animation on the
> site — this is the single biggest credibility gap. Prioritize these three.

## Gallery page header
| File | What it should be |
|---|---|
| `public/media/gallery-hero.jpg` | Drone still of a neighborhood / rooftop cluster |
