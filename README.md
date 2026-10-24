# Passforge

A fast, offline password generator built with SolidJS, TypeScript, Vite, and UnoCSS.

Passwords are created in the browser with `crypto.getRandomValues()` and unbiased
rejection sampling. Nothing is sent to a server, stored, or logged.

## Features

- Cryptographically secure generation with at least one character from every enabled set
- Length 8–64, four character sets, and an option to exclude look-alikes (`I l 1 O 0 o`)
- Click-to-copy with per-character wave feedback and a clipboard fallback for non-secure contexts
- Compact strength estimate with entropy in bits
- Hide toggle, keyboard access, and reduced-motion support
- Minimal dark UI with a self-hosted type stack (Inter + JetBrains Mono)

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
  styles/theme.css            Design tokens, animations, range styling
tests/password.test.ts        Generator and strength tests
wrangler.jsonc                Cloudflare Workers static-assets config
```

## Deployment

Live at [passforge.newkubise.workers.dev](https://passforge.newkubise.workers.dev).

`bun run deploy` builds the SPA and uploads `dist/` to Cloudflare Workers
static assets with SPA fallback. No secrets are required in the repo; Wrangler
uses the local OAuth session.

## Security notes

- Uses `crypto.getRandomValues()` with rejection sampling; no `Math.random()`
- Clipboard writes prefer the async Clipboard API and fall back to a temporary textarea
- No analytics, network requests, persistence, or third-party scripts
