# Workflow CI/CD — Nomes das Stages (Execução 100% Local / Custo Zero)

Esteira completa de referência (padrão empresa de grande porte), do planejamento à operação — adaptada para rodar inteiramente em máquina local ou com ferramentas gratuitas/open-source, **sem nenhum custo de nuvem, licença ou assinatura**.

**Legenda das alterações:**
- ⚪ **Mantido** — stage inalterada, já roda local/grátis
- 🔄 **Alterado** — ferramenta paga substituída por equivalente local/open-source
- ➕ **Adicionado** — stage nova, necessária para viabilizar a execução local

> ℹ️ Nota geral: nada nesta esteira depende de conta em cloud provider (AWS/GCP/Azure), SaaS pago ou licença comercial. Onde havia serviço pago, foi indicado o substituto self-hosted.

---

## FASE 0 — Pré-Desenvolvimento

> 🔄 **Atlassian.** Jira e Confluence  

1. ⚪ `intake-demanda` — Registro da ideia/necessidade *( label `intake`)*
2. ⚪ `discovery-refinamento` — Descoberta e refinamento *( + comentários)*
3. 🔄 `documentacao-tecnica` — RFC / ADR versionados como Markdown no próprio repositório (`/docs/adr/`), usando o Confluence.
4. 🔄 `criacao-epic` — Criação do Epic *( ou Plane Epic — )*
5. 🔄 `quebra-user-stories` — Quebra em User Stories 
6. ⚪ `aprovacao-arquitetura` — Design Review / ARB *(revisão do ADR via Pull Request — aprovação é o merge)*
7. ⚪ `criacao-branch` — Criação da branch vinculada à issue (`feature/PROJ-123`)
8. ➕ `setup-plataforma-local` — Subida da plataforma base local via `docker-compose`: Gitea + Act Runner + Registry + Postgres. Executada uma única vez.
9. ➕ `provision-cluster-local` — Criação do cluster Kubernetes local com **k3d** (recomendado, mais leve), **kind** ou **minikube**. Substitui EKS/GKE/AKS.
10. ➕ `definicao-recursos-maquina` — Definição dos limites de CPU/RAM por ambiente local, evitando estouro de recursos ao rodar dev + staging + prod simultaneamente.

---

## FASE 1 — Desenvolvimento Local

11. ⚪ `setup-ambiente` — Setup do ambiente local (Docker Compose / devcontainer)
12. ⚪ `pre-commit-hooks` — Hooks de pré-commit *(framework `pre-commit` + **Gitleaks** para segredos — substitui GitGuardian/Snyk)*
13. ⚪ `conventional-commits` — Validação do padrão de mensagem *(commitlint ou `commitizen`)*
14. ⚪ `testes-locais` — Execução de testes locais
15. 🔄 `push-branch` — Push da branch para o **Gitea local** (`git.localhost` / `localhost:3000`), não para GitHub/GitLab SaaS

---

## FASE 2 — Continuous Integration (Pull Request)

> 🔄 **Runner.** Substitua GitHub Actions/GitLab SaaS (que cobram por minuto em repositório privado) pelo **Gitea Act Runner**, que executa workflows com a mesma sintaxe do GitHub Actions, na sua máquina, sem limite de minutos. Alternativa para testar pipelines sem sequer dar push: **`act`** (roda o workflow localmente via Docker).

16. 🔄 `trigger-pipeline` — Disparo automático do pipeline *(Gitea Actions / Act Runner self-hosted)*
17. ⚪ `checkout` — Checkout do código
18. 🔄 `restore-cache` — Restauração de cache de dependências *(cache em volume Docker local ou diretório do runner — dispensa cache remoto pago)*
19. ⚪ `install-dependencies` — Instalação de dependências
20. ⚪ `lint` — Análise estática de estilo *(ESLint / Ruff / golangci-lint — todos OSS)*
21. ⚪ `format-check` — Verificação de formatação *(Prettier / Black / gofmt)*
22. ⚪ `type-check` — Verificação de tipos *(TypeScript / mypy)*
23. ⚪ `build` — Compilação da aplicação
24. ⚪ `unit-tests` — Testes unitários
25. ⚪ `coverage-gate` — Gate de cobertura mínima *(limiar validado pela própria ferramenta de teste; dispensa Codecov/Coveralls)*
26. ⚪ `integration-tests` — Testes de integração *(**Testcontainers** — sobe dependências reais em Docker local)*
27. 🔄 `sast` — Análise estática de segurança com **Semgrep OSS** + **SonarQube Community Edition** (self-hosted em container). Sem SonarCloud/Snyk pagos.
28. 🔄 `quality-gate` — Quality Gate consolidado no **SonarQube Community local**
29. ⚪ `merge` — Merge (squash) na branch principal
30. ➕ `container-lint` — Lint do Dockerfile com **Hadolint**
31. ➕ `manifest-lint` — Validação dos manifests Kubernetes com **kubeconform** + **kube-linter**

---

## FASE 3 — Build & Empacotamento

32. ➕ `pipeline-local-dryrun` — Execução prévia do pipeline com **`act`** antes do push, para depurar sem consumir ciclos do runner
33. ➕ `login-registry-local` — Autenticação no registry local (evita rate limit anônimo do Docker Hub)
34. ⚪ `semantic-versioning` — Geração automática de versão *(`semantic-release` ou `git describe --tags`)*
35. ⚪ `build-artifact` — Build do artefato imutável
36. ⚪ `build-container-image` — Build da imagem Docker *(Docker Buildx ou **Podman**, alternativa sem licença Docker Desktop)*
37. 🔄 `push-registry` — Publicação em **registry local**: container `registry:2` (mínimo), **Harbor self-hosted** (completo, com scan e RBAC) ou o registry embutido do k3d. Substitui ECR/Nexus pagos.
38. ⚪ `generate-changelog` — Geração do changelog e release notes *(`git-cliff` ou `semantic-release`)*



---

## FASE 4 — Deploy em Desenvolvimento

39. 🔄 `provision-infra` — Provisionamento com **OpenTofu** (fork 100% open-source do Terraform, licença MPL) + **LocalStack Community** para emular serviços AWS localmente. Sem conta em cloud provider.
40. ⚪ `iac-validation` — Validação e plan de IaC *(`tofu validate` / `tofu plan`)*
41. 🔄 `deploy-dev` — Deploy no namespace `dev` do cluster **k3d local** *(Helm ou Kustomize — ambos OSS)*
42. ⚪ `db-migration` — Execução de migrations *(**Flyway Community** ou **Liquibase OSS**; Postgres em container)*
43. ➕ `seed-dados-teste` — Carga de dados sintéticos para o ambiente local (substitui cópia de dados de produção)
44. ⚪ `health-check-dev` — Health check da aplicação

---

## FASE 5 — Deploy em Staging / Homologação

> 🔄 **Isolamento sem custo.** Staging deixa de ser um cluster separado e passa a ser um **namespace** (`staging`) no mesmo cluster local, com quota de recursos própria.

45. 🔄 `deploy-staging` — Deploy no namespace `staging` do cluster local
46. ⚪ `e2e-tests` — Testes end-to-end com **Playwright** (totalmente gratuito, roda headless local). Evite Cypress Cloud, que é pago — o Cypress open-source local também serve.
47. ➕ `aprovacao-staging` — Aprovação para promoção *(comentário/label na PR do Gitea)*

---

## FASE 6 — Deploy em Produção

> 🔄 **"Produção" local.** O ambiente `prod` é um namespace dedicado no cluster local, com réplicas e políticas próprias — suficiente para validar toda a esteira sem contratar infraestrutura.

48. 🔄 `change-request` — Abertura de Change Request como **issue no Gitea** com template de CR (substitui ServiceNow/Jira Service Management)
49. 🔄 `manual-approval` — Aprovação manual via **Gitea Environments/Protected Branch** ou input manual do workflow (gate de produção)
50. ➕ `deploy-prod` — Deploy no namespace `prod` do cluster local
51. ➕ `gitops-sync` — Sincronização GitOps com **ArgoCD** ou **Flux CD** (ambos CNCF, gratuitos, self-hosted)
52. ➕ `progressive-delivery` — Canary/Blue-Green com **Argo Rollouts** ou **Flagger** (substitui AWS CodeDeploy/Spinnaker gerenciado)
53. ➕ `db-migration-prod` — Migrations em produção com estratégia *expand/contract*
54. ➕ `verificacao-slo` — Verificação automática de SLO antes de promover 100% do tráfego *(consulta ao Prometheus local)*
55. ⚪ `auto-rollback` — Rollback automático em caso de falha *(`helm rollback` / Argo Rollouts analysis)*

---

## FASE 7 — Pós-Deploy & Operação

56. ⚪ `monitoring` — Monitoramento com **Prometheus + Grafana OSS** (self-hosted). 🔄 Datadog removido — é pago por host.
57. 🔄 `logging` — Centralização de logs com **Grafana Loki + Promtail** (bem mais leve que o ELK em máquina local; se preferir ELK, use OpenSearch, que não tem restrição de licença)
58. ➕ `tracing` — Tracing distribuído com  **Grafana Tempo**
59. ➕ `alerting` — Alertas com **Prometheus Alertmanager** 
60. ➕ `dashboards` — Dashboards versionados como código no Grafana (provisionamento via arquivo)
61. 🔄 `update-jira` — Atualização automática da **issue no Jira** para "Done" *(via API do Jira no final do pipeline)*
62. 🔄 `update-confluence` — Atualização da documentação em **Markdown no repositório** *(commit automático em `/docs`, publicado com **MkDocs Material** ou **Docusaurus** — ambos gratuitos)*



---

## FASE 8 — App de Teste da Esteira

Aplicação mínima usada apenas para validar todas as stages acima. Toda a stack sugerida é gratuita e roda local.

63. ⚪ `app-hello-api` — API REST com endpoint `/hello`
64. ⚪ `app-health-endpoint` — Endpoint `/health` para health check
65. ⚪ `app-metrics-endpoint` — Endpoint `/metrics` para Prometheus
66. ⚪ `app-crud-simples` — CRUD de uma única entidade (ex.: Task)
67. 🔄 `app-banco-dados` — Banco de dados para validar migrations: **PostgreSQL em container** (evita RDS/Aurora e bancos com licença comercial)
68. ⚪ `app-teste-unitario` — Ao menos 1 teste unitário
69. ⚪ `app-teste-integracao` — Ao menos 1 teste de integração *(via Testcontainers)*
70. ⚪ `app-teste-e2e` — Ao menos 1 teste E2E *(Playwright)*
71. ⚪ `app-dockerfile` — Dockerfile multi-stage
72. ⚪ `app-frontend-minimo` — Página única consumindo a API
73. ⚪ `app-versao-visivel` — Exibição da versão/commit para validar o deploy


---

## Stages Transversais (executam em qualquer fase)

74. ⚪ `audit-log` — Trilha de auditoria do pipeline *(logs do Act Runner + histórico do Gitea)*
75. 🔄 `cost-check` — Substituído por **verificação de recursos locais**: uso de CPU/RAM/disco do cluster e do host. Ferramentas de FinOps (Infracost, CloudHealth) não se aplicam a ambiente local — o "custo" aqui é a capacidade da máquina.

76. ➕ `backup-local` — Backup dos volumes e do banco *(pg_dump agendado + snapshot de volume Docker)*
77. ➕ `disk-space-guard` — Verificação de espaço em disco antes do build (imagens Docker acumulam rápido em ambiente local)
78. ⚪ `cleanup` — Limpeza de ambientes efêmeros e artefatos antigos *(`docker system prune`, política de retenção do registry, remoção de namespaces de PR)*


---

## Resumo da Stack — Custo Zero

| Função | Ferramenta (local / gratuita) | Substitui |
|---|---|---|
| Git + Issues + Wiki + CI | Gitea + Act Runner | GitHub/GitLab pagos, Jira, Confluence |
| Executar pipeline offline | `act` | Minutos de CI pagos |
| Cluster | k3d / kind / minikube | EKS, GKE, AKS |
| Registry | `registry:2` ou Harbor | ECR, Nexus, Artifactory |
| IaC | OpenTofu + LocalStack | Terraform Cloud, cloud real |
| Deploy / GitOps | Helm, Kustomize, ArgoCD, Argo Rollouts | Spinnaker, CodeDeploy |
| Qualidade / SAST | SonarQube CE, Semgrep OSS | SonarCloud, Snyk |
| Segurança | Trivy, Gitleaks, Checkov, OWASP ZAP, Cosign | Snyk, Prisma Cloud |
| SBOM | Syft | Ferramentas comerciais |
| Testes | Testcontainers, Playwright, k6 OSS, Pact | Cypress Cloud, k6 Cloud, BrowserStack |
| Observabilidade | Prometheus, Grafana, Loki, Tempo, Jaeger | Datadog, New Relic |
| Erros / Status | GlitchTip, Uptime Kuma | Sentry SaaS, PagerDuty |
| Feature Flags | Unleash OSS / Flagsmith | LaunchDarkly |
| Banco | PostgreSQL em container | RDS, Aurora |
| Docs | MkDocs Material / Docusaurus | Confluence |
| E-mail de teste | Mailpit / MailHog | SendGrid, SES |
| Dependências | Renovate self-hosted | Dependabot pago |

---

## Pontos de Atenção para Custo Zero

1. **Docker Desktop** é pago para empresas com mais de 250 funcionários ou US$ 10M+ de receita. Alternativas gratuitas: **Docker Engine** no Linux, **Podman Desktop**, **Rancher Desktop** ou **Colima** (macOS).
2. **Docker Hub** tem limite de pulls anônimos. Use o registry local e um *pull-through cache* para as imagens base.
3. **SonarQube** — apenas a *Community Edition* é gratuita (sem análise de branch/PR nativa; contorne rodando na branch principal ou usando o Semgrep para a PR).
4. **LocalStack** — a versão Community cobre S3, SQS, Lambda, DynamoDB e outros; recursos avançados são pagos. Prefira serviços nativos do cluster quando possível.
5. **Recursos da máquina** — rodar cluster + observabilidade + SonarQube simultaneamente exige ~16 GB de RAM. Com menos, suba a stack por fase (perfis do `docker-compose`) em vez de tudo de uma vez.
