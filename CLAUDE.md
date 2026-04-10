# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **Diana Chu Therapy** — a private therapy practice at `dianachutherapy.com` serving executives and founders in California and Florida. Focus: peak performance mental health, individual therapy, and couples therapy.

## Development

No build tools or frameworks. Open files directly in a browser or use a local dev server:

```bash
# Quick local server (Python)
python3 -m http.server 8000

# Or with Node
npx serve .
```

Edit HTML/CSS/JS files directly — changes are reflected on browser refresh.

## Site Structure

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, services summary, CTA, testimonials |
| `about.html` | About Diana — credentials, approach, philosophy |
| `services.html` | Individual therapy + couples therapy detail pages |
| `faq.html` | Common questions about telehealth, insurance, process |
| `contact.html` | Contact form + telehealth logistics |
| `css/styles.css` | All styles — single stylesheet |
| `js/main.js` | All JS — nav, form handling, scroll behavior |
| `images/` | Optimized assets (WebP preferred) |

## Design System

**Aesthetic:** Premium minimal — generous whitespace, refined typography, muted palette. Think high-end wellness brand, not clinical.

- **Primary font:** Serif for headings (e.g. Cormorant Garamond or Playfair Display via Google Fonts)
- **Body font:** Clean sans-serif (e.g. Inter or DM Sans)
- **Color palette:** Warm neutrals (cream, warm white, soft taupe) with one muted accent (sage green or dusty rose — avoid cold blues)
- **No stock-photo clichés** — abstract textures or minimal photography only

## Key Content Requirements

- **Book a Consultation CTA** must appear on every page (hero, mid-page, footer)
- **Telehealth page/section** — clarify CA + FL licensure, how sessions work virtually
- **Contact form** fields: name, email, phone (optional), state (CA/FL), service interest, message
- **FAQ** should address: telehealth logistics, session length/frequency, insurance (likely out-of-network), confidentiality, Good Faith Estimate

## SEO Requirements

- Each page needs unique `<title>` and `<meta name="description">`
- Use semantic HTML5 elements (`<main>`, `<article>`, `<section>`, `<nav>`)
- Heading hierarchy: one `<h1>` per page, logical `<h2>`/`<h3>` structure
- `<img>` tags must include descriptive `alt` text
- Add `<link rel="canonical">` on each page
- Schema.org JSON-LD on index.html: `LocalBusiness` or `MedicalBusiness` type
- Target keywords: "therapy for executives", "couples therapy founders", "telehealth therapist California", "peak performance mental health"

## Mobile Responsiveness

- Mobile-first CSS — base styles for small screens, `min-width` media queries for larger
- Breakpoints: 768px (tablet), 1024px (desktop)
- Nav collapses to hamburger menu on mobile (`js/main.js` handles toggle)
- Touch-friendly tap targets (min 44×44px)

## Contact Form

The form submits via a third-party service (Formspree or Netlify Forms — no backend). On `contact.html`, the `<form>` action attribute should point to the chosen service endpoint. Form includes client-side validation in `js/main.js`.

## Compliance Notes

- Include a privacy policy link in the footer (HIPAA-adjacent — therapy site)
- "Good Faith Estimate" notice required (No Surprises Act) — add to FAQ or contact page
- Do not collect PHI through the contact form
