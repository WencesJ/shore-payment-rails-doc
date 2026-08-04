# Shore Fiat Rails — merchant docs site

Markdown source for the merchant documentation, built with [VitePress](https://vitepress.dev) (Node 18+).

## Local preview

```bash
npm ci
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # output in .vitepress/dist
npm run preview
```

The build **fails on dead internal links**, so a broken cross-reference blocks the deploy rather than shipping.

## Publish

### Option A — Vercel or Netlify (fastest)

Import the repo. Both auto-detect VitePress; if asked:

- Build command: `npm run build`
- Output directory: `.vitepress/dist`

Every push to `main` redeploys. Add `docs.shore.so` in the dashboard when ready.

### Option B — GitHub Pages

1. Push to a GitHub repo on `main`.
2. **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push. `.github/workflows/deploy.yml` builds and deploys the site.

The VitePress base path is inferred from the GitHub repository name for project
Pages URLs such as `https://<org>.github.io/<repo>/`. For a custom domain, create
a repository Actions variable named `DOCS_BASE` with the value `/`.

## Editing

- Pages live in `getting-started/`, `api/`, `guides/`, and `reference/`. `index.md` is the landing page.
- Adding a page: create the `.md` file, then add it to the `sidebar` array in `.vitepress/config.mjs`.
- Cross-links are written as relative `.md` paths (`../api/payouts.md`); VitePress rewrites them at build.
- The "Edit this page" URL is inferred from `GITHUB_REPOSITORY` during deployment.

## Adding the OpenAPI spec later

`FIAT_RAILS_OPENAPI.yaml` can be rendered as interactive endpoint pages. Two common approaches:

- Embed Scalar or Swagger UI in a custom page (`.vitepress/theme`), pointing at the spec file in `public/`.
- Or generate markdown from the spec at build time and drop it into `api/`.

Either gives merchants a live sandbox console next to these guides.
