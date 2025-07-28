// playwright.config.ts
import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

// ✅ .env.test.local を読み込む
dotenv.config({ path: ".env.test.local" });

export default defineConfig({
  testDir: "./src/tests",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
