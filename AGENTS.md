# AGENTS.md — Hideout Butler website

AI-agent context for the presentation website repository.

## Purpose

Static marketing site for **PoE2 Hideout Butler** (main app: [PoE2-butler](https://github.com/dominee/PoE2-butler)).

- **Production:** `hideoutbutler.com`, `www.hideoutbutler.com`
- **App:** `app.hideoutbutler.com`
- **Host:** Cloudflare Pages (build on push)

## Stack

- Astro 5 (static output)
- Tailwind CSS with design tokens mirrored from the main app (`ink`, `ember`, `parchment`, `rarity`)
- Fonts: Cinzel (display), Inter (body)

## Page structure

Single page ([`src/pages/index.astro`](src/pages/index.astro)) section order:

1. Nav (sticky; favicon + links including How it works, Privacy)
2. Hero + StatusBanner (availability pills)
3. HowItWorks → Features (grouped: Inspect / Trade / Share / Track) → Screenshots → UseCases
4. Privacy → Limitations → Roadmap → FAQ → CtaBand
5. Footer + MobileStickyBar

## Assets

Source screenshots in `screenshots/`; deployed copies in `public/screenshots/`.

## Mandatory copy

Footer must include verbatim GGG disclaimer:

> This product isn't affiliated with or endorsed by Grinding Gear Games in any way.

## Messaging rules (2026-06)

- **Live in production:** GGG OAuth2 with `account:profile` + `account:characters`; equipped gear via PoE2 `/character/poe2` API; paper doll and table views; activity diffs for character gear; runeforged item styling.
- Do **not** imply live prod stash — GGG PoE2 stash OAuth scope is not available yet.
- Stash feature card carries “Blocked on GGG API” badge; stash screenshots labelled demo/dev.
- **`account:leagues` not granted** — league picker is inferred from character data; mention in Limitations / FAQ when relevant.
- Data is snapshot-based (manual Refresh); pricing refined on explicit user action.
- Public share links are world-readable — warn in Privacy and FAQ.
- UAT on the app side uses live GGG (not mock); this marketing site does not host UAT — only describe prod app behavior unless asked.

## Build & test

**Local (no npm on host):** use Docker.

```bash
docker compose up --build    # preview at http://localhost:8080
docker build -t hideout-butler-site .
```

**Cloudflare:** `npm run build` then `npx wrangler deploy`; assets path in [`wrangler.jsonc`](wrangler.jsonc). Set `NODE_VERSION=22`.

See [DEPLOY.md](DEPLOY.md).

## SEO

[`Layout.astro`](src/layouts/Layout.astro): canonical, Open Graph, Twitter cards, JSON-LD SoftwareApplication.
