# QA Fullcycle Portfolio

Projeto de portfólio que simula a rotina completa de um QA (Quality Assurance) numa empresa real: planejamento de testes, execução manual, automação (API, E2E, performance, acessibilidade, segurança), gestão de bugs, pipeline de CI/CD com quality gate real e observabilidade — usando **Jira** e **Confluence** de verdade, não simulações.

[![CI](https://github.com/joaozanca/qa-fullcycle-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/joaozanca/qa-fullcycle-portfolio/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=qa-fullcycle-portfolio&metric=alert_status)](https://sonarcloud.io/dashboard?id=qa-fullcycle-portfolio)

## Por que este projeto existe

A maioria dos portfólios de QA mostra scripts de automação soltos. Este projeto cobre o ciclo inteiro: da leitura de um requisito até o dashboard de produção — incluindo os erros reais encontrados no caminho (documentados, não escondidos) e as decisões técnicas por trás de cada etapa.

**9 bugs reais encontrados e corrigidos** ao longo do projeto — manuais, exploratórios, de acessibilidade, e de segurança (SAST/DAST) — todos rastreados no Jira com causa raiz e regressão confirmada. Detalhes em [`docs/metricas.md`](docs/metricas.md).

## Aplicação sob teste (AUT)

API REST + frontend mínimo de CRUD de `Task`, com Postgres, `/health`, `/metrics` e `/version`. Ver [`docs/adr`](docs/adr) para as decisões técnicas por trás dela.

## O que este projeto demonstra

| Área                              | Onde ver                                                                                                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Planejamento e documentação de QA | [Confluence](https://joao-zanca.atlassian.net/wiki/spaces/~7120207430e143f1454afe9c57211d86eee509/overview?homepageId=163934) (Test Plan, Test Strategy, Matriz de Risco, DoR/DoD) — requer conta Atlassian |
| Design de casos de teste          | [`/qa`](qa) — Gherkin, matriz de rastreabilidade, técnicas de design                                                                                                                                        |
| Gestão de bugs e backlog          | Jira — projeto "Projeto Completo QA"                                                                                                                                                                        |
| Automação de API e E2E            | [`/tests`](tests) — Playwright                                                                                                                                                                              |
| Testes não funcionais             | Performance (k6), acessibilidade (axe-core), segurança (Semgrep, Gitleaks, ZAP, SonarCloud)                                                                                                                 |
| Pipeline de CI/CD                 | [GitHub Actions](https://github.com/joaozanca/qa-fullcycle-portfolio/actions) — 7+ jobs, branch protection real, testado com PRs de verdade                                                                 |
| Observabilidade                   | [`/observability`](observability) — Prometheus, Grafana, Alertmanager                                                                                                                                       |
| Relatório consolidado             | Allure (gerado no pipeline, artefato de cada execução)                                                                                                                                                      |

## Documentação

- **[docs/](docs/)** — jornada do projeto, decisões e trade-offs, métricas de QA, ADRs técnicos ([`mkdocs.yml`](mkdocs.yml); `docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material` para navegar localmente)
- **[plano-projeto-qa-portfolio.md](plano-projeto-qa-portfolio.md)** — o plano original, em 11 partes, que guiou a construção

## Rodando localmente

```powershell
docker compose up -d                              # AUT + Postgres
docker compose --profile observability up -d       # + Prometheus/Grafana/Alertmanager
docker compose --profile quality up -d sonarqube   # + SonarQube CE local
```

Testes: `tests/api`, `tests/e2e`, `tests/perf`, `tests/security` — cada um com seu próprio `README`/`package.json`.

## Status

Completo — as 11 partes do plano foram fechadas, cada uma com testes passando e regressão confirmada antes de seguir para a próxima.
