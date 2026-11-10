# Customising a demo for a paying client

Each folder in `demos/` is a complete, standalone website. To start a client project:

1. **Copy the folder** that best matches the brief into a new project (e.g. `clients/amara-salon/`).
2. **Remove the demo scaffolding**:
   - Delete the `<aside class="demo-bar">…</aside>` block at the top of `index.html`.
   - In the `<head>`, change `<meta name="robots" content="noindex, follow">` to `index, follow` (or remove it). Add a canonical URL and Open Graph image for the client's domain.
   - Update the footer credit line (keep a small "Website by Usman" credit if the client agrees).
3. **Rebrand**: every stylesheet starts with a `:root { … }` block of colour and font tokens. Change those first; most of the site follows.
4. **Replace content and artwork**: swap the SVG illustrations in `assets/img/` for the client's photos. Use WebP or JPEG, roughly 1600 px on the long edge, and keep the `width`/`height` attributes and `alt` text accurate.
5. **Connect the real actions**: each demo's `js/main.js` begins with a small settings block (see below). While a value is empty, the button shows a clear "concept demo" message instead of doing anything.
6. **Test** at phone, tablet and desktop widths, click every button, then deploy.

---

## Per-demo settings

### Personal portfolio — `demos/personal-portfolio/`
- **Settings** (`js/main.js`, `LINKS`): `email` (`mailto:` link), `cv` (path to a PDF in `assets/`), and the `GitHub`, `LinkedIn` and `Dribbble` profile URLs.
- **Projects**: each `<li class="project" data-category="…">` in the Work section. The `data-category` value must match a filter button's `data-filter`. A project can belong to several categories (space-separated).
- **Case studies**: each project has a `<template id="case-…">` holding the dialog content. Its button's `data-case` must match the template's `id`.
- **Fonts**: Instrument Serif + Inter. **Accent colour**: `--accent`.

### Startup landing — `demos/startup-landing/`
- **Settings** (`js/main.js`): `SIGNUP_ENDPOINT`, a URL that accepts a POST and returns 2xx (Formspree, Mailchimp embedded-form action, ConvertKit, etc.).
- **Product preview**: the "app" is HTML/CSS inside `.app`, so edit the text directly. Each tab panel is a `role="tabpanel"`.
- **Pricing toggle**: the Team plan price uses `data-monthly` / `data-annual` attributes. The billed-annually note text is in `js/main.js`. Remove the toggle if the client has a single price.
- **Brand colour**: `--brand` (keep white text contrast ≥ 4.5:1).

### Small business — `demos/small-business/`
- **Settings** (`js/main.js`, `BUSINESS`):
  - `phone` / `phoneDisplay`: turns every "Call" link into a real `tel:` link.
  - `whatsapp`: booking requests open WhatsApp with the details filled in.
  - `mapsUrl`: the "Get directions" button.
  - `timeZone` and `hours`: drive the "Open now / Closed" badge and the highlighted day. Keep the hours table in `index.html` in sync.
- **Map**: replace the `.map-placeholder` block with the client's Google Maps `<iframe>` embed (add `loading="lazy"` and a `title`).
- **Price list**: `<ul class="price-list">` items. The booking `<select>` lists services separately, so update both.

### Agency — `demos/agency-website/`
- **Settings** (`js/main.js`, `LINKS`): `consult` (e.g. Calendly link) and `email` (`mailto:`).
- **Projects**: `.work` items with `data-tags` (space-separated, matching the `data-f` filter buttons). Dialog content lives in `<template id="p-…">`. Use real case studies, and only state results the client can verify.
- **Services**: vertical tabs (`.service-tabs` buttons ↔ `.service-panel` panels, linked by `aria-controls`).

### Event — `demos/event-website/`
- **Settings** (`js/main.js`): `REGISTRATION_URL` (ticketing page) and `PARTNER_PACK_URL`.
- **Countdown**: set `data-target` on `[data-countdown]` in `index.html` to the real start time with its UTC offset, e.g. `2027-06-17T09:00:00+01:00`.
- **Agenda**: each `<li data-track="build|research|society|all">`. Items marked `all` (breaks, keynotes) always show.
- **Partners**: replace the text wordmarks with real partner logos (SVG preferred), but only with the partners' permission.

### Product showcase — `demos/product-showcase/`
- **Settings** (`js/main.js`): `WHATSAPP_NUMBER` (digits only, international format). Once set, "Send order on WhatsApp" opens WhatsApp with the order list written out. While empty, it shows a preview of the message instead.
- **Products**: two places to update, using the same `id`:
  1. the `PRODUCTS` object in `js/main.js` (name, category label, price in naira, image, description, ingredients, how to use);
  2. the matching `<li class="product" data-id="…" data-category="…">` card in `index.html`.
- **Currency**: prices are formatted with `naira()` in `js/main.js`. Change it for another currency.
- **No checkout**: payment and delivery are confirmed in the WhatsApp conversation. If a client needs card payments, quote an e-commerce platform separately.

---

## Pricing guidance

These match the public starting prices on the main site.

| Demo used as a base | Main-site package | Typical extra work |
| --- | --- | --- |
| Personal portfolio | Starter (from $40) | Extra pages, blog, CV PDF |
| Event | From $50 | Ticketing integration, multiple events |
| Product showcase | From $60 | Large catalogues, product photography edits |
| Startup landing | From $70 | Email-platform integration, analytics |
| Small business / Agency | From $80 / Business package | Booking tools, maps, multiple pages |

Hosting, domains, paid services and extra revisions are always quoted separately.
