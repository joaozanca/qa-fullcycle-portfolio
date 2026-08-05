import { describe, it, expect } from "vitest";
import { validateTitle, TITLE_MAX_LENGTH } from "./validation";

describe("validateTitle", () => {
  it("rejeita título vazio", () => {
    expect(validateTitle("")).toBe("title is required");
  });

  it("rejeita título só com espaços em branco", () => {
    expect(validateTitle("   ")).toBe("title is required");
  });

  it("rejeita valores que não são string", () => {
    expect(validateTitle(undefined)).toBe("title is required");
    expect(validateTitle(null)).toBe("title is required");
    expect(validateTitle(123)).toBe("title is required");
  });

  it("aceita título válido", () => {
    expect(validateTitle("Comprar leite")).toBeNull();
  });

  // Valor limite (Parte 2): fronteira exata do intervalo válido
  it("aceita título com exatamente 100 caracteres", () => {
    expect(validateTitle("a".repeat(TITLE_MAX_LENGTH))).toBeNull();
  });

  it("rejeita título com 101 caracteres", () => {
    expect(validateTitle("a".repeat(TITLE_MAX_LENGTH + 1))).toBe(
      "title must be at most 100 characters"
    );
  });
});
