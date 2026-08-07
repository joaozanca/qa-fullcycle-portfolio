# Métricas de QA

Dados reais do projeto, não estimativas — coletados ao final da Parte 11.

## Cobertura de testes

- **30 testes automatizados**: 6 unitários, 19 de API, 5 E2E (incluindo acessibilidade)
- **100%** de cobertura unitária no módulo de regras de negócio (`validation.ts`)
- **15/15** casos de teste da Parte 2 rastreados e automatizados (ver Matriz de Rastreabilidade no Confluence)

## Bugs encontrados x escapados

9 bugs encontrados ao longo do projeto, todos corrigidos com regressão confirmada:

| Origem                         | Quantidade |
| ------------------------------ | ---------- |
| Teste manual roteirizado       | 1          |
| Teste exploratório             | 1          |
| Automatizado (acessibilidade)  | 2          |
| SAST (Semgrep/SonarQube/Cloud) | 4          |
| DAST (OWASP ZAP)               | 1          |

Dois bugs de acessibilidade **escaparam** das Partes 4-7 (testes funcionais manuais e automatizados) e só foram encontrados na Parte 8, por uma camada de teste especializada (axe-core). É o argumento prático, não só teórico, para testar em múltiplas camadas em vez de confiar só numa bateria "funcional" genérica.

## Tempo de execução (medido)

| Suite                                      | Tempo    |
| ------------------------------------------ | -------- |
| Testes unitários                           | ~0.5s    |
| Testes de API (19 testes)                  | ~0.9s    |
| Testes E2E + acessibilidade (5)            | ~1.6s    |
| Performance (k6, perfil completo)          | 40s      |
| Pipeline de CI completo (7 jobs, paralelo) | ~1min30s |

## Atividade do repositório

- 27 commits
- 6+ Pull Requests com quality gate real (branch protection exigindo CI verde)
- 16 issues no Jira (1 Epic + 6 User Stories + 9 Bugs), todas em "Done"
