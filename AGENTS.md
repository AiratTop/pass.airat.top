# AGENTS.md

## Purpose
Public privacy-first password/passphrase/username generator (`pass.airat.top`).

## Repository Role
- Category: `*.airat.top` (public static tool).
- Deployment platform: Cloudflare Pages.
- Main content directory: `public_html`.

## Content and Structure
- Main page: `public_html/index.html`.
- Styling: `public_html/styles.css`.
- Logic: `public_html/app.js`.
- Word list: `public_html/wordlist.js`.

## Site Conventions
- Keep UI style consistent with AiratTop tools.
- Keep SEO metadata and social tags in `index.html`.
- Keep required counters/verification tags (Google Analytics + Yandex verification).
- Publish static assets from `public_html`.

## AI Working Notes
- Preserve fully local generation (`window.crypto`) and no backend dependency.
- Keep compatibility for both domains: `pass.airat.top` and `password.airat.top`.
