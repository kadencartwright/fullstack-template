import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AppHeader } from '../components/app-header'
import { AppProviders } from '../components/providers'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      {
        content:
          'Public full-stack starter with TanStack Start, Clerk, Convex, Storybook, and a shared shadcn-style UI package.',
        name: 'description',
      },
      { title: 'fullstack-template' },
    ],
    links: [{ href: appCss, rel: 'stylesheet' }],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <AppProviders>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body className="min-h-screen bg-background text-foreground antialiased">
          <AppHeader />
          <main>
            <Outlet />
          </main>
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </body>
      </html>
    </AppProviders>
  )
}
