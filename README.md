> ![Status](https://img.shields.io/badge/status-in_development-red)

# gen-password

A single-screen password generator built with SolidJS, TypeScript, Vite, and UnoCSS. Every password is produced in the browser with `crypto.getRandomValues()` and unbiased rejection sampling — nothing is sent to a server, stored, or logged.

Live at [gen-password.newkubise.workers.dev](https://gen-password.newkubise.workers.dev).

![SolidJS](https://img.shields.io/badge/SolidJS-1.9-2c4f7c)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![UnoCSS](https://img.shields.io/badge/UnoCSS-66-1f2937)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020)

```text
┌──────────────────────────────────────────────────────────┐
│  options ──▶ CSPRNG ──▶ shuffle ──▶ render ──▶ clipboard │
│  length 20   random      mixes       20 chars   on click │
└──────────────────────────────────────────────────────────┘
```

## Get Started

1. Install dependencies — Bun installs SolidJS, Vite, UnoCSS, and the bundled fonts
   ```bash
   bun install
   ```

2. Start the dev server — Vite prints the local URL
   ```bash
   bun run dev
   ```

3. Verify a change — type check, then the password unit tests
   ```bash
   bun run check
   bun run test
   ```

4. Build for production — type check plus a Vite build into `dist/`
   ```bash
   bun run build
   ```

## Features

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|
| ![icon](https://api.iconify.design/mdi:shield-lock.svg?color=%231976d2&width=16) | Secure randomness | `crypto.getRandomValues()` with rejection sampling instead of `Math.random()` | No predictable or modulo-biased output | `generatePassword()` |
| ![icon](https://api.iconify.design/mdi:textbox-password.svg?color=%23388e3c&width=16) | 20-character default | Lowercase, uppercase, digits, and symbols, with one of each guaranteed | A strong password is ready on load | `length: 20` |
| ![icon](https://api.iconify.design/mdi:palette.svg?color=%237b1fa2&width=16) | Character-aware color | Digits and symbols render in separate warm tones | Symbols stand out at a glance | `.pw-digit` |
| ![icon](https://api.iconify.design/mdi:content-copy.svg?color=%23f57c00&width=16) | Click to copy | The password row copies on click, `Enter`, or `Space` | Copy takes one action with no selecting | `onCopy()` |
| ![icon](https://api.iconify.design/mdi:check-circle.svg?color=%2300796b&width=16) | Copied feedback | The button reads Copied for two seconds with a per-character wave | The write is confirmed without a toast | `.is-copied` |
| ![icon](https://api.iconify.design/mdi:eye-off.svg?color=%23303f9f&width=16) | Hide and reveal | The eye toggle masks every character with bullets | The screen is safe to show in public | `hidden()` |
| ![icon](https://api.iconify.design/mdi:dice-multiple.svg?color=%23c2185b&width=16) | Random and Copy split | Outline Random regenerates, solid cream Copy is primary | The main action is obvious at a glance | `regenerate()` |
| ![icon](https://api.iconify.design/mdi:keyboard.svg?color=%230097a7&width=16) | Keyboard shortcut | `Ctrl`/`Cmd` + `Enter` regenerates while the refresh icon spins | Fast repeat generation without the mouse | `Ctrl + Enter` |
| ![icon](https://api.iconify.design/mdi:content-paste.svg?color=%23ffa000&width=16) | Clipboard fallback | Falls back to a hidden textarea and shows an inline hint when blocked | Copy still works on insecure contexts | `copyText()` |
| ![icon](https://api.iconify.design/mdi:wifi-off.svg?color=%23455a64&width=16) | Offline by design | No network calls, analytics, persistence, or third-party scripts | Nothing leaves the browser | `index.html` |
| ![icon](https://api.iconify.design/mdi:weather-night.svg?color=%235d4037&width=16) | Charcoal atmosphere | Ember orbs, a 64px grid, vignette, and grain over `#14100d`, with self-hosted Inter and JetBrains Mono | Attention stays on the password | `.bg-scene` |
| ![icon](https://api.iconify.design/mdi:motion-play.svg?color=%2326a69a&width=16) | Motion with a brake | Card-flip reveal and the copy wave stop under `prefers-reduced-motion` | Delightful by default, calm on request | `prefersReducedMotion()` |

## Usage

### Usage via Web

<details>
<summary>One screen: generate, reveal, copy</summary>

Open the app at [gen-password.newkubise.workers.dev](https://gen-password.newkubise.workers.dev) — a fresh password is generated on load.

1. Press **Copy** to write the password to the clipboard; the button reads **Copied** for two seconds.
2. Press **Random** or `Ctrl`/`Cmd` + `Enter` for a new password; the characters flip in one after another.
3. Click the password row, or focus it and press `Enter`/`Space`, to copy it.
4. Press the eye button to mask the password with bullets.
5. If the browser blocks the Clipboard API, an inline hint asks you to copy manually.

```text
┌──────────────────────────────────────────────────────────┐
│  gen-password · ready                                    │
│                                                          │
│  K#9v!mQ2@xLp7&Rt5$Wn                                    │
│                                                          │
│  20 characters · lowercase, uppercase, digits, symbols   │
│                                              eye toggle  │
│                                                          │
│  [ Random ]                                 [ Copy ]     │
└──────────────────────────────────────────────────────────┘
```

</details>

## Deployment

The Worker `gen-password` publishes `dist/` as static assets with a single-page-application fallback. There are no bindings and no secrets; Wrangler uses the local OAuth session.

| Setting | Value |
|:--------|:------|
| Worker name | `gen-password` |
| Build command | `bun run build` |
| Deploy command | `bunx wrangler deploy` |
| Assets directory | `dist/` |
| Fallback | `single-page-application` |
| Root directory | `/` |

`bun run deploy` runs the build and `wrangler deploy` in one step. For continuous deployment, connect the GitHub repository under **Workers & Pages → gen-password → Settings → Builds & deployments** and use the commands above.

## Security notes

- `crypto.getRandomValues()` only, with rejection sampling; `Math.random()` is never used.
- One character from every enabled charset is placed first, the rest of the length is filled from the full pool, then Fisher–Yates shuffles the result.
- Clipboard writes prefer the async Clipboard API and fall back to a temporary textarea.
- No network requests, analytics, persistence, or third-party scripts.
