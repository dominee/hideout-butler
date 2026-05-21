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

## Layout

Single page (`src/pages/index.astro`) with sections: Nav, Hero, Features, Screenshots, Limitations, Roadmap, FAQ, Footer.

## Assets

Source screenshots live in `screenshots/` (may be local-only). Deployed copies are in `public/screenshots/` (committed for Cloudflare Pages).

## Mandatory copy

Footer must include verbatim GGG disclaimer:

> This product isn't affiliated with or endorsed by Grinding Gear Games in any way.

## Build & test

**Local (no npm on host):** use Docker.

```bash
docker compose up --build    # preview at http://localhost:8080
docker build -t hideout-butler-site .   # build-only verification
```

Multi-stage `Dockerfile`: Node 22 Alpine builds → nginx 1.27 Alpine serves `dist/`.

**Cloudflare Pages:** Node 22 in CI runs `npm run build`; output `dist/`. Set `NODE_VERSION=22`.

See [README.md](README.md) for operator runbook.

## Key limitations to communicate

- GGG has no PoE2 stash OAuth scope yet — live stash from real API is blocked upstream.
- Pricing is indicative (poe.ninja + optional GGG trade API).
- Not affiliated with GGG.
