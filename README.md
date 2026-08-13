> 🚀 Strong passwords in one click — A TanStack Start + SolidJS password generator with live security analysis and instant clipboard copy.

# gen-password

A flat (non-monorepo) TanStack Start + SolidJS password generator app. Generate strong, random passwords with adjustable length, character type selection, real-time security level analysis, and one-click clipboard copy — all rendered with SSR support and UnoCSS atomic styling.

![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.168-1976d2?logo=tanstack&logoColor=white)
![SolidJS](https://img.shields.io/badge/SolidJS-1.9-1c6fbb?logo=solid&logoColor=white)
![UnoCSS](https://img.shields.io/badge/UnoCSS-66.7-333333?logo=unocss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646cff?logo=vite&logoColor=white)
![oxlint](https://img.shields.io/badge/oxlint-1.69-67b7e0?logo=oxc&logoColor=white)

```
+----------------------------------------------------------+
|                    [shield-lock icon]                    |
|                  Password Generator                       |
|         Create strong, secure, and random passwords       |
|                                                          |
|  +----------------------------------------------------+  |
|  |  Click to randomize & copy             Length 16/32 |  |
|  |                                                    |  |
|  |             Xk9$mP2#vQr7&nL4w                       |  |
|  |        (gradient sky → blue → violet text)         |  |
|  |                                                    |  |
|  |  [========================o======================]  |  |
|  |                     0 / 32                         |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Get Started

### 1. Prerequisites

Ensure the following tools are installed before setting up the project.

```powershell
node --version    # >= 20
bun --version     # >= 1.0 (recommended package runner)
```

### 2. Install Dependencies

Install all project dependencies using your preferred package manager.

```powershell
bun install
```

### 3. Run Development Server

Start the Vite dev server with SSR support. The app runs on port 3001.

```powershell
bun run dev
```

### 4. Build For Production

Build the production bundle with manual chunk splitting for SolidJS and TanStack Router.

```powershell
bun run build
```

### 5. Preview Production Build

Preview the production build locally before deploying.

```powershell
bun run preview
```

## Features

| Icon | Feature | Description | Benefit | Usage |
|:---:|---|---|---|---|
| ![icon](https://api.iconify.design/mdi:shuffle-variant.svg?color=%23c2185b&width=20) | Random Password Generation | Generates cryptographically random passwords from a full character set of 94 symbols (A-Z, a-z, 0-9, special) | Produces unpredictable passwords resistant to brute-force attacks | Click the password display area to generate a new password |
| ![icon](https://api.iconify.design/mdi:format-letter-case-upper.svg?color=%237b1fa2&width=20) | Character Type Selection | Toggle uppercase (A-Z), lowercase (a-z), numbers (0-9), and symbols (!@#$%) independently via toggle buttons | Fine-tunes password composition to match site-specific requirements | Click any character type button in the Password Options panel |
| ![icon](https://api.iconify.design/mdi:ray-start-arrow.svg?color=%23f57c00&width=20) | Adjustable Length | Slide or type a password length from 0 to 32 characters (module supports up to 50) with a minimum enforced at 16 | Balances memorability and security based on target system constraints | Drag the range slider or enter a number in the length input |
| ![icon](https://api.iconify.design/mdi:animation-play.svg?color=%231976d2&width=20) | Click-to-Randomize Animation | Cycles random characters for 10 frames at 30ms intervals before settling on the final password | Provides visual feedback that a fresh password has been generated | Click anywhere on the password display card |
| ![icon](https://api.iconify.design/mdi:clipboard-check.svg?color=%23388e3c&width=20) | Auto Copy to Clipboard | Automatically copies the generated password to the clipboard using the async Clipboard API with a textarea fallback | Eliminates manual copy steps so the password is ready to paste immediately | Generation completes and "Copied" status appears for 1.2 seconds |
| ![icon](https://api.iconify.design/mdi:shield-check.svg?color=%230097a7&width=20) | Security Level Analysis | Evaluates password strength into five levels (veryWeak, weak, medium, strong, veryStrong) based on character type count and length | Gives instant confidence that the generated password meets security thresholds | View the Security Analysis panel for the current level label |
| ![icon](https://api.iconify.design/mdi:progress-check.svg?color=%23d32f2f&width=20) | Visual Security Indicator | Renders a color-coded gradient progress bar (rose → orange → amber → sky → emerald) with a glow shadow per security level | Communicates strength at a glance without reading text | Observe the bar width and color in the Security Analysis panel |
| ![icon](https://api.iconify.design/mdi:server-network.svg?color=%2300796b&width=20) | SSR Support | Renders the initial HTML on the server via TanStack Start with `solid({ ssr: true })` | Improves first paint and SEO with server-rendered markup | Automatically enabled in dev and build modes |
| ![icon](https://api.iconify.design/mdi:cube-outline.svg?color=%23303f9f&width=20) | Module Architecture | Organizes password logic into components, hooks, stores, and types under `src/modules/password/` with a barrel export | Keeps feature code isolated, reusable, and easy to maintain | Import from `~/modules/password` in any route or component |

## Usage

### Usage via Web

Open the app in a browser at `http://localhost:3001` after running the dev server. The password generator loads immediately on mount and displays a randomly generated password with a shuffle animation. Click anywhere on the large password display card to regenerate and automatically copy the new password to the clipboard. Drag the range slider beneath the display to adjust the password length from 0 to 32 characters. The current length is shown in the top-right corner of the display card. To customize character composition, use the Password Options panel to toggle uppercase, lowercase, numbers, and symbols independently. The Security Analysis panel updates in real time to reflect the selected character types, password length, and a color-coded security level bar.

## Project

<details>
<summary>Goal</summary>

| Aspect | Detail |
|---|---|
| Purpose | Provide a fast, accessible web tool for generating strong random passwords |
| Audience | Developers and end-users who need secure passwords on demand |
| Outcome | A single-page SSR app that generates, analyzes, and copies passwords instantly |
| Value | Reduces password creation friction while raising security awareness |

</details>

<details>
<summary>Scope</summary>

| Aspect | In Scope | Out of Scope | Notes |
|---|---|---|---|
| Generation | Random password from selectable character sets | Pronounceable passphrase generation | Uses `Math.random` with full 94-char set |
| Length | 0–32 characters (module supports up to 50) | Arbitrary unlimited length | Minimum of 16 enforced in generator hook |
| Security | Five-level strength analysis with visual bar | Entropy calculation in bits | Heuristic based on type count and length |
| Clipboard | Auto-copy via Clipboard API with fallback | Password history or vault storage | No persistence layer |

</details>

<details>
<summary>When To Use</summary>

| Scenario | Recommendation | Reason |
|---|---|---|
| Creating a new account password | Use this app | Generates a strong random password instantly with copy |
| Testing password strength heuristics | Use this app | Security level updates live with options |
| Bulk password generation | Not ideal | App generates one password per interaction |
| Storing or managing passwords | Not ideal | No persistence or vault features |

</details>

<details>
<summary>Key Concepts</summary>

| Concept | Description | Reference |
|---|---|---|
| File-based Routing | TanStack Router auto-generates a route tree from `src/routes/` | `vite.config.ts` `TanStackRouterVite` plugin |
| Module Pattern | Feature-scoped folder with components, hooks, stores, types, and barrel export | `src/modules/password/index.ts` |
| Signal-based State | SolidJS `createSignal` and `createMemo` for reactive password options and security | `src/modules/password/hooks/` |

</details>

<details>
<summary>Core Principles</summary>

| Principle | Description | Application |
|---|---|---|
| Reactivity First | All UI updates derive from SolidJS signals and memos | Length and character toggles flow into security analysis automatically |
| Minimal Dependencies | Lean runtime with only SolidJS and TanStack as production deps | `package.json` lists 4 dependencies |
| Instant Feedback | Every interaction produces visible state change | Animation, copied status, and security bar update synchronously |

</details>

<details>
<summary>Best Practices</summary>

| Practice | Description | Application |
|---|---|---|
| Enforce Minimum Length | Generator clamps length to a floor of 16 characters | `MIN_LENGTH = 16` in `usePasswordGenerator` and `PasswordOptions` |
| Graceful Clipboard Fallback | Falls back to `document.execCommand("copy")` if Clipboard API fails | `copyToClipboard` in `src/lib/password.ts` |
| Cleanup Side Effects | Clears animation intervals on component unmount | `onCleanup` in `src/routes/index.tsx` |

</details>

## API References

<details>
<summary>lib/password.ts</summary>

| Function | Signature | Description |
|---|---|---|
| `generatePassword` | `(options: PasswordOptions, minLength: number) => string` | Builds a password from selected character sets, clamped to `minLength` |
| `createRandomPassword` | `(passwordLength: number) => string` | Generates a password from the full 94-char set, clamped to 0–32 |
| `getFullCharacterSet` | `() => string` | Returns the complete character set string |
| `copyToClipboard` | `(text: string) => Promise<boolean>` | Copies text via Clipboard API with textarea fallback |

</details>

<details>
<summary>modules/password/types/password.ts</summary>

| Type | Definition | Description |
|---|---|---|
| `PasswordOptions` | `{ length, includeUppercase, includeLowercase, includeNumbers, includeSymbols }` | Configuration for password generation |
| `SecurityLevel` | `"veryWeak" \| "weak" \| "medium" \| "strong" \| "veryStrong"` | Five-level strength enum |
| `GeneratePasswordResponse` | `{ password: string }` | Response wrapper for generated password |

</details>

<details>
<summary>modules/password/hooks</summary>

| Hook | Returns | Description |
|---|---|---|
| `usePasswordGenerator` | `passwordOptions, generatedPassword, copied, error, generate, copy, generateAndCopy, reset` | Orchestrates generation, copy, and reset |
| `usePasswordOptions` | `length, setLength, include*, setInclude*, reset` | Module-level signal-based options store |
| `useSecurity` | `securityLevel, securityLevelText, securityLevelColor, securityLevelBackgroundColor, securityLevelGlow, securityLevelWidth` | Memoized security analysis derived from options |

</details>

<details>
<summary>modules/password/components</summary>

| Component | Props | Description |
|---|---|---|
| `PasswordDisplay` | `displayPassword, copied, isRegenerating, onGenerateAndCopy, onCopy` | Renders generated password with copy button and status |
| `PasswordOptions` | _(none)_ | Length slider, number input, and character type toggles |
| `SecurityStatus` | _(none)_ | Security analysis panel with level bar and character type indicators |

</details>

## Development

<details>
<summary>Tech Stack</summary>

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | TanStack Start (Solid) | ^1.168.42 | SSR meta-framework for SolidJS |
| Router | TanStack Solid Router | ^1.170.25 | File-based routing with auto code splitting |
| UI Runtime | SolidJS | ^1.9.14 | Fine-grained reactive rendering |
| Styling | UnoCSS | ^66.7.0 | Atomic CSS with Wind4 preset and icons |
| Build | Vite (rolldown-vite) | latest | Bundler with manual chunk splitting |
| Language | TypeScript | ^5.9.3 | Strict type checking, ESNext modules |
| Lint | oxlint | ^1.69.0 | Fast linter with auto-fix |
| Format | dprint | ^0.54.0 | Code formatter |
| Test | vitest | (dev) | Unit test runner with no-test pass mode |
| Icons | @iconify-icon/solid | ^3.0.3 | Iconify SVG icon component for Solid |

</details>

<details>
<summary>How It Work</summary>

```
User clicks display card
        │
        ▼
generateWithAnimation()
        │
        ├─ sets isRegenerating = true
        ├─ starts setInterval (30ms, 10 frames)
        │       └─ shuffles random chars into displayPassword
        │
        ▼ (after 10 frames)
createRandomPassword(length)
        │
        ├─ picks from full 94-char set
        ├─ sets displayPassword = finalPassword
        ├─ copyToClipboard(finalPassword)
        │       └─ Clipboard API → textarea fallback
        ├─ sets copied = true (1.2s timeout)
        └─ sets isRegenerating = false

useSecurity() (memo)
        │
        ├─ counts selected character types
        ├─ reads password length
        └─ maps to securityLevel → color, width, glow, gradient
```

</details>

<details>
<summary>Architecture</summary>

```
gen-password/
├── src/
│   ├── lib/
│   │   └── password.ts              # generation + clipboard utilities
│   ├── modules/
│   │   └── password/
│   │       ├── components/
│   │       │   ├── PasswordDisplay.tsx
│   │       │   ├── PasswordOptions.tsx
│   │       │   └── SecurityStatus.tsx
│   │       ├── hooks/
│   │       │   ├── usePasswordGenerator.ts
│   │       │   ├── usePasswordOptions.ts
│   │       │   └── useSecurity.ts
│   │       ├── stores/
│   │       │   └── passwordOptions.ts
│   │       ├── types/
│   │       │   └── password.ts
│   │       └── index.ts             # barrel export
│   ├── routes/
│   │   ├── __root.tsx               # root layout + meta
│   │   └── index.tsx                # main generator page
│   └── routeTree.gen.ts             # auto-generated route tree
├── uno.config.ts                    # UnoCSS presets + transformers
├── vite.config.ts                   # TanStack Start + router + solid + UnoCSS
├── tsconfig.json                    # strict TS, ESNext, ~/* path alias
└── package.json
```

</details>

<details>
<summary>Scripts</summary>

```jsonc
{
  "dev": "vite",                                          // start dev server on port 3001
  "build": "vite build",                                  // production build with chunk splitting
  "preview": "vite preview",                              // preview production build locally
  "typecheck": "tsc --noEmit",                            // strict type checking without emit
  "lint": "oxlint --fix",                                 // lint with auto-fix
  "format": "dprint fmt",                                 // format source files
  "test": "vitest --run --passWithNoTests",               // run tests once, pass if none exist
  "verify": "bun run format && bun run lint && bun run typecheck && bun run build"
  // full pre-ship verification: format → lint → typecheck → build
}
```

</details>

<details>
<summary>Workflows</summary>

```
Development
  bun install → bun run dev → open http://localhost:3001

Pre-Ship Verification
  bun run verify (format → lint → typecheck → build)

Production Deploy
  bun run build → bun run preview (smoke test) → deploy .output/

Code Quality
  bun run lint → bun run format → bun run typecheck
```

</details>

<details>
<summary>Skills</summary>

```
follow-architecture        # module-scoped feature folders with barrel exports
follow-config              # vite.config.ts, uno.config.ts, tsconfig.json
follow-barrel-export       # src/modules/password/index.ts
run-check                  # bun run verify before commit
commit                     # git commit --no-verify with Devin co-author trailer
```

</details>

## License

This project is private and currently unlicensed. All rights reserved by the repository owner.
