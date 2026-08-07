import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"], ["allure-playwright", { resultsDir: "../../reports/allure-results" }]],
  use: {
    baseURL: process.env.API_BASE_URL ?? "http://localhost:3000",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
  },
});
