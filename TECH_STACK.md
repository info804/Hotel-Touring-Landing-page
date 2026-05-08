# TECH STACK — Hotel Touring Livigno Landing Page

## Architecture
Single-file HTML (`Hotel Touring Livigno.html`) — zero build step, self-contained.

## Brand Colors
| Token         | Hex       | Use                        |
|---------------|-----------|----------------------------|
| --burgundy    | #961c1c   | Primary CTAs, accents      |
| --burgundy-dk | #6b1212   | Hover states               |
| --burgundy-lt | #b52828   | Hover glow                 |
| --cream       | #f8f3ea   | Page background            |
| --cream-dk    | #ede5d4   | Alt section backgrounds    |
| --pine        | #2d4a3e   | Experience section bg      |
| --pine-lt     | #3d6655   | Secondary green            |
| --gold        | #c9a84c   | Accents, schema stars      |
| --gold-lt     | #dfc070   | Hero italic highlights     |
| --snow        | #fdfcfa   | Features section bg        |
| --ink         | #18100a   | Headings / dark text       |
| --ink-mid     | #4a3828   | Body text                  |
| --ink-lt      | #7a6858   | Captions / meta text       |

## Typography
- **Headings**: Playfair Display (400, 600, 700, 900 — incl. italic)
- **Body / UI**: DM Sans (300, 400, 500, 600 — opsz 9..40)
- **Source**: Google Fonts (preconnect optimized)

## Libraries
| Library        | Version  | CDN                              | Use                  |
|----------------|----------|----------------------------------|----------------------|
| Embla Carousel | 8.3.0    | unpkg                            | Gallery carousel     |

## Sections (top → bottom)
1. `#hero` — Full-viewport, parallax bg, snow canvas, mountain SVG, night-mode toggle
2. `#strip` — 5-item feature strip (burgundy bg)
3. `#features` — Bento grid (4 cards: Pool/Spa, Ski, Kids, Dining)
4. `#kids` — Split layout, family features list
5. `#experience` — Photo mosaic (5-tile, pine bg)
6. `#gallery` — Embla carousel (7 slides, auto-advance 4.5s)
7. `#location` — Split layout, seasons cards
8. `#testimonial` — Pull-quote, burgundy bg
9. `footer` — 3-col grid, contact, links, socials

## Persistent UI
- `nav` — Fixed, glassmorphism on scroll
- `#sticky-cta` — Appears after 55% scroll, links to BookingExpert
- `#marmot` — Animated mascot (hidden on mobile)
- `#cookie-banner` — GDPR consent, localStorage `ht_cookie_consent_v1`

## SEO / Structured Data
- Full `<meta>` suite: description, OG, Twitter Card
- `<link rel="canonical">`
- `<link rel="preload">` for hero LCP image
- Schema.org `Hotel` JSON-LD with address, geo, amenities, aggregateRating

## Booking Integration
- Platform: BookingExpert
- Direct link: `https://be.bookingexpert.it/book/home/single?layout=14019&lang=it&currency=EUR&nsid=99277590-...`

## Tone of Voice
- Italian primary, English secondary phrases ("Where the mountains become home")
- Warm, familial, luxury-adjacent — NOT cold corporate
- Emotional beats: belonging, alpine authenticity, family joy, Italian hospitality
