# DESIGN.md — Hotel Touring Livigno

Source of truth for the rebuild. Calm, modern, premium 4-star **family** hotel.
One idea per section, generous whitespace, **the photography is the design**.

> Supersedes the old burgundy-heavy build documented in `TECH_STACK.md`.

---

## 1. Brand

- **Essence:** "The alpine home where families come back to." Warm, rooted, quietly refined.
- **Slogan:** *Dove le montagne diventano casa* / *Where the mountains become home.*
- **Wordmark (pure CSS, no image):** `TOURING` in Fraunces letter-spaced caps; `LIVIGNO`
  smaller Inter caps beneath; four ★ in soft gold as a quality mark.
- **Signature motif — the gold ridgeline:** one thin gold rule shaped like a simplified
  mountain crest, used *sparingly* — under section eyebrows, as a section divider, and in the
  footer. Implemented as an inline SVG polyline (gold, 1.5px). Never more than one per viewport.
- **Lupigno** (marmot mascot) appears **only** in the Kids Club content — never as a global motif.

## 2. Colour tokens

| Token            | Hex       | Role                                            |
|------------------|-----------|-------------------------------------------------|
| `--pine`         | `#27433A` | Primary. Dark sections, headings on light, CTAs |
| `--pine-deep`    | `#1C322B` | Hover / footer                                  |
| `--stone`        | `#B8A98F` | Secondary. Eyebrows, borders, captions          |
| `--brick`        | `#9E4A3C` | RARE accent only (never fills, never dominant)  |
| `--cream`        | `#F6F1E7` | Primary page background                         |
| `--warm-white`   | `#FCFAF5` | Alternating section background / cards          |
| `--charcoal`     | `#2A2724` | Body + heading text                             |
| `--gold`         | `#C2A24E` | Hairlines, ★, ridgeline, hover only. NEVER body |
| `--gold-soft`    | `#D8BE78` | Gold on dark backgrounds                        |

Rules: burgundy/brick must **not** be dominant — accent only. Gold is never used for body text.
No dark full-bleed overlays on photos; only a subtle bottom gradient where text sits on an image.

## 3. Typography

- **Headings:** Fraunces (Google Fonts), weights 400/500/600, optical sizing on. Warm serif.
- **Body / UI:** Inter (Google Fonts), 400/500/600.
- Fonts via Google `<link>` with `preconnect` (allowed). Core JS/CSS stay local — no CDN SPOF.

Type scale (fluid):
| Use            | Size                          | Font / weight        | Notes |
|----------------|-------------------------------|----------------------|-------|
| Hero H1        | `clamp(48px, 7vw, 72px)`      | Fraunces 500         | line-height 1.05 |
| Section H2     | `clamp(30px, 4vw, 46px)`      | Fraunces 500         | line-height 1.1  |
| Card / H3      | `clamp(20px, 2vw, 24px)`      | Fraunces 500         |       |
| Eyebrow        | `13px` / `.18em` tracking caps| Inter 600            | stone colour     |
| Body           | `clamp(16px, 1.1vw, 18px)`    | Inter 400            | line-height 1.7  |
| Small / meta   | `14px`                        | Inter 500            |       |

## 4. Spacing & layout

- Base unit **8px**. Scale: 8 / 16 / 24 / 40 / 64 / 96 / 128.
- Section vertical rhythm: `clamp(72px, 12vh, 128px)` top & bottom.
- Content max-width **1200px**, gutter `clamp(20px, 5vw, 64px)`.
- Radius: cards/images `14px`, buttons `999px` (pill), inputs `10px`.
- Shadow: one soft token only — `0 18px 40px -24px rgba(28,50,43,.35)`. No heavy shadows.
- Breakpoints: mobile-first; **375 / 768 / 1440** are the verified targets.
  - `≤640` 1-col, booking bar stacks (nav is wordmark-left + lang/Prenota-right at all widths — no hamburger)
  - `641–1024` 2-col grids
  - `≥1025` full multi-column layout

## 5. Components

- **Nav:** sticky, transparent over hero → solid `--warm-white` + hairline + shadow on scroll
  (`.is-scrolled` after 40px). **Wordmark on the left; IT/EN/DE toggle + gold-outline Prenota pill on the
  right.** No centre links and no hamburger (fits cleanly down to 375).
- **Hero:** full-bleed `slider_hotel-1.jpg` (the hotel building + terrace — shows the property itself).
  Eyebrow + H1 + one-line subline, sitting **higher** in the frame. The booking bar overlaps **closer** to
  the headline (deeper negative margin). Subtle bottom gradient only — no full dark overlay.
- **Booking bar:** white card overlapping hero bottom; check-in / check-out / **guests** + Verifica button.
  Dependency-free **custom range calendar** + **guests popover** with stepper rows
  (Adults · Children 7-12 · Children 3-6 · Infants 0-2 — brackets taken from the live engine). No native
  date/select chrome. **Popovers are viewport-aware:** they open downward by default but flip **upward**
  (`.bk-pop.open-up`, decided in `openFor()`/`placePop()` by measuring the trigger vs `window.innerHeight`)
  when the trigger sits low, so they're never clipped. On scroll past hero it becomes a slim sticky bar.
- **Family & Wellness:** a **room slideshow** (5 room types, crossfade, name + one-liner per slide) as the
  large top card, then 4 cards (Pool & Spa / Family / Restaurant / Location) that open a **full-width
  expanding drawer** below the row — one open at a time, accessible `aria-expanded` toggle. The drawer reads
  as **growing from the opened card**: the active card squares its bottom + gains a continuous gold edge, and
  the panel shows an **upward caret tracking under the active card** (`--caret-x`, positioned in JS per
  layout; hidden in the 1-col layout). The **Location** panel embeds a **key-free OpenStreetMap map centred
  on Livigno** (`loading="lazy"`) beside the location copy.
- **Livigno:** **centred title**, then a two-column block — **short copy + language-aware topic links on the
  left, a single vanilla crossfade slideshow card on the right** (4 Livigno photos sourced from livigno.eu,
  downloaded locally to `assets/img/livigno-*.jpg`). Topic links + a "Discover more" ghost button point to
  **livigno.eu** (language-aware via `updateLivignoLinks()`, with a per-language slug override for German
  shopping → `geschäfte`). All linked livigno.eu pages verified 200 in it/en/de.
- **Gallery + Guests:** one section (tighter vertical rhythm) — a centred, slightly **smaller photo
  slideshow** (max 720px, 16/9) over a full-bleed background of **35 ★★★★★ guest reviews scattered across the
  whole section** (varied per-card tilt + nudge, ~.82 opacity, soft edge mask + a cream radial glow behind
  the slideshow so it stays legible).
- **CTA band:** pine background, ridgeline, one headline + booking button.
- **Footer:** ridgeline rule, wordmark, contact (address/tel/email), small nav, lang note.
- **Slideshows:** three, vanilla JS only (rooms, Livigno, gallery — crossfade, dots + **subtle hover-reveal
  arrows**, hover-pause, reduced-motion aware). No library.

## 6. Photography → section map

| Image                          | Res        | Use                              |
|--------------------------------|------------|----------------------------------|
| `slider_hotel-1.jpg`           | 1920×1280  | **Hero** (hotel building) + tiles|
| `touring-hotel.jpg`            | 1600×1200  | og:image / schema; gallery       |
| `livigno-1…4.jpg`              | varies     | **Livigno slideshow** (from livigno.eu, local) |
| `TOURING_PISCINA_0168.jpg`     | 1920×1280  | Amenities: Pool/Spa + gallery    |
| `TOURING_GIOCHI_043.jpg`       | 1920×1280  | Amenities: Kids Club + gallery   |
| `touring-winter.jpg`           | 1600×1200  | Location winter card + ski tile  |
| `BagnoTurco.jpg`               | 1080×1280  | Amenities: Wellness + gallery    |
| `5-ristorante.jpg`             | 1920×1280  | Gallery / dining                 |
| `slider_hotel-1.jpg`           | 1920×1280  | Location summer card / CTA band  |
| `family-hotel-livigno.jpg`     | 1920×1280  | Family section lead (candid)     |
| `box-3.jpg`                    | 1080×1280  | Room: **Superior** (hi-res)      |
| `family-hotel-livigno-1.jpg`   | 1080×1280  | Room: **Kids Room** (hi-res)     |
| `c_minimal2.jpg`               | 229×162 ⚠️ | Room: Junior Suite — LOW-RES     |
| `c_comunicanti1.jpg`           | 229×162 ⚠️ | Room: Connecting — LOW-RES       |
| `c_francese1.jpg`              | 229×240 ⚠️ | Room: Standard French — LOW-RES  |

⚠️ **Low-res rule:** the three 229px room photos get `object-fit:cover`, **no hover zoom**, and a
flag `data-lowres` so JS/CSS never scale them aggressively. Cards keep them small to hide softness.

## 7. Motion (keep light)

- **Signature touch:** the gold ridgeline under each section eyebrow draws itself in
  (SVG `stroke-dashoffset`) once when scrolled into view.
- Scroll reveal: fade + 16px slide-up, 420ms ease, staggered ≤120ms. **Screenshot-safe:** a
  load-time fallback adds `.is-visible` to everything after 1200ms, and `prefers-reduced-motion`
  shows all content immediately. Content is never permanently `opacity:0`.
- Image hover zoom: `transform: scale(1.04)`, 600ms (hi-res only).
- Language switch: ~200ms fade + blur on the changing text, then settle (no layout jump).
- Two vanilla crossfade slideshows (rooms, gallery); booking + amenity popovers/drawer animate gently.
- Smooth scroll for in-page anchors. Nav + booking-bar shrink on scroll. All motion off under reduced-motion.

## 8. i18n / booking / analytics

- **i18n IT/EN/DE:** JS dictionary + `data-i18n` attributes. `localStorage` key `tl_lang`;
  first visit auto-detects `navigator.language` (de→de, en→en, else **it**). Sets `<html lang>`.
  IT is primary / default in static HTML.
- **Booking (BookingExpert) — verified live:** base
  `https://be.bookingexpert.it/book/home/single?layout=14019&currency=EUR&nsid=99277590-3b11-4618-87eb-ca0a388150a1`
  + `&lang={it|en|de}&checkin={YYYY-MM-DD}&checkout={YYYY-MM-DD}&beginsearch=1&isnewsearch=1`
  + guest composition `guesttypes[0][<id>]={n}` (**18482 Adults · 18484 Infants 0-2 · 18483 Children 3-6 ·
  19632 Children 7-12**). `beginsearch=1&isnewsearch=1` auto-runs availability so the user lands pre-filled
  on a real result. Opens in a new tab. Defaults: arrival = tomorrow, departure = +1 day, 2 adults.
- **GA4:** Consent Mode v2, `analytics_storage` default **denied**, ID placeholder
  `G-XXXXXXXXXX` (do NOT invent). Dormant until ID + consent. Minimal cookie banner grants consent.

## 9. Tech

Plain HTML/CSS/JS, **zero build step**, single `index.html` (inline CSS + JS for one-file simplicity
and speed). All images local under `assets/`. `node server.js` → http://localhost:8080. Target < 3s.
Slideshows are hand-rolled vanilla JS (crossfade) — **zero JS dependencies**, no carousel library.
Runtime externals: Google Fonts (`<link>` + preconnect), GA (when configured), and one **lazy key-free
OpenStreetMap embed iframe** in the Location panel (centred on Livigno).
