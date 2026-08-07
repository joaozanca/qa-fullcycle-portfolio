import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"], ["allure-playwright", { resultsDir: "../../reports/allure-results" }]],
  use: {
    baseURL: process.env.APP_BASE_URL ?? "http://localhost:3000",
  },
  // Chromium apenas — cross-browser está fora do escopo definido na
  // Test Strategy (ver Confluence: "Fora de escopo: compatibilidade
  // cross-browser além de Chromium").
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
