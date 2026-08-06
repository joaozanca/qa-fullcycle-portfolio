import http from "k6/http";
import { check, sleep } from "k6";

// Carga básica conforme Test Strategy (Confluence): fora de escopo testar
// acima de 50 usuários simultâneos. Este teste fica bem abaixo disso.
export const options = {
  scenarios: {
    carga_basica: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 },
        { duration: "20s", target: 20 },
        { duration: "10s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% das requisições abaixo de 500ms
    http_req_failed: ["rate<0.01"], // menos de 1% de erro
  },
};

const BASE_URL = __ENV.BASE_URL || "http://host.docker.internal:3000";

export default function () {
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    "/health responde 200": (r) => r.status === 200,
  });

  const listRes = http.get(`${BASE_URL}/tasks`);
  check(listRes, {
    "GET /tasks responde 200": (r) => r.status === 200,
  });

  const createRes = http.post(
    `${BASE_URL}/tasks`,
    JSON.stringify({ title: `Task de carga ${__VU}-${__ITER}` }),
    { headers: { "Content-Type": "application/json" } }
  );
  check(createRes, {
    "POST /tasks responde 201": (r) => r.status === 201,
  });

  if (createRes.status === 201) {
    const id = JSON.parse(createRes.body).id;
    http.del(`${BASE_URL}/tasks/${id}`);
  }

  sleep(1);
}
