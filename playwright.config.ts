import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // ローカルもリトライ
  workers: process.env.CI ? 1 : 2, // ワーカー数を制限
  reporter: "html",
  timeout: 60000, // テストタイムアウトを延長
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 15000, // アクションタイムアウト
    navigationTimeout: 30000, // ナビゲーションタイムアウト
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000, // サーバー起動タイムアウト延長
    retries: 3, // サーバー起動リトライ
  },
});
