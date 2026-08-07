# Observabilidade

Prometheus + Grafana + Alertmanager, sob demanda (profile `observability`
do `docker-compose.yml` — não sobe com `docker compose up` normal).

```powershell
docker compose --profile observability up -d
```

| Ferramenta   | URL                   | Credenciais                         |
| ------------ | --------------------- | ----------------------------------- |
| Grafana      | http://localhost:3001 | admin / admin (ou anônimo, leitura) |
| Prometheus   | http://localhost:9090 | —                                   |
| Alertmanager | http://localhost:9093 | —                                   |

## Dashboard

`observability/grafana/provisioning/dashboards/qa-fullcycle-app.json` —
versionado como código (não configurado na mão pela UI). Painéis:
status da AUT (`up`), taxa de requisições, taxa de erro, latência p95,
requisições por rota.

## Alertas

`observability/prometheus/alert-rules.yml` define 3 regras:

- **HighErrorRate** — taxa de erro (5xx) acima de 5% por 1 minuto
- **HighLatency** — p95 acima de 500ms por 2 minutos
- **AppDown** — Prometheus não consegue coletar métricas da AUT por 30s

Sem integração externa (Slack/e-mail) — o objetivo é demonstrar o
mecanismo (regra → disparo → agrupamento no Alertmanager), visível na
própria UI em `localhost:9093`.

## Verificação de SLO pós-deploy

```powershell
node observability/check-slo.js
```

Consulta o Prometheus, calcula a taxa de erro dos últimos 5 minutos e
falha (`exit 1`) se estiver acima do limiar de 5% — o mesmo usado no
alerta `HighErrorRate`. É o equivalente, neste projeto (sem Kubernetes/
Argo Rollouts), ao gate de "verificação de SLO antes de promover 100%
do tráfego" do documento de referência da esteira.
