# Hideout Butler — presentation website

Static marketing site for [PoE2 Hideout Butler](https://github.com/dominee/PoE2-butler), hosted on Cloudflare Pages at `hideoutbutler.com` and `www.hideoutbutler.com`.

## Local build & preview (Docker)

No local Node/npm required — use Docker for install, build, and preview:

```bash
# Build image and run nginx preview on http://localhost:8080
docker compose up --build

# Build only (verify CI-style build)
docker build -t hideout-butler-site .

# Run built image
docker run --rm -p 8080:8080 hideout-butler-site
```

Output is baked into the image at `/usr/share/nginx/html` (Astro `dist/`).

## Local development (optional, requires Node 22+)

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Cloudflare Pages

Cloudflare Git builds use a **mandatory deploy command** (no separate “Build output directory” field). Output path is in [`wrangler.jsonc`](wrangler.jsonc).

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | `22` (`NODE_VERSION=22`) |

Full setup: **[DEPLOY.md](DEPLOY.md)**.

## Links

- App: https://app.hideoutbutler.com
- GitHub: https://github.com/dominee/PoE2-butler
