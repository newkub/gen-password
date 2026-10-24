# gen-password

A fast, offline password generator built with SolidJS, TypeScript, Vite, and UnoCSS.

Passwords are created in the browser with `crypto.getRandomValues()` and unbiased
rejection sampling. Nothing is sent to a server, stored, or logged.

Live at [gen-password.newkubise.workers.dev](https://gen-password.newkubise.workers.dev).

## Features

- One click gives a cryptographically secure 20-character password using lower, upper, digits, and symbols
- Click-to-copy with per-character wave feedback and a clipboard fallback for non-secure contexts
- Side-by-side Random and Copy (primary) actions, with the password as the only hero element
- Hide/reveal toggle and keyboard access
- Charcoal UI with a faint warm glow, subtle grid and grain background, bundled type stack (Inter + JetBrains Mono), and `prefers-reduced-motion` support
- Simple buttons with a cream solid Copy action, a thin-outline Random action, and an orange copied state
- Staggered card-flip reveal whenever a new password is generated

## Scripts

```bash
bun install
bun run dev       # dev server
bun run check     # TypeScript
bun run test      # Vitest
bun run build     # typecheck + production build
bun run preview   # serve dist
bun run deploy    # build + deploy to Cloudflare Workers
```

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` / `Space` on the password | Copy |
| `Ctrl` / `Cmd` + `Enter` | Generate a new password |

## Structure

```
src/
  App.tsx                     UI, state, copy flow
  components/
    PasswordDisplay.tsx       Per-character rendering and animations
    Icons.tsx                 Inline SVG icons
  lib/
    password.ts               Secure generation and strength math
    clipboard.ts              Async clipboard + legacy fallback
    motion.ts                 Reduced-motion aware animation helpers
  styles/theme.css            Design tokens and animations
tests/password.test.ts        Generator and strength tests
wrangler.jsonc                Cloudflare Workers static-assets config
```

## Deployment

The Worker `gen-password` serves `dist/` as Cloudflare Workers static assets with
SPA fallback.

- Build output: `bun run build`
- Manual deploy: `bun run deploy`
- No secrets are stored in the repo; Wrangler uses the local OAuth session

For continuous deployment, connect the GitHub repository in the Cloudflare
dashboard under **Workers & Pages → gen-password → Settings → Builds & deployments**
and use:

| Setting | Value |
| --- | --- |
| Build command | `bun run build` |
| Deploy command | `bunx wrangler deploy` |
| Root directory | `/` |

## Security notes

- Uses `crypto.getRandomValues()` with rejection sampling; no `Math.random()`
- Clipboard writes prefer the async Clipboard API and fall back to a temporary textarea
- No analytics, network requests, persistence, or third-party scripts
