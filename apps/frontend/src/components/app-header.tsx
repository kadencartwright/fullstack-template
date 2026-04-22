import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/tanstack-react-start'
import { Button } from '@fullstack-template/ui'
import { Link } from '@tanstack/react-router'
import { appEnv } from '../lib/env'

function AuthControls() {
  if (!appEnv.clerkPublishableKey) {
    return <span className="text-sm text-zinc-500">Add Clerk env vars to enable auth</span>
  }

  return (
    <>
      <Show when="signed-in">
        <UserButton />
      </Show>
      <Show when="signed-out">
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <Button size="sm" variant="outline">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">Sign up</Button>
          </SignUpButton>
        </div>
      </Show>
    </>
  )
}

export function AppHeader() {
  return (
    <header className="border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-sm font-medium text-primary">fullstack-template</p>
          <p className="text-sm text-muted-foreground">
            TanStack Start + Clerk + Convex + Storybook
          </p>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link activeProps={{ className: 'text-foreground' }} to="/">
            Home
          </Link>
          <Link activeProps={{ className: 'text-foreground' }} to="/protected">
            Protected
          </Link>
          <Link activeProps={{ className: 'text-foreground' }} to="/sign-in">
            Sign in
          </Link>
        </nav>
        <AuthControls />
      </div>
    </header>
  )
}
