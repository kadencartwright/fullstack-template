import type { AuthConfig } from 'convex/server'

const clerkIssuerDomain =
  process.env.CLERK_JWT_ISSUER_DOMAIN ?? 'https://replace-me.clerk.accounts.dev'

export default {
  providers: [
    {
      applicationID: 'convex',
      domain: clerkIssuerDomain,
    },
  ],
} satisfies AuthConfig
