import { defineConfig, devices } from '@playwright/test'

const playwrightPort = process.env.PORT ?? (process.env.CI ? '39147' : '3000')
const playwrightBaseUrl = `http://127.0.0.1:${playwrightPort}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  outputDir: 'test-results/playwright',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: playwrightBaseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `PORTLESS=0 PORT=${playwrightPort} pnpm dev:direct`,
    url: playwrightBaseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
