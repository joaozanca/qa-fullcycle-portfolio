import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Acessibilidade (axe-core)", () => {
  test("página principal não deve ter violações de acessibilidade", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

    // eslint-disable-next-line no-console
    console.log(
      `Violações encontradas: ${results.violations.length}`,
      results.violations.map((v) => `${v.id} (${v.impact}): ${v.help}`)
    );

    expect(results.violations).toEqual([]);
  });
});
