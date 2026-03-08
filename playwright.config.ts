import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/ui",
  testMatch: "**/*.pw.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `bunx next dev --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 240_000,
    env: {
      SKIP_ENV_VALIDATION: "1",
      DATABASE_URL: "postgresql://postgres:password@localhost:5432/budget",
      NEXTAUTH_URL: baseURL,
      NEXTAUTH_SECRET: "playwright-test-secret",
      KINDE_ISSUER_URL: "https://example.kinde.com",
      KINDE_CLIENT_ID: "playwright-client-id",
      KINDE_CLIENT_SECRET: "playwright-client-secret",
      KINDE_SITE_URL: baseURL,
      KINDE_POST_LOGIN_REDIRECT_URL: `${baseURL}/transactions`,
      KINDE_POST_LOGOUT_REDIRECT_URL: `${baseURL}/`,
      E2E_VISUAL: "1",
    },
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
});
