import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import client from "prom-client";
import { prisma } from "./db";
import tasksRouter from "./routes/tasks";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const appVersion: string = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")
).version;

// --- métricas (Prometheus) ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total de requisições HTTP recebidas",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duração das requisições HTTP, em segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req: Request, res: Response, next: NextFunction) => {
  const stopTimer = httpRequestDurationSeconds.startTimer();
  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route?.path ?? req.path,
      status_code: res.statusCode,
    };
    httpRequestsTotal.inc(labels);
    stopTimer(labels);
  });
  next();
});

// TC-13 — health check
app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "error", reason: "database unreachable" });
  }
});

// TC-14 — métricas Prometheus
app.get("/metrics", async (_req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

// TC-15 — versão/commit atual
app.get("/version", (_req: Request, res: Response) => {
  res.status(200).json({
    version: appVersion,
    commit: process.env.GIT_COMMIT_SHA ?? "local",
  });
});

app.get("/hello", (_req: Request, res: Response) => {
  res.status(200).json({ message: "hello" });
});

app.use("/tasks", tasksRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AUT ouvindo na porta ${port}`);
});

export default app;
