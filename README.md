# ganitweb

Marketing site for [GanitAR](https://apps.apple.com/in/app/ganitar/id676397412),
an iPhone and iPad augmented-reality math app. Built with Next.js 16 (App
Router, Turbopack) and Tailwind.
 
## Pages

- `/` — home, feature cards, what's inside, trust, students/teachers
- `/support` — FAQ + contact form
- `/privacy` — privacy policy
- `/api/contact` — POST endpoint, Resend-backed, IP rate-limited
- `/opengraph-image` — dynamic OG card via `next/og`

## Develop

```bash
npm install
npm run dev    # http://localhost:3000
```

For the contact form to send mail in dev or prod, set
`RESEND_API_KEY` in `.env.local`. Without it, the form gracefully degrades
to a "temporarily unavailable" error.

## Deploy

Vercel. `npm run build` produces a clean static build for `/`, `/privacy`,
and `/support`, with `/api/contact` and `/opengraph-image` as dynamic.
