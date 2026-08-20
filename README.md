# pass.airat.top

[![pass.airat.top](https://raw.githubusercontent.com/AiratTop/pass.airat.top/main/public_html/screenshot.png)](https://pass.airat.top/)

Static, privacy-first toolkit for generating passwords, passphrases, and usernames directly in the browser. Deployed as static assets on Cloudflare Workers.

- Live site: https://pass.airat.top
- Redirect: https://password.airat.top
- Status page: https://status.airat.top

## Advantages

- Fully local generation using `window.crypto`.
- Password generator with flexible length and character controls.
- Passphrase generator with customizable separator and word count.
- Username generator from a local word list.
- No history or analytics; only local settings are stored.
- Instant copy on click with clear feedback.
- Mobile-first layout that scales to desktop.
- Offline-friendly static files for easy hosting.

## What is inside

- `public_html/index.html` — layout and metadata.
- `public_html/styles.css` — theme, layout, and animations.
- `public_html/app.js` — generator logic and UI wiring.
- `public_html/wordlist.js` — local word list for passphrases and usernames.
- `wrangler.jsonc` — Cloudflare Worker and static asset configuration.

## Deployment

Cloudflare Workers Builds deploys the contents of `public_html` as static assets. The project has no build step; deployment uses `npx wrangler deploy` with the settings in `wrangler.jsonc`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**AiratTop**

- Website: [airat.top](https://airat.top)
- GitHub: [@AiratTop](https://github.com/AiratTop)
- Email: [mail@airat.top](mailto:mail@airat.top)
- Repository: [pass.airat.top](https://github.com/AiratTop/pass.airat.top)
