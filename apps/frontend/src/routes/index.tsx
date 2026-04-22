import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/tanstack-react-start'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from '@fullstack-template/ui'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { ConvexStatus } from '../components/convex-status'
import { appEnv } from '../lib/env'

const starterItems = [
  {
    description: 'Type-safe routes, server functions, and Vite-based development.',
    title: 'TanStack Start',
  },
  {
    description: 'SSR-friendly auth with modal or page-based flows already wired in.',
    title: 'Clerk',
  },
  {
    description: 'Convex client provider wiring is ready for authenticated queries.',
    title: 'Convex',
  },
]

export const Route = createFileRoute('/')({ component: HomePage })

function AuthPanel() {
  if (!appEnv.clerkPublishableKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Finish local setup</CardTitle>
          <CardDescription>
            Add Clerk and Convex environment variables in `apps/frontend/.env.local`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>`VITE_CLERK_PUBLISHABLE_KEY` enables the frontend auth UI.</p>
          <p>`CLERK_SECRET_KEY` enables server-side route protection.</p>
          <p>`VITE_CONVEX_URL` enables the Convex client provider.</p>
          <p>`CLERK_JWT_ISSUER_DOMAIN` lets Convex validate Clerk tokens.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth starter flow</CardTitle>
        <CardDescription>
          The template ships with a public home page, a sign-in page, and a protected route.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline">Create account</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <div className="flex items-center gap-3">
            <UserButton />
            <Button asChild>
              <Link to="/protected">Open protected route</Link>
            </Button>
          </div>
        </Show>
      </CardContent>
    </Card>
  )
}

function HomePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Public template</Badge>
              <ConvexStatus />
            </div>
            <CardTitle className="max-w-3xl text-4xl tracking-tight sm:text-5xl">
              Full-stack starter with real auth, shared UI, and a separate Storybook app.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              Use this as the base for a public repo with TanStack Start, Clerk, Convex, Turbo,
              Biome, Vitest, and a shadcn-style UI package backed by Radix.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/protected">Protected example</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="http://localhost:6006" rel="noreferrer" target="_blank">
                Open Storybook
              </a>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Starter checklist</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>What this template includes</DialogTitle>
                  <DialogDescription>
                    The monorepo is ready for UI work, auth, backend wiring, and verification.
                  </DialogDescription>
                </DialogHeader>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Shared UI package with shadcn-style primitives</li>
                  <li>Standalone Storybook app consuming workspace components</li>
                  <li>Protected route using Clerk on the server</li>
                  <li>Convex auth provider wiring for authenticated client access</li>
                </ul>
              </DialogContent>
            </Dialog>
          </CardContent>
          <CardFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  More starter pieces
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Included tooling</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Biome with cognitive complexity max 15</DropdownMenuItem>
                <DropdownMenuItem>Vitest workspace test setup</DropdownMenuItem>
                <DropdownMenuItem>Turborepo build and Storybook pipeline</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>

        <AuthPanel />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {starterItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Shared UI package preview</CardTitle>
            <CardDescription>
              These controls come from `packages/ui` and are reused by Storybook and the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input defaultValue="starter@template.dev" type="email" />
            <div className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <CardDescription>
              After setting env vars, run Convex and start building real product routes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Run `pnpm dev:convex` to create a deployment and generate Convex files.</p>
            <p>2. Add custom routes under `apps/frontend/src/routes`.</p>
            <p>3. Extend `packages/ui` and document components in Storybook.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
