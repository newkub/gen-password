# gen-password

A secure, random password generator built with TanStack Start + SolidJS.

## Stack

- **Framework**: TanStack Start + SolidJS
- **Router**: TanStack Router (file-based routing)
- **State**: TanStack Store
- **Styling**: UnoCSS
- **Icons**: Iconify (MDI)
- **Build**: Vite (Rolldown)
- **Linting**: Oxlint
- **Formatting**: dprint
- **Package Manager**: Bun

## Commands

```bash
bun run dev          # Start dev server
bun run build        # Build for production
bun run preview      # Preview production build
bun run typecheck    # TypeScript type checking
bun run lint         # Lint and auto-fix
bun run format       # Format code with dprint
bun run test         # Run tests
bun run verify       # Full verification (format + lint + typecheck + build)
```

## Project Structure

```
src/
├── routes/          # File-based routes (TanStack Router)
│   ├── __root.tsx   # Root layout
│   └── index.tsx    # Password generator page
├── modules/
│   └── password/    # Password feature module
│       ├── components/  # PasswordDisplay, PasswordOptions, SecurityStatus
│       ├── hooks/       # usePasswordGenerator, usePasswordOptions, useSecurity
│       ├── stores/      # passwordOptions store
│       └── types/       # Password types
├── lib/             # Utilities (password generation logic)
├── client.tsx       # Client entry (hydration)
├── server.ts        # Server entry (Start handler)
└── router.tsx       # Router configuration
```

## Features

- Random password generation with animation
- Adjustable length (0-32 characters)
- Character set selection (uppercase, lowercase, numbers, symbols)
- Security level indicator
- Copy to clipboard
- Real-time password strength feedback

## Migration Notes

Migrated from Nuxt monorepo to a flat TanStack Start + SolidJS project.
Removed monorepo structure (apps/, packages/, turbo.json).
