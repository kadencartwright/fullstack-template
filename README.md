# fullstack-template

Public full-stack starter built with TanStack Start, Vite, Tailwind CSS v4, Clerk,
Convex, Biome, Vitest, Storybook, pnpm, and Turborepo.

## Apps

- `apps/frontend`: TanStack Start application with Clerk SSR auth and Convex client wiring
- `apps/storybook`: standalone Storybook app for the shared UI package
- `packages/ui`: shadcn-style UI package with Radix primitives

## Quick Start

```bash
pnpm install
pnpm dev:frontend
```

Run Storybook:

```bash
pnpm dev:storybook
```

Run Convex locally:

```bash
pnpm dev:convex
```

## Environment Variables

Create `apps/frontend/.env.local` with:

```bash
VITE_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
VITE_CONVEX_URL=
CLERK_JWT_ISSUER_DOMAIN=
```

Notes:

- `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` come from Clerk
- `VITE_CONVEX_URL` comes from `convex dev`
- `CLERK_JWT_ISSUER_DOMAIN` should match your Clerk Frontend API URL for Convex auth

## Workspace Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm build:storybook
```

## Version Pins

The repo uses current npm versions checked before install for the requested stack,
including:

- `@tanstack/react-start@1.167.42`
- `vite@8.0.9`
- `tailwindcss@4.2.4`
- `@clerk/tanstack-react-start@1.1.3`
- `convex@1.36.0`
- `@biomejs/biome@2.4.12`
- `vitest@4.1.5`
- `storybook@10.3.5`
- `turbo@2.9.6`
- `pnpm@10.33.1`

## UI Package

`packages/ui` includes starter components based on shadcn patterns and Radix:

- `Button`
- `Card`
- `Input`
- `Dialog`
- `DropdownMenu`

The Biome configuration enables cognitive complexity checks with a max of `15`.
