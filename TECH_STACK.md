# TECH STACK — Hotel Touring Livigno

Single-page site, **zero build step**, fully self-contained. See **`DESIGN.md`** for the design
system (palette, type, motion, component rules) — it is the source of truth.

## Run it
```
node server.js     →  http://localhost:8080
```
`server.js` is a dependency-free static file server (dev/preview only). Serves `index.html`.

## Layout
```
.
├── index.html                  # the entire site — inline CSS + JS, no dependencies
├── DESIGN.md                   # design system (source of truth)
├── server.js                   # zero-dep local preview server
├── assets/img/                 # local JPEGs (no hotlinks/CDN); Rooms/ = carousel · gallery/ = manifest-driven
└── Hotel Touring Livigno.html  # OLD over-complex build — superseded, safe to delete
```

## Architecture
- Plain HTML/CSS/JS in one file. **No framework, no bundler, no JS dependencies.**
- Runtime externals are Google Fonts (`<link>`, with preconnect), Google Analytics (when configured), and
  one lazy key-free **OpenStreetMap embed iframe** (the Location panel map, centred on Livigno). All core
  CSS/JS is inline; all images are local. No CDN single point of failure.
- Slideshows (room slideshow, photo gallery) are **vanilla JS, dependency-free** (crossfade,
  dots + arrows, auto-advance paused on hover, disabled under `prefers-reduced-motion`). No carousel library.
- The booking bar uses **custom popovers** (a vanilla range calendar + a guests stepper popover) so no
  native date/select chrome shows. The amenity row uses a **full-width expanding drawer** (one open at a time).

## Brand & type
- Palette: Deep Pine `#27433A`, Warm Stone `#B8A98F`, Cream `#F6F1E7`, Warm White `#FCFAF5`,
  Charcoal `#2A2724`, Soft Gold `#C2A24E` (hairlines/stars/hover only), Muted Brick `#9E4A3C` (rare).
- Type: **Fraunces** (headings) + **Inter** (body/UI), Google Fonts.
- Signature motif: a thin **gold ridgeline** (inline SVG polyline) under section eyebrows, dividers,
  and the footer; it draws itself in on scroll. Lupigno mascot appears in Kids Club content only.

## Sections (top → bottom)
1. Sticky nav — **wordmark left; IT/EN/DE toggle + Prenota pill right**. No centre links, no hamburger.
   Transparent over hero → solid on scroll.
2. Full-bleed hero (`slider_hotel-1.jpg` — the hotel building, subtle gradients only). Text sits higher;
   booking bar overlaps closer.
3. Booking bar (overlaps hero) — custom range calendar + guests popover (Adults · Children 7-12 · Children 3-6 ·
   Infants 0-2). Popovers are **viewport-aware** (flip upward when the trigger is low so they're never clipped).
   A compact strip pins under the nav once scrolled past.
4. Family & Wellness — **room slideshow** (5 room types) + 4 cards (Pool & Spa / Family / Restaurant / Location)
   that open a **full-width expanding drawer** which reads as growing from the active card (gold edge + a caret
   tracking under it). The Location panel embeds a **key-free OpenStreetMap map** centred on Livigno.
5. Livigno — **centred title**, then short copy + language-aware **livigno.eu** topic links on the left and a
   single vanilla **slideshow card** (livigno.eu photos downloaded locally) on the right + a "Discover more" button.
6. Gallery + Guests — a centred, smaller **photo slideshow** over a full-bleed background of **35 ★★★★★ guest
   reviews scattered** across the section (varied tilt/position, higher opacity).
7. CTA band (pine)
8. Footer (gold ridgeline rule, contact, address)

## i18n (IT / EN / DE)
- JS `I18N` dictionary + `data-i18n` attributes. `applyLang()` swaps text, sets `<html lang>`,
  updates the active language pill, the document title, and the booking summary.
- Choice persists in `localStorage` (`tl_lang`); first visit auto-detects `navigator.language`
  (de→de, en→en, else **it**). Italian is the static default (no-JS / crawlers see Italian).

## Booking (BookingExpert) — deep-link verified live
- `#bookingForm` holds hidden state (`checkin`, `checkout`, `adults`, `babies`, `kids1`, `kids2`) driven by
  the custom range calendar + guests stepper popover. Submitting (or any **Prenota / Book** button) opens
  BookingExpert in a new tab, **pre-filled and auto-searched**.
- Generated link (params confirmed by driving the live engine):
  `https://be.bookingexpert.it/book/home/single?layout=14019&currency=EUR&nsid=99277590-3b11-4618-87eb-ca0a388150a1`
  `&lang={it|en|de}&checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&beginsearch=1&isnewsearch=1`
  plus guest composition `guesttypes[0][<typeId>]=<count>`:
  **18482 = Adults · 18484 = Infants (0-2) · 18483 = Children (3-6) · 19632 = Children (7-12)**.
  `beginsearch=1&isnewsearch=1` makes the engine run availability immediately and land on a real result.
- Defaults: arrival = tomorrow, departure = +1 day, 2 adults, 0 children.

## Analytics
- GA4 with **Consent Mode v2**, `analytics_storage` defaults to **denied**.
- Measurement ID is a placeholder (`GA_MEASUREMENT_ID = ''`). No gtag network request is made
  until a real `G-XXXXXXXXXX` id is set **and** consent is granted via the cookie banner.

## Motion
Scroll reveal (fade + slide-up, screenshot-safe — never permanently `opacity:0`, with a load-time
fallback and `prefers-reduced-motion` honoured), ridgeline draw-in, gentle image hover zoom,
smooth scroll, nav + booking-bar shrink on scroll, a ~200ms fade/blur on the language switch, and two
vanilla crossfade slideshows. All motion is disabled under `prefers-reduced-motion`.

## Images
All photos are local in `assets/img/` — never hotlinked (Livigno scenery `livigno-1..12.jpg` sourced
from livigno.eu and downloaded locally). Two generated/curated sets:
- **Gallery slideshow** — manifest-driven: 14 web-optimised photos in `assets/img/gallery/`, regenerated
  by `scripts/build-assets.js` from `GALLERY_SOURCES` (resize ≤1600px, mozjpeg q80). The page reads
  `gallery/manifest.json`, so drop-ins are picked up automatically.
- **Room carousel** — 8 hi-res room photos in `assets/img/Rooms/` (`room-classica`, `room-junior`,
  `room-kids`, `room-alpina`, `room-superior`, `room-superior-plus`, `room-superior-family`,
  `room-tana`), each web-optimised (≤1600px, mozjpeg q80) from the originals. The slideshow JS is
  count-agnostic, so adding/removing a `.rs-slide` figure needs no JS change.
