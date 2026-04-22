export const appEnv = {
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '',
  convexUrl: import.meta.env.VITE_CONVEX_URL ?? '',
} as const
