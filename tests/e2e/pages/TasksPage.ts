import { Page, Locator } from "@playwright/test";

export class TasksPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly submitButton: Locator;
  readonly formError: Locator;
  readonly taskList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByTestId("task-title-input");
    this.submitButton = page.getByTestId("task-submit-button");
    this.formError = page.getByTestId("form-error");
    this.taskList = page.getByTestId("task-list");
  }

  async goto() {
    await this.page.goto("/");
  }

  async createTask(title: string) {
    await this.titleInput.fill(title);
    await this.submitButton.click();
  }

  taskItem(title: string): Locator {
    return this.taskList.getByTestId("task-item").filter({ hasText: title });
  }

  statusOf(title: string): Locator {
    return this.taskItem(title).getByTestId("task-status-text");
  }

  // O formulário de edição é um prompt() nativo do navegador — é preciso
  // registrar o handler do diálogo ANTES de clicar em "Editar".
  async editTask(currentTitle: string, newTitle: string) {
    this.page.once("dialog", (dialog) => dialog.accept(newTitle));
    await this.taskItem(currentTitle).getByTestId("task-edit-button").click();
  }

  async deleteTask(title: string) {
    await this.taskItem(title).getByTestId("task-delete-button").click();
  }

  async setCompleted(title: string, completed: boolean) {
    const checkbox = this.taskItem(title).getByTestId("task-complete-checkbox");
    if (completed) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }
}
