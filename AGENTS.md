# AGENTS.md

## Purpose
Public privacy-first password/passphrase/username generator (`pass.airat.top`).

## Repository Role
- Category: `*.airat.top` (public static tool).
- Deployment platform: Cloudflare Workers (static assets).
- Deployment configuration: `wrangler.jsonc`.
- Main content directory: `public_html`.

## Content and Structure
- Main page: `public_html/index.html`.
- Styling: `public_html/styles.css`.
- Logic: `public_html/app.js`.
- Word list: `public_html/wordlist.js`.

## Site Conventions
- Keep UI style consistent with AiratTop tools.
- Keep SEO metadata and social tags in `index.html`.
- Keep the Google Analytics counter and other required site-verification tags.
- Publish static assets from `public_html`.

## AI Working Notes
- Preserve fully local generation (`window.crypto`) and no backend dependency.
- Keep `pass.airat.top` as the primary domain and preserve the `password.airat.top` redirect.
