# Projeto Completo QA

Projeto de portfólio que simula a rotina completa de um QA (Quality Assurance) numa empresa real: planejamento de testes, execução manual, automação (API, E2E, performance), bugs, integração em pipeline CI/CD e documentação — usando **Jira** e **Confluence** de verdade para gestão de backlog/bugs/documentação.

[![CI](https://github.com/joaozanca/qa-fullcycle-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/joaozanca/qa-fullcycle-portfolio/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=qa-fullcycle-portfolio&metric=alert_status)](https://sonarcloud.io/dashboard?id=qa-fullcycle-portfolio)

## Por que este projeto existe

Demonstrar, de ponta a ponta, o trabalho de um QA sobre uma aplicação real (não só scripts de automação soltos): desde a leitura de um requisito até o relatório de qualidade pós-deploy.

## Aplicação sob teste (AUT)

API REST + front mínimo de CRUD de `Task`, com Postgres, `/health`, `/metrics` e `/version`.

## Onde encontrar cada coisa

| O quê                                       | Onde                                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Backlog, User Stories, Bugs                 | Jira — projeto "Projeto Completo QA"                                    |
| Test Plan, Test Strategy, relatórios        | Confluence                                                              |
| Código da aplicação                         | [`/app`](app)                                                           |
| Testes automatizados                        | [`/tests`](tests) (`api`, `e2e`, `unit`, `perf`)                        |
| Artefatos de QA (casos de teste, matrizes)  | [`/qa`](qa)                                                             |
| Decisões técnicas de arquitetura (ADR)      | [`/docs/adr`](docs/adr)                                                 |
| Plano do projeto                            | [`plano-projeto-qa-portfolio.md`](plano-projeto-qa-portfolio.md)        |
| Pipeline de CI (GitHub Actions)             | [Actions](https://github.com/joaozanca/qa-fullcycle-portfolio/actions)  |
| Quality gate (SonarCloud)                   | [SonarCloud](https://sonarcloud.io/dashboard?id=qa-fullcycle-portfolio) |
| Scans de segurança (Semgrep, Gitleaks, ZAP) | [`/tests/security`](tests/security)                                     |

## Status

Em construção — acompanhe o progresso pelas Partes descritas em `plano-projeto-qa-portfolio.md`.
