# Test report

**Date:** 10 November 2026
**Method:** headless Google Chrome 157 (Puppeteer), driven against a local static server. Screenshots are in [`screenshots/`](screenshots/).
**Pages:** main site, privacy notice, 404 page, and the six demos (9 pages in total).

## 1. Layout and responsiveness

Every page was rendered at **1440×900 (desktop)**, **820×1180 (tablet)** and **390×844 (mobile)**.

Checks on each render:

| Check | Result |
| --- | --- |
| No horizontal page overflow (document wider than viewport) | ✅ 27/27 renders |
| No element extending past the viewport edge (outside clipped containers) | ✅ |
| All images load (no broken `src`) | ✅ |
| Every `<img>` has an `alt` attribute | ✅ |
| Every in-page `#anchor` points to an existing `id` | ✅ |
| Every relative link resolves to a file in the project | ✅ |
| No JavaScript errors, failed requests or HTTP 4xx/5xx | ✅ |
| Exactly one `<h1>`, no skipped heading levels | ✅ |
| Every button, link and form field has an accessible name or label | ✅ |

Screenshots were also reviewed by eye. Issues found and fixed during testing:
- The main hero headline wrapped to six lines on desktop; it was resized to four.
- Empty toast notifications showed as a dark pill in some layouts; they're now hidden until used.
- The salon lightbox's empty image `src` resolved to the page URL; it was removed.
- On the product site, image wrappers were duplicate focusable buttons; they became non-focusable click targets with descriptive alt text.

## 2. Accessibility (axe-core, WCAG 2.1 A/AA + best practice)

Run at 1280 px and 390 px on all 9 pages with reduced motion enabled.

- **First run:** colour contrast (4 sites), logo link names not matching their visible text (2), demo notice bars outside landmarks (6).
- **Fixes:** darker accent shades for white-text buttons and badges, removed the mismatched `aria-label`s, demo bars changed to `<aside>` landmarks, and the product CTA background darkened.
- **Final run:** ✅ **0 violations on all 18 page/width combinations.**

Also built in (not all automatically testable): skip links, visible `:focus-visible` outlines, keyboard support for tabs (arrow/Home/End keys), Escape closes menus and dialogs, focus returns to the triggering control, native `<dialog>` and `<details>`, `aria-live` status messages, `prefers-reduced-motion` honoured (animations, smooth scrolling, the marquee and the "available" pulse are all disabled).

## 3. JavaScript behaviour (scripted interaction tests)

All 40 checks passed. (Two checks first reported a failure because the test expected the wrong order total; the page's total of ₦51,000 was correct.)

| Site | Verified |
| --- | --- |
| Main | Mobile menu opens, moves focus into the menu, closes on Escape and returns focus · "Request a Quote" pre-selects the website type · empty submit shows field errors · with no contact configured, the form says it is **not connected and nothing was sent** · contact links stay hidden until configured · with an email configured, links appear and the form opens a pre-filled email |
| Portfolio | Project filter (2 open-source results) · case-study dialog opens/closes and restores focus · demo links show a notice |
| Startup | Preview tabs by click and arrow keys · annual pricing toggle ($8 → $6.40) · invalid email rejected · demo sign-up says nothing was stored |
| Salon | Open/closed badge computed in Africa/Lagos time · today highlighted · lightbox open and next · booking validation · booking preview with "nothing has been sent" note · sample phone number explained |
| Agency | Service tabs · strategy filter (3 results) · project dialog |
| Event | Countdown running (about 218 days on the test date) · Day 2 tab · track filter · registration dialog clearly says registration isn't open |
| Product | Category filter (3 face products) · add-to-list count · details dialog with quantity · order list totals · WhatsApp message preview with items, total and name |

## 4. Deployment paths

- All links between the main site and the demos are **relative** (`demos/<name>/index.html`, `../../index.html#work`), so they work at a domain root, inside a GitHub Pages project sub-path, and when opening the files directly.
- `404.html` is self-contained (no relative assets) and rewrites its links on `*.github.io` project sites.
- No external requests: fonts are self-hosted, and there are no CDNs or analytics.

## 5. Performance notes

- Main page: one CSS file, two small scripts (≈10 KB together), two variable fonts (≈115 KB), preview screenshots as WebP (35–57 KB each, lazy-loaded below the fold, with explicit `width`/`height` to prevent layout shift).
- Demos: one CSS and one JS file each, with SVG artwork (mostly under 10 KB per image) and preloaded display fonts.

## 6. Not tested / known limitations

- **No real browsers other than Chromium were automated.** Firefox and Safari (especially iOS Safari) should be checked by hand before launch. The code uses widely supported features (`<dialog>`, CSS `clamp()`, `:focus-visible`, `text-wrap: balance` as an optional enhancement).
- **Screen reader testing was not performed** (NVDA/VoiceOver). The structure follows WAI-ARIA patterns, but a manual pass is recommended.
- **Contact details are intentionally empty.** Until `js/config.js` is filled in, the live contact form cannot deliver enquiries (it says so honestly).
- **The `mailto:` fallback depends on the visitor having an email app.** A form endpoint (e.g. Formspree) is more reliable.
- **No real client projects are listed yet.** The section shows an honest placeholder.
- **About section photo** is a monogram placeholder until an approved photo is supplied.
- **Domain placeholders** (`your-domain.example`) must be replaced for canonical URLs, Open Graph and the sitemap to be valid.
- **Demo artwork is illustrative SVG**, not photography; client builds should use real photos.
- **Lighthouse scores were not recorded.** Run Lighthouse on the deployed URL for real-network performance figures.
