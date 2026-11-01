# Lumora — Solar Energy Website + Admin (CRM & CMS)

A premium, mobile-first solar company website built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Motion** (Framer Motion) and **Lenis** smooth scroll — plus a full admin studio where the entire site, leads and blog are managed.

Design language: Apple-inspired calm (Geist + Instrument Serif italic accents, generous whitespace, glass surfaces) with a warm "sunrise" gradient that the admin can re-colour in one click.

## Quick start

```bash
npm install
npm run dev
```

- Website → http://localhost:3000
- Admin → http://localhost:3000/admin
  Demo login: `admin@lumora.solar` / `lumora@2026` (override via `.env.local`, see `.env.example`)

## Website features

| Area | What's inside |
| --- | --- |
| **Intro animation** | Cinematic sunrise loader — horizon line draws, sun rises with irradiance counter, wordmark reveals, curtain lifts. Toggle, wording, duration and "once per visit" controlled from admin. |
| **Navbar "Solar Island"** | Floating glass pill with scroll-progress sun ring, spring hover highlight, auto-compacts on scroll down, turns dark over dark sections. On mobile it morphs into a full menu sheet. |
| **Hero** | Masked word-by-word headline, image card that expands to full-bleed on scroll, live-generation / savings / CO₂ glass widgets. |
| **Scroll effects** | Word-by-word statement reveal, stacking service cards, sunrise-arc "How it works" timeline, pinned horizontal projects gallery, parallax CTA sun. |
| **Savings calculator** | Home / Society / Business, bill slider → system size, panels, roof area, subsidy (PM Surya Ghar), net cost, payback, 25-yr savings, CO₂. Captures the estimate as a lead. |
| **Other sections** | Partner marquee, animated stats, pricing packages, auto-playing testimonials, FAQ accordion, blog preview, final CTA, footer, floating WhatsApp. |
| **Pages** | `/`, `/services`, `/projects` (filterable), `/calculator`, `/blog`, `/blog/[slug]` (reading progress), `/about`, `/contact` (3-step quote form + map), custom 404. |

## Admin studio (`/admin`)

- **Dashboard** — KPIs (new leads, open pipeline, won revenue, win rate), 14-day lead inflow chart, pipeline funnel, lead sources, upcoming follow-ups.
- **CRM** — Kanban pipeline (New → Contacted → Site Survey → Proposal → Won / Lost) with drag & drop, table view with sorting, search & filters, CSV export, lead drawer with call/WhatsApp/email actions, editable details, priority, follow-up date and an activity/notes timeline. Every website form lands here automatically.
- **Website (CMS)** — edit every section: hero, intro animation, homepage section toggles, navigation, statement, stats, services, process, projects, packages, testimonials, FAQ, partners, about page, calculator assumptions. Reorder/duplicate/delete items, image upload + image library, live mobile preview (on wide screens).
- **Blog** — create/edit articles with markdown-lite editor + preview, cover image, slug, category, publish/draft toggle.
- **Settings** — brand name, tagline, colour presets / custom gradient (re-themes the whole site), contact, social links, reset demo data.

## Data

Content, leads and posts live in a JSON file at `data/db.json` (auto-created from `lib/seed.ts` on first run; git-ignored). All reads/writes go through `lib/db.ts`, so swapping to Postgres / MongoDB / Supabase only means re-implementing `getDB()` and `updateDB()`.

> Serverless hosts (e.g. Vercel) have a read-only filesystem — there the store falls back to in-memory. For production deploy on a Node server/VPS, or plug in a real database.

## Project structure

```
app/(site)/        public website pages
app/admin/         login + protected admin panel
components/site/   website sections & animation components
components/admin/  dashboard, CRM, CMS editor, blog editor, settings
lib/               types, seed content, db, auth, server actions, calculator
```
