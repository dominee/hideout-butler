# DEPLOY.md — Hideout Butler marketing site

Runbook for building and deploying the static presentation website (`hideoutbutler.com` / `www.hideoutbutler.com`) on **Cloudflare Workers & Pages** (Git-connected project with a mandatory deploy command).

The live **application** (`app.hideoutbutler.com`, API, admin) is deployed separately from the [PoE2-butler](https://github.com/dominee/PoE2-butler) repository (VM + Traefik).

---

## 1. What gets deployed

| Item | Detail |
|------|--------|
| **Repository** | `hideout-butler` (this repo) |
| **Stack** | Astro 5 **static** prerender + `@astrojs/cloudflare` adapter → `dist/` + `_worker.js` |
| **Host** | Cloudflare Worker (assets + minimal SSR shell; all routes prerendered) |
| **Public URLs** | `https://hideoutbutler.com`, `https://www.hideoutbutler.com` |
| **Canonical site URL** | `https://hideoutbutler.com` (set in [`astro.config.mjs`](astro.config.mjs)) |
| **Output path** | [`wrangler.jsonc`](wrangler.jsonc) → `assets.directory: "./dist"` (not a separate dashboard field) |

Build output is a single prerendered page (`/index.html`) plus `/_astro/` assets and `/screenshots/` PNGs.

**Do not** add `public/_redirects` with `/* /index.html 200` — Wrangler rejects it with error **10021** (infinite loop). The `@astrojs/cloudflare` adapter emits `dist/_redirects` during build; [`scripts/strip-redirects.mjs`](scripts/strip-redirects.mjs) removes it in `npm run build` before deploy.

**Commit** `@astrojs/cloudflare`, [`astro.config.mjs`](astro.config.mjs), and [`wrangler.jsonc`](wrangler.jsonc) **before** the first CI deploy. If they are missing, `npx wrangler deploy` auto-runs `astro add cloudflare`, mutates the repo in CI, and may still fail on `_redirects`.

---

## 2. Prerequisites

- Cloudflare account with the **`hideoutbutler.com`** zone.
- GitHub repository connected under **Workers & Pages → Create → Worker → Connect to Git** (or equivalent Git-connected Workers project).
- **Node 22** via `NODE_VERSION=22` environment variable.

Local verification without host Node: Docker (§6).

---

## 3. Cloudflare dashboard settings

### 3.1 Build & deploy commands

In **Settings → Builds & deployments** (exact labels vary; there may be **no** “Build output directory” field — output is defined in [`wrangler.jsonc`](wrangler.jsonc)):

| Setting | Value |
|---------|-------|
| **Production branch** | `main` (or your default branch) |
| **Build command** | `npm run build` |
| **Deploy command** | `npx wrangler deploy` |

Wrangler reads [`wrangler.jsonc`](wrangler.jsonc) and uploads `./dist` (assets + `_worker.js` entry). With committed config, CI does **not** run interactive `astro add cloudflare`.

Optional combined command (if the UI only allows one step):

```bash
npm run build && npx wrangler deploy
```

Use **either** separate build + deploy commands **or** the combined line — not both building twice.

### 3.2 Environment variables

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `22` |

Cloudflare injects `CLOUDFLARE_API_TOKEN` / account context for `wrangler deploy` in CI — no manual token in the repo.

### 3.3 Custom domains

Attach custom domains on the **Worker** (or linked Pages/Workers project):

- `hideoutbutler.com`
- `www.hideoutbutler.com`

Follow the dashboard DNS prompts (proxied CNAME to the Workers/Pages hostname).

**www → apex (optional):** Cloudflare **Redirect Rules** — e.g. `www.hideoutbutler.com/*` → `https://hideoutbutler.com/$1` (301).

### 3.4 SSL

Edge TLS is automatic. No Origin CA certificate (that applies to the PoE2-butler VM only).

---

## 4. How deploy works

```text
Git push (main)
  → CI: npm/bun install
  → npm run build          → Astro static + strip dist/_redirects → dist/
  → npx wrangler deploy    → Worker + assets per wrangler.jsonc
  → hideoutbutler.com
```

[`wrangler.jsonc`](wrangler.jsonc):

```jsonc
{
  "name": "hideout-butler",
  "main": "./dist/_worker.js/index.js",
  "assets": { "directory": "./dist", "binding": "ASSETS" }
}
```

`output: "static"` in Astro — pages are prerendered; the worker only serves assets and the built shell.

---

## 5. Repository layout (deploy-relevant)

```text
hideout-butler/
├── astro.config.mjs      static output + @astrojs/cloudflare adapter
├── wrangler.jsonc        main + assets (required — prevents CI auto-setup)
├── scripts/strip-redirects.mjs  removes adapter-generated dist/_redirects
├── package.json          build script + wrangler devDependency
├── public/
│   ├── favicon.svg
│   └── screenshots/      committed PNGs (OG image + gallery)
├── src/
├── Dockerfile            local preview only
└── docker-compose.yml
```

Commit **`public/screenshots/`** — Open Graph uses `/screenshots/Screenshot.png`.

---

## 6. Local build and preview

### 6.1 Docker (no host Node/npm)

```bash
docker compose up --build    # http://localhost:8080
docker build -t hideout-butler-site .
```

Docker does **not** run `wrangler deploy` — it serves `dist/` with nginx locally.

### 6.2 Node + Wrangler (optional)

```bash
npm install
npm run build
npm run deploy    # needs Cloudflare credentials locally
```

---

## 7. Post-deploy checklist

- [ ] `https://hideoutbutler.com` loads
- [ ] `/screenshots/Screenshot.png` returns 200
- [ ] Footer GGG disclaimer verbatim
- [ ] **Open App** → `https://app.hideoutbutler.com`
- [ ] View source: canonical, `og:image`, JSON-LD present

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
|---------|--------|-----|
| **10021** infinite loop on `_redirects` | `dist/_redirects` from adapter (or `public/_redirects`) | Ensure `npm run build` runs [`strip-redirects.mjs`](scripts/strip-redirects.mjs); redeploy |
| CI runs `astro add cloudflare` / mutates repo | `wrangler.jsonc` + adapter not pushed yet | Push committed `astro.config.mjs`, `wrangler.jsonc`, `package.json` |
| Bun install skips `wrangler` | Old `package.json` on remote | Push `package.json` with `wrangler` devDependency |
| Build OK, deploy fails | Wrong deploy command | Use `npx wrangler deploy` after `npm run build` |
| 404 on screenshots | PNGs not in `public/screenshots/` | Commit assets under `public/screenshots/` |
| Wrangler prompts interactively in CI | Missing `wrangler.jsonc` in repo | Commit config; pin `wrangler` in `package.json` |

If a failed CI run **modified** files on the remote branch, reset to this repo’s committed versions (`astro.config.mjs`, `wrangler.jsonc`, `package.json`) and redeploy.

---

## 9. Related docs

| File | Purpose |
|------|---------|
| [README.md](README.md) | Quick start |
| [AGENTS.md](AGENTS.md) | Agent context |
| [PoE2-butler/DEPLOY.md](https://github.com/dominee/PoE2-butler/blob/main/DEPLOY.md) | App VM / Traefik |

---

## 10. Summary

| Dashboard field | Value |
|-----------------|-------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Output directory | *(not in UI)* → `./dist` in [`wrangler.jsonc`](wrangler.jsonc) |
| `NODE_VERSION` | `22` |

Local parity: `docker compose up --build` → http://localhost:8080
