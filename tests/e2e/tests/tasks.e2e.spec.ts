import { test, expect } from "@playwright/test";
import { TasksPage } from "../pages/TasksPage";

function uniqueTitle(prefix: string) {
  return `${prefix} ${Date.now()}`;
}

test.describe("Task CRUD — fluxos críticos (E2E)", () => {
  // TC-01, via UI
  test("criar Task exibe na lista com status Pendente", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    const title = uniqueTitle("E2E criar");

    await tasksPage.createTask(title);

    await expect(tasksPage.taskItem(title)).toBeVisible();
    await expect(tasksPage.statusOf(title)).toHaveText("Pendente");

    await tasksPage.deleteTask(title);
  });

  // TC-06, via UI
  test("editar Task reflete o novo título na lista", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    const title = uniqueTitle("E2E editar");
    const newTitle = uniqueTitle("E2E editado");

    await tasksPage.createTask(title);
    await tasksPage.editTask(title, newTitle);

    await expect(tasksPage.taskItem(newTitle)).toBeVisible();
    await expect(tasksPage.taskItem(title)).toHaveCount(0);

    await tasksPage.deleteTask(newTitle);
  });

  // TC-09, via UI
  test("excluir Task remove da lista", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    const title = uniqueTitle("E2E excluir");

    await tasksPage.createTask(title);
    await expect(tasksPage.taskItem(title)).toBeVisible();

    await tasksPage.deleteTask(title);
    await expect(tasksPage.taskItem(title)).toHaveCount(0);
  });

  // Regressão do KAN-8 — garante que o bug do rótulo de status ausente
  // não volte a acontecer sem ser notado.
  test("regressão KAN-8 — status muda de Pendente para Concluída ao marcar", async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    const title = uniqueTitle("E2E status");

    await tasksPage.createTask(title);
    await expect(tasksPage.statusOf(title)).toHaveText("Pendente");

    await tasksPage.setCompleted(title, true);
    await expect(tasksPage.statusOf(title)).toHaveText("Concluída");

    await tasksPage.deleteTask(title);
  });
});
