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

Cloudflare builds with Node in CI — no Docker needed for deploy.

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (set `NODE_VERSION=22` in environment variables) |

Connect this repository in the Cloudflare Pages dashboard. Builds deploy automatically on push to the default branch.

## Links

- App: https://app.hideoutbutler.com
- GitHub: https://github.com/dominee/PoE2-butler
