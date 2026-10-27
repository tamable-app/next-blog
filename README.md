# Tamable Next.js blog

A [Next.js](https://nextjs.org) starter for a blog whose posts live in a [Tamable](https://tamable.app) workspace. You write, review and publish in Tamable; this site renders what you published and refreshes itself when something changes, without a rebuild.

It gives you:

- Posts at `/blog/{slug}`, with tags, series, reading time, cover images and the SEO fields you set in Tamable (title, description, canonical URL, Open Graph, JSON-LD)
- Tag pages at `/tags/{tag}` and series pages at `/series` and `/series/{slug}`
- Draft previews at `/preview/{token}`: never cached, never indexed
- An RSS feed (`/rss.xml`), a sitemap and `robots.txt`
- Permanent redirects for posts you renamed in Tamable, and optionally for the addresses of an old Ghost blog
- A webhook that checks Tamable's signature before refreshing the site's content
- Light and dark themes, both driven by CSS variables

Pages are statically generated and cached. Tamable's webhook tells the site when published content changed, and the affected pages are rebuilt on their next visit.

It's built on [@tamable/blog-kit](https://github.com/tamable-app/blog-kit), which reads Tamable's API, maps posts for the pages, builds the feeds and redirects, and checks the webhook.

## Quick start

You need Node 22.22.3 or newer, or 24.15 or newer.

```sh
npm install
cp .env.example .env.local   # then fill it in, see below
npm run dev                  # http://localhost:3000
```

To try it without a Tamable workspace, run the fake API, which serves a few made-up posts:

```sh
npm run fake-tamable &
TAMABLE_API_URL=http://localhost:4010/api/v1 TAMABLE_READ_KEY=fixture npm run dev
```

## Connect it to Tamable

In Tamable, go to **Settings › Sites** (you need to be a workspace owner) and create a site:

| Field | Value |
|---|---|
| Address | `https://yourblog.com` |
| Blog URL pattern | `/blog/{slug}` |
| Preview URL pattern | `https://yourblog.com/preview/{token}` |
| Deploy webhook | `https://yourblog.com/api/deploy` |

Then, on the same page:

1. Create a **read key**. It's shown once: put it in `TAMABLE_READ_KEY`.
2. Copy the deploy webhook's **signing secret** into `TAMABLE_WEBHOOK_SECRET`.

Tamable's docs cover the [read API](https://docs.tamable.app/read-api), [preview links](https://docs.tamable.app/preview-links) and the [deploy webhook](https://docs.tamable.app/deploy-webhook) in detail.

## Environment variables

Set these on your host. Only `NEXT_PUBLIC_SITE_URL` reaches browser code; the key and the secret are read on the server alone.

| Variable | What it is |
|---|---|
| `TAMABLE_READ_KEY` | The site's read key. Keep it out of the repo |
| `TAMABLE_WEBHOOK_SECRET` | The deploy webhook's signing secret |
| `NEXT_PUBLIC_SITE_URL` | The canonical address, with no trailing slash. Falls back to `url` in `site.config.ts`. Read at build time |
| `TAMABLE_API_URL` | Only if you don't use `https://api.tamable.app/api/v1` |
| `DEPLOY_HOOK_URL` | Optional: a build hook to call on each change as well, for hosts that serve a static copy |
| `ALLOW_EMPTY_BLOG` | `true` to allow a build with no published posts. By default the build stops instead, so a misconfigured key can't publish an empty blog |

## How publishing works

1. You publish a post in Tamable, publish changes to one, or delete one.
2. About a minute later, once you've stopped making changes, Tamable calls `/api/deploy` with a signed request.
3. The site checks the signature and the timestamp, makes sure Tamable answers, and revalidates everything it read from Tamable.
4. Each page keeps serving what it has until its next visit, which rebuilds it in the background. The visit after that sees the change. A new post renders on its first visit.

There is no rebuild and no redeploy. If Tamable can't be reached, the site keeps serving what it has, and the webhook answers 502 so Tamable tries again. Cached content also refreshes on its own once a day, in case a webhook went missing.

Everything read from Tamable goes through Next's data cache under one tag, `tamable` (see `lib/tamable.ts`). The webhook calls `revalidateTag('tamable', 'max')`, which marks that data and every page built from it as stale.

## Redirects

Two kinds of redirect, handled in two places:

- **Trailing slashes:** `proxy.ts` answers `/blog/` with a 301 to `/blog`. It needs no data, so it runs on every request.
- **Renamed posts and old Ghost addresses:** when an address matches no post or page, the page checks the redirect map before answering 404 (`redirectIfMoved` in `lib/tamable.ts`). The kit builds the map from the same cached Tamable data as the pages, so it changes with them when the webhook revalidates. These are 308s, the status Next gives a permanent redirect from a page; search engines treat 308 like 301.

The map isn't checked in `proxy.ts` because Next's data cache isn't available there: every request would read Tamable. When a post is renamed, the webhook also expires its old address outright, so it turns into a redirect on its very next visit.

To answer an old Ghost blog's post, tag, author and feed addresses, set `ghostRedirects: true` in `site.config.ts`.

## Make it yours

- **Name, author and links:** `site.config.ts`. This is also where you turn on Ghost redirects if you're moving from Ghost.
- **Colors, fonts and sizes:** `app/tokens.css`. Every color comes from a variable there, for light and dark. Fonts are loaded with `next/font` in `app/layout.tsx`.
- **Post body styles:** `app/prose.css`. In development, `/dev/blocks` shows every block Tamable can send.
- **About page:** `app/(site)/about/page.tsx`.
- **Header links:** `components/SiteHeader.tsx`.

## Deploying

**Vercel:** import the repository, set the environment variables, deploy. The data cache and revalidation work out of the box.

**Any Node host:** build with `npm run build`, then start with `npm start` (port 3000, or set `PORT`). The cache lives in `.next/cache` on disk, so keep that folder between restarts, and give every instance the same cache if you run more than one (Next's `cacheHandler` option).

If your host serves a static copy of the site instead, set `DEPLOY_HOOK_URL` to its build hook: the webhook calls it after revalidating.

## Development

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc` with Next's route types |
| `npm test` | Vitest |
| `npm run build` | Builds the site, prerendering every published post |
| `npm start` | Serves the build |
| `npm run fake-tamable` | A fake Tamable on port 4010, read key `fixture` |

CI runs lint, type check and tests, then builds against the fake Tamable, so it never needs a read key.

## License

MIT
