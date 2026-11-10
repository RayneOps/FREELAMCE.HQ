# Usman — Web Design & Development

The freelance website for **Usman Abubakar**, plus six standalone concept demo websites. Everything is plain HTML, CSS and vanilla JavaScript: there's no framework, no build step and no backend. It runs on any static host (GitHub Pages, Netlify, Vercel, cPanel, etc.).

| Site | Path | What it shows |
| --- | --- | --- |
| Main freelance site | `index.html` | Services, pricing, work, process, about, FAQ, contact |
| Personal portfolio — *Tolu Martins* | `demos/personal-portfolio/` | Typography-led developer portfolio, project filter, case-study dialogs |
| Startup landing — *Tidewell* | `demos/startup-landing/` | SaaS launch page, interactive product preview, monthly/annual pricing |
| Small business — *Ivory & Oak* | `demos/small-business/` | Salon site, price list, gallery lightbox, live opening hours, booking request |
| Agency — *Marrow & Field* | `demos/agency-website/` | Editorial agency site, service tabs, filterable project gallery |
| Event — *LATTICE 2027* | `demos/event-website/` | Conference site, countdown, two-day agenda with track filter, tickets |
| Product showcase — *Oyela Botanics* | `demos/product-showcase/` | Skincare catalogue, filters, product details, WhatsApp order list |

Every demo uses a fictional brand. Each one shows a "Concept demo" notice bar, carries `noindex` and links back to the main site.

---

## 1. Before you deploy (checklist)

1. **Contact details** — edit [`js/config.js`](js/config.js). Fill in `email`, plus `whatsapp`, `linkedin` and `github` if you want them. Any value left empty is hidden automatically.
   - With no email, WhatsApp or form endpoint set, the contact form shows *"this form isn't connected yet"*. It never pretends to send. **Set at least `email` before going live.**
   - Optional: set `formEndpoint` to a form service such as [Formspree](https://formspree.io) so enquiries arrive without opening the visitor's email app.
2. **Your domain** — search the project for `your-domain.example` and replace it with your real address (e.g. `https://usman.dev` or `https://yourname.github.io/freelance-websites`). It appears in:
   - `index.html` (canonical, Open Graph, structured data)
   - `privacy.html` (canonical)
   - `sitemap.xml` and `robots.txt`
3. **Your photo** — in `index.html`, find the comment `PHOTO:` in the About section and swap the monogram placeholder for an `<img>` (around 600×720, WebP or JPEG).
4. **Real client projects** — see §4. Until you add some, the "Real projects" area shows an honest placeholder note.
5. **Review the copy** — check the About text, FAQ answers (especially payment and timelines) and prices against how you actually work.

## 2. Preview locally

Pages link to each other with relative paths, so you can double-click `index.html`. For a result identical to hosting, run a tiny local server from this folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## 3. Deploy

Deploy the **contents of this folder** as the site root. The six demos deploy with it automatically, so one URL serves everything.

### GitHub Pages
1. Create a repository (e.g. `freelance-websites`) and push these files to the `main` branch.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`**.
3. Your site appears at `https://<username>.github.io/freelance-websites/`. The included `.nojekyll` file stops Jekyll from processing the files, and `404.html` is used automatically.
4. To use your own domain, add it under **Settings → Pages → Custom domain**, then update `your-domain.example` (checklist step 2).

### Netlify
- Drag and drop this folder onto **app.netlify.com/drop**, *or* connect the GitHub repository with **Build command: none** and **Publish directory: `.`** (the folder root).

### Vercel
- **Add New → Project →** import the repository, choose **Framework Preset: Other**, leave the build command empty and the output directory as the root.

After deploying, open the live URL and click through: every service card, every **View Live Demo** button, the back-links in each demo, and a test enquiry through the contact form.

## 4. Updating the main site

**Prices and service descriptions** — in `index.html`:
- *Services* section: each `<article class="service-card">` holds the icon, price (`<p class="price">`), description, "Ideal for" line and deliverables list.
- *Pricing* section: each `<article class="price-card">`.
- If you rename a service, keep the `data-service="…"` value on its "Request a Quote" link identical to an `<option>` in the contact form's **Website type** select. That's how the quote button pre-selects the type.

**Adding a real project** — in the *Work* section there is a commented template that starts with `To add a real project`. Copy it inside `<div class="real-grid">`, fill it in, and delete the `<div class="real-empty">` block. Only publish work you have permission to show. Save screenshots to `assets/screens/` (1280×800 WebP works well).

**Adding another concept demo** — copy an existing folder in `demos/`, rebrand it, then add a matching `project-card` in the *Concept demonstrations* grid and a footer link.

**Regenerating preview screenshots** — the images in `assets/screens/` are real screenshots of the demos (desktop 1280×800, mobile 390×844 at 1.5×). Replace them with fresh WebP screenshots if you change a demo's design.

## 5. Turning a demo into a client website

Each demo folder is self-contained (its own `index.html`, `css/`, `js/`, `assets/`), so you can copy one folder to start a client project. See **[docs/CUSTOMIZING.md](docs/CUSTOMIZING.md)** for a step-by-step guide per demo, covering where the brand colours, fonts, content, WhatsApp number, booking and sign-up settings live.

## 6. Project structure

```
freelance-websites/
├── index.html            Main freelance website
├── privacy.html          Privacy notice
├── 404.html              Self-contained "page not found"
├── robots.txt, sitemap.xml, .nojekyll
├── css/main.css          Main site styles (tokens at the top)
├── js/config.js          ← contact details & form settings
├── js/main.js            Navigation, reveal animations, contact form
├── assets/
│   ├── fonts/            Self-hosted WOFF2 fonts + OFL licences
│   ├── img/              Favicon, Open Graph image
│   └── screens/          Demo screenshots used on the main site
├── demos/<name>/         Six standalone sites: index.html, css/, js/, assets/
└── docs/
    ├── CUSTOMIZING.md    Guide to reusing demos for clients
    ├── TESTING.md        Test report
    └── screenshots/      Desktop / tablet / mobile captures (not needed for deployment)
```

## 7. Assets and licensing

- **Fonts**: Bricolage Grotesque, JetBrains Mono, Instrument Serif, Inter, Geist, Geist Mono, Cormorant Garamond, Jost, Fraunces, Archivo, Unbounded, Space Grotesk, Bodoni Moda and DM Sans. All are SIL Open Font License 1.1, self-hosted (Latin subset), with each licence file stored next to the font.
- **Illustrations and icons**: original SVG artwork made for this project, with no stock photography. In each demo, replace them with the client's own photography.
- **No third-party requests**: no CDNs, analytics, cookies or tracking scripts.

## 8. Known limitations

See the end of [docs/TESTING.md](docs/TESTING.md).
