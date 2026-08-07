# Jornada do projeto

O projeto foi construído em 11 partes, cada uma fechada com testes passando e regressão confirmada antes de seguir para a próxima. Resumo de cada uma:

## Parte 0 — Fundação

Projeto no Jira, espaço no Confluence, repositório no GitHub. Decisão inicial: usar ferramentas reais (não simuladas) para a gestão do trabalho, e GitHub público em vez de Gitea local — para que o pipeline fosse visível a quem visse o portfólio.

## Parte 1 — Documentação de QA

Test Strategy, Test Plan, Matriz de Risco e DoR/DoD, escritos no Confluence antes de existir uma linha de código da aplicação (_shift-left testing_).

## Parte 2 — Design de casos de teste

15 casos de teste em Gherkin, matriz de rastreabilidade, e as três técnicas clássicas de design de teste (particionamento de equivalência, valor limite, tabela de decisão) aplicadas de verdade — não só citadas.

## Parte 3 — Construção da AUT

API + frontend mínimo. Dois problemas de infraestrutura reais surgiram aqui: o Prisma precisando de OpenSSL na imagem Alpine, e um conflito de porta com um PostgreSQL já instalado na máquina — ambos documentados como aprendizado, não escondidos.

## Parte 4 — Testes manuais e exploratórios

Execução dos 15 casos de teste e uma sessão exploratória sem roteiro fixo. Encontrou 2 bugs reais: um rótulo de status ausente, e uma condição de corrida em cliques rápidos (só reproduzível de forma confiável via automação, não manualmente).

## Parte 5 e 6 — Automação de API e E2E

Playwright para os dois. Decisão consciente de não automatizar tudo via E2E — só os 3 fluxos críticos definidos na Test Strategy, com o resto coberto por API (mais rápido, mais estável).

## Parte 7 — Testes unitários

Cobertura de 100% na lógica de validação isolada — e uma decisão explícita de **não** perseguir 100% de cobertura no `src/` inteiro via testes unitários, porque isso duplicaria o que API/E2E já garantem com mais confiança.

## Parte 8 — Testes não funcionais

Performance (k6), acessibilidade (axe-core) e segurança (Semgrep, Gitleaks, ZAP, SonarQube). Encontrou 5 bugs reais, incluindo dois problemas de acessibilidade que o testing funcional das partes anteriores não pegou — o argumento prático para testar em múltiplas camadas.

## Parte 9 — Pipeline de CI/CD

GitHub Actions com 7+ jobs, branch protection real (testado com Pull Requests de verdade, não simulado), e SonarCloud. Um bug sutil aqui: dois projetos diferentes acabaram existindo no SonarCloud sem perceber (um órfão, público; outro real, privado) — só descoberto ao investigar por que os números não batiam.

## Parte 10 — Observabilidade

Prometheus, Grafana (dashboard como código) e Alertmanager. Um ajuste de escopo consciente: o plano original previa verificação de SLO num cenário de _progressive delivery_ com Kubernetes, que este projeto não tem — vira uma verificação de SLO pós-deploy mais simples, mas real.

## Parte 11 — Fechamento

Relatório consolidado (Allure), métricas de processo reais (não estimadas) e esta documentação.
