import { ClerkProvider, useAuth } from '@clerk/tanstack-react-start'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import type { ReactNode } from 'react'
import { appEnv } from '../lib/env'

const convexClient = appEnv.convexUrl ? new ConvexReactClient(appEnv.convexUrl) : null

function ConvexAuthProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    return children
  }

  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}

export function AppProviders({ children }: { children: ReactNode }) {
  if (!appEnv.clerkPublishableKey) {
    return children
  }

  return (
    <ClerkProvider publishableKey={appEnv.clerkPublishableKey}>
      <ConvexAuthProvider>{children}</ConvexAuthProvider>
    </ClerkProvider>
  )
}
