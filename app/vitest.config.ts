import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Restrito ao módulo coberto por testes unitários de verdade.
      // O resto de src/ (rotas, servidor) é validado pelas suites de
      // API e E2E (Partes 5 e 6), que rodam contra o servidor real e
      // não são visíveis para a cobertura do Vitest.
      include: ["src/validation.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
