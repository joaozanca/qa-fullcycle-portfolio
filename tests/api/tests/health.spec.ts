import { test, expect } from "@playwright/test";

test.describe("Endpoints técnicos", () => {
  // TC-13
  test("GET /health retorna status ok quando a aplicação está saudável", async ({ request }) => {
    const res = await request.get("/health");

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
  });

  // TC-14
  test("GET /metrics retorna métricas no formato Prometheus", async ({ request }) => {
    const res = await request.get("/metrics");

    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/plain");

    const body = await res.text();
    expect(body).toContain("# HELP");
    expect(body).toContain("# TYPE");
    expect(body).toContain("http_requests_total");
  });

  // TC-15
  test("GET /version retorna versão e commit atuais", async ({ request }) => {
    const res = await request.get("/version");

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.version).toBe("string");
    expect(typeof body.commit).toBe("string");
  });
});
