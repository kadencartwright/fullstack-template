import { Badge } from '@fullstack-template/ui'
import { useConvexAuth } from 'convex/react'
import { appEnv } from '../lib/env'

function ConvexStatusBadge() {
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    return <Badge variant="secondary">Convex auth loading</Badge>
  }

  return <Badge>{isAuthenticated ? 'Convex authenticated' : 'Convex connected'}</Badge>
}

export function ConvexStatus() {
  if (!appEnv.clerkPublishableKey || !appEnv.convexUrl) {
    return <Badge variant="outline">Convex URL missing</Badge>
  }

  return <ConvexStatusBadge />
}
