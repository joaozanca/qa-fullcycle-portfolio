const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const list = document.getElementById("task-list");
const formError = document.getElementById("form-error");
const versionLabel = document.getElementById("version");

async function loadTasks() {
  const res = await fetch("/tasks");
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  list.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Nenhuma task cadastrada.";
    empty.dataset.testid = "task-list-empty";
    list.appendChild(empty);
    return;
  }

  for (const task of tasks) {
    list.appendChild(renderTaskItem(task));
  }
}

function renderTaskItem(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.completed ? " completed" : ""}`;
  item.dataset.testid = "task-item";
  item.dataset.taskId = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.dataset.testid = "task-complete-checkbox";
  checkbox.addEventListener("change", () => toggleComplete(task.id, checkbox.checked));

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;
  title.dataset.testid = "task-title-text";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Editar";
  editBtn.dataset.testid = "task-edit-button";
  editBtn.addEventListener("click", () => editTask(task));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Excluir";
  deleteBtn.dataset.testid = "task-delete-button";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  item.append(checkbox, title, editBtn, deleteBtn);
  return item;
}

async function createTask(title) {
  const res = await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error ?? "Erro ao criar task");
  }
}

async function editTask(task) {
  const newTitle = prompt("Novo título:", task.title);
  if (newTitle === null) return;

  const res = await fetch(`/tasks/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle }),
  });

  if (!res.ok) {
    const body = await res.json();
    alert(body.error ?? "Erro ao editar task");
    return;
  }

  await loadTasks();
}

async function toggleComplete(id, completed) {
  await fetch(`/tasks/${id}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  await loadTasks();
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: "DELETE" });
  await loadTasks();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;

  try {
    await createTask(titleInput.value);
    titleInput.value = "";
    await loadTasks();
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  }
});

async function loadVersion() {
  const res = await fetch("/version");
  const data = await res.json();
  versionLabel.textContent = `v${data.version} (${data.commit})`;
}

loadTasks();
loadVersion();
