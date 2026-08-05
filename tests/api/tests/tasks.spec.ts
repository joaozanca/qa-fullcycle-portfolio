import { test, expect, APIRequestContext } from "@playwright/test";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function createTask(request: APIRequestContext, title: string) {
  const res = await request.post("/tasks", { data: { title } });
  return res;
}

async function deleteTask(request: APIRequestContext, id: string) {
  await request.delete(`/tasks/${id}`);
}

test.describe("Contrato — schema de uma Task", () => {
  test("Task criada respeita o formato esperado", async ({ request }) => {
    const res = await createTask(request, "Task de contrato");
    const body = await res.json();

    expect(body.id).toMatch(UUID_REGEX);
    expect(typeof body.title).toBe("string");
    expect(typeof body.completed).toBe("boolean");
    expect(typeof body.createdAt).toBe("string");
    expect(typeof body.updatedAt).toBe("string");
    expect(new Date(body.createdAt).toString()).not.toBe("Invalid Date");

    await deleteTask(request, body.id);
  });
});

test.describe("Criar Task (KAN-2)", () => {
  // TC-01
  test("título válido cria a Task com status pendente", async ({ request }) => {
    const res = await createTask(request, "Escrever automação de API");
    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.title).toBe("Escrever automação de API");
    expect(body.completed).toBe(false);

    await deleteTask(request, body.id);
  });

  // TC-02
  test("título vazio é rejeitado", async ({ request }) => {
    const res = await createTask(request, "");
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("title is required");
  });

  test("título ausente no corpo da requisição é rejeitado", async ({ request }) => {
    const res = await request.post("/tasks", { data: {} });
    expect(res.status()).toBe(400);
  });

  // TC-03 — limite de 100 caracteres (análise de valor limite, ver Parte 2)
  test("título com 101 caracteres é rejeitado", async ({ request }) => {
    const res = await createTask(request, "a".repeat(101));
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe("title must be at most 100 characters");
  });

  test("título com exatamente 100 caracteres é aceito (limite válido)", async ({ request }) => {
    const res = await createTask(request, "a".repeat(100));
    expect(res.status()).toBe(201);

    const body = await res.json();
    await deleteTask(request, body.id);
  });
});

test.describe("Listar Tasks (KAN-3)", () => {
  // TC-04
  test("Task criada aparece na listagem", async ({ request }) => {
    const created = await (await createTask(request, "Task para listagem")).json();

    const res = await request.get("/tasks");
    expect(res.status()).toBe(200);
    const tasks = await res.json();
    expect(tasks.some((t: { id: string }) => t.id === created.id)).toBe(true);

    await deleteTask(request, created.id);
  });

  // TC-05 (equivalente de API — a mensagem de "lista vazia" é uma
  // preocupação de UI, validada via E2E na Parte 6; aqui validamos que a
  // Task some da listagem após ser excluída)
  test("Task excluída não aparece mais na listagem", async ({ request }) => {
    const created = await (await createTask(request, "Task efêmera")).json();
    await deleteTask(request, created.id);

    const res = await request.get("/tasks");
    const tasks = await res.json();
    expect(tasks.some((t: { id: string }) => t.id === created.id)).toBe(false);
  });
});

test.describe("Editar Task (KAN-4)", () => {
  // TC-06
  test("título válido atualiza a Task existente", async ({ request }) => {
    const created = await (await createTask(request, "Título original")).json();

    const res = await request.put(`/tasks/${created.id}`, {
      data: { title: "Título atualizado" },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).title).toBe("Título atualizado");

    await deleteTask(request, created.id);
  });

  // TC-07
  test("editar Task inexistente retorna 404", async ({ request }) => {
    const res = await request.put("/tasks/id-que-nao-existe", {
      data: { title: "qualquer coisa" },
    });
    expect(res.status()).toBe(404);
    expect((await res.json()).error).toBe("task not found");
  });

  // TC-08
  test("editar com título vazio é rejeitado e não altera a Task", async ({ request }) => {
    const created = await (await createTask(request, "Título preservado")).json();

    const res = await request.put(`/tasks/${created.id}`, { data: { title: "" } });
    expect(res.status()).toBe(400);

    const list = await (await request.get("/tasks")).json();
    const stillThere = list.find((t: { id: string }) => t.id === created.id);
    expect(stillThere.title).toBe("Título preservado");

    await deleteTask(request, created.id);
  });
});

test.describe("Excluir Task (KAN-5)", () => {
  // TC-09
  test("excluir Task existente retorna 204", async ({ request }) => {
    const created = await (await createTask(request, "Task a excluir")).json();

    const res = await request.delete(`/tasks/${created.id}`);
    expect(res.status()).toBe(204);
  });

  // TC-10
  test("excluir Task inexistente retorna 404", async ({ request }) => {
    const res = await request.delete("/tasks/id-que-nao-existe");
    expect(res.status()).toBe(404);
    expect((await res.json()).error).toBe("task not found");
  });
});

test.describe("Marcar Task como concluída (KAN-6)", () => {
  // TC-11
  test("marcar Task pendente como concluída", async ({ request }) => {
    const created = await (await createTask(request, "Task a concluir")).json();

    const res = await request.patch(`/tasks/${created.id}/complete`, {
      data: { completed: true },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).completed).toBe(true);

    await deleteTask(request, created.id);
  });

  // TC-12
  test("reverter Task concluída para pendente", async ({ request }) => {
    const created = await (await createTask(request, "Task a reverter")).json();
    await request.patch(`/tasks/${created.id}/complete`, { data: { completed: true } });

    const res = await request.patch(`/tasks/${created.id}/complete`, {
      data: { completed: false },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).completed).toBe(false);

    await deleteTask(request, created.id);
  });

  test("valor não-booleano em completed é rejeitado", async ({ request }) => {
    const created = await (await createTask(request, "Task defensiva")).json();

    const res = await request.patch(`/tasks/${created.id}/complete`, {
      data: { completed: "sim" },
    });
    expect(res.status()).toBe(400);

    await deleteTask(request, created.id);
  });
});
