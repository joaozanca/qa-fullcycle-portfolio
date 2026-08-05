import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { validateTitle } from "../validation";

const router = Router();

// TC-04, TC-05 — listar Tasks (vazio ou populada)
router.get("/", async (_req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "asc" } });
  res.status(200).json(tasks);
});

// TC-01, TC-02, TC-03 — criar Task
router.post("/", async (req: Request, res: Response) => {
  const error = validateTitle(req.body?.title);
  if (error) {
    return res.status(400).json({ error });
  }

  const task = await prisma.task.create({
    data: { title: req.body.title },
  });
  res.status(201).json(task);
});

// TC-06, TC-07, TC-08 — editar título da Task
router.put("/:id", async (req: Request, res: Response) => {
  const error = validateTitle(req.body?.title);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { title: req.body.title },
    });
    res.status(200).json(task);
  } catch {
    res.status(404).json({ error: "task not found" });
  }
});

// TC-11, TC-12 — marcar/desmarcar Task como concluída
router.patch("/:id/complete", async (req: Request, res: Response) => {
  if (typeof req.body?.completed !== "boolean") {
    return res.status(400).json({ error: "completed must be a boolean" });
  }

  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { completed: req.body.completed },
    });
    res.status(200).json(task);
  } catch {
    res.status(404).json({ error: "task not found" });
  }
});

// TC-09, TC-10 — excluir Task
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "task not found" });
  }
});

export default router;
