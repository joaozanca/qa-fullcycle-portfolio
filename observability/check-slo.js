// Verificação de SLO pós-deploy: consulta o Prometheus e falha (exit 1)
// se a taxa de erro dos últimos 5 minutos estiver acima do limiar.
//
// Uso: node observability/check-slo.js
// Requer a stack de observabilidade no ar (docker compose --profile observability up -d)

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || "http://localhost:9090";
const ERROR_RATE_THRESHOLD = 0.05; // 5%, mesmo limiar do alerta HighErrorRate

async function queryPrometheus(promql) {
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(promql)}`;
  const res = await fetch(url);
  const body = await res.json();
  if (body.status !== "success") {
    throw new Error(`Consulta ao Prometheus falhou: ${JSON.stringify(body)}`);
  }
  return body.data.result;
}

async function main() {
  const errorRateQuery =
    'sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))';

  const result = await queryPrometheus(errorRateQuery);
  const errorRate = result.length > 0 ? Number(result[0].value[1]) : 0;

  console.log(`Taxa de erro (últimos 5min): ${(errorRate * 100).toFixed(2)}%`);
  console.log(`Limiar de SLO: ${(ERROR_RATE_THRESHOLD * 100).toFixed(2)}%`);

  if (errorRate > ERROR_RATE_THRESHOLD) {
    console.error("❌ SLO violado — taxa de erro acima do limiar. Bloqueando promoção.");
    process.exit(1);
  }

  console.log("✅ SLO dentro do limiar — deploy aprovado.");
}

main().catch((err) => {
  console.error("Erro ao verificar SLO:", err.message);
  process.exit(1);
});
