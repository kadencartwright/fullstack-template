import { auth } from '@clerk/tanstack-react-start/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fullstack-template/ui'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ConvexStatus } from '../components/convex-status'

const getProtectedSession = createServerFn({ method: 'GET' }).handler(async () => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw redirect({ to: '/' })
  }

  const { userId } = await auth()

  if (!userId) {
    throw redirect({ to: '/sign-in' })
  }

  return { userId }
})

export const Route = createFileRoute('/protected')({
  loader: async () => getProtectedSession(),
  component: ProtectedPage,
})

function ProtectedPage() {
  const { userId } = Route.useLoaderData()

  return (
    <div className="mx-auto flex max-w-6xl px-6 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Protected route</CardTitle>
          <CardDescription>
            This page is guarded on the server with Clerk and ready for authenticated Convex calls.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Signed-in user id: {userId}</p>
          <div className="flex items-center gap-3">
            <span>Convex provider status:</span>
            <ConvexStatus />
          </div>
          <p>
            Add generated Convex queries after running `pnpm dev:convex`, then call them from
            components inside this route.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
