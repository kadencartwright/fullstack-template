import { SignIn } from '@clerk/tanstack-react-start'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fullstack-template/ui'
import { createFileRoute } from '@tanstack/react-router'
import { appEnv } from '../lib/env'

export const Route = createFileRoute('/sign-in')({ component: SignInPage })

function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-6 py-10">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            This page uses Clerk&apos;s TanStack Start SDK and works with protected routes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {appEnv.clerkPublishableKey ? (
            <SignIn path="/sign-in" routing="path" signUpUrl="/" />
          ) : (
            <p className="text-sm text-muted-foreground">
              Add Clerk environment variables to render the sign-in experience.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
