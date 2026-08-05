# Plano do Projeto — Rotina Completa de QA para Portfólio

> Este plano usa a esteira de [`workflow-cicd-stages-local-zero-custo.md`](workflow-cicd-stages-local-zero-custo.md) como espinha dorsal de infraestrutura e mapeia, em cada fase, **o que um QA efetivamente faz** ali dentro. Tudo 100% local / custo zero.

**AUT (Application Under Test):** app mínima própria — API REST + front simples de CRUD de `Task` (a mesma da Fase 8 do documento de CI/CD), com Postgres, health check, métricas e versão exposta no `/version`.

**Ordem sugerida:** cada Parte é um marco fechável (branch → PR → merge). Não precisa esperar terminar uma fase da esteira inteira para começar a próxima Parte — várias rodam em paralelo depois que a Parte 3 (app + ambiente) estiver de pé.

**Jira + Confluence de verdade.** Como o objetivo é simular a rotina real de um QA (e não só a técnica), vamos usar **Atlassian Cloud Free** (plano gratuito, até 10 usuários — continua custo zero) em vez dos substitutos locais (Gitea issues/Markdown) sugeridos no documento de CI/CD para essas duas ferramentas. Ou seja: nas Fases 0, 4 e 7 do outro documento, onde está `🔄` para Jira/Confluence, vamos manter as ferramentas originais. Todo o resto da esteira (Gitea, k3d, SonarQube etc.) segue local como planejado.

**Como cada passo vai funcionar.** Você não tem experiência prévia em QA, então a cada Parte eu vou: (1) executar/orientar a ação, e (2) **explicar depois** o que foi feito, por que é feito assim no mercado, e onde aquilo se encaixa na rotina de um QA real. Pode perguntar "por quê" a qualquer momento — faz parte do processo.

---

## Parte 0 — Fundação do projeto
- Criar conta e **projeto no Jira** (tipo Scrum ou Kanban) + **espaço no Confluence** ligado a ele
- Criar o repo Git (local, depois espelhar no Gitea local — Fase 0, stage 7 `criacao-branch` em diante)
- Estrutura de pastas: `/app`, `/docs`, `/docs/adr`, `/tests` (`/tests/api`, `/tests/e2e`, `/tests/unit`, `/tests/perf`), `/qa` (artefatos de QA)
- `README.md` inicial com objetivo do projeto (o "porquê" para quem for avaliar o portfólio)

## Parte 1 — Documentação de QA (Fase 0)
Os artefatos que todo QA sênior é cobrado a produzir antes de testar, escritos **no Confluence** (não em Markdown local, para treinar a ferramenta real):
- **Test Policy / Test Strategy** (página no Confluence)
- **Test Plan** da AUT (escopo, fora de escopo, ambientes, critérios de entrada/saída, riscos)
- **Matriz de risco** (probabilidade × impacto por funcionalidade) para priorizar onde testar mais
- Definição de **critérios de aceite** (DoR/DoD) ligados às **User Stories cadastradas no Jira** (stage 5 `quebra-user-stories`)
- Decisões técnicas de arquitetura continuam como ADR em `/docs/adr` no repo (isso é convenção de Engenharia, não de QA — mantemos como está no documento de CI/CD)

## Parte 2 — Design de casos de teste (Fase 0/1)
- Casos de teste manuais em formato Gherkin (`Given/When/Then`) por funcionalidade da AUT
- **Matriz de rastreabilidade**: requisito → caso de teste → automatizado? (sim/não) → status
- Técnicas a demonstrar: particionamento de equivalência, análise de valor limite, tabela de decisão (pelo menos 1 exemplo de cada, documentado)

## Parte 3 — App mínima + ambiente local (Fase 1 / Fase 8)
- Implementar a AUT: `/hello`, `/health`, `/metrics`, CRUD de `Task`, front mínimo, versão visível
- Dockerfile multi-stage, docker-compose com Postgres
- Setup local + pre-commit hooks + commitlint (stages 11–13)

## Parte 4 — Testes manuais e exploratórios (Fase 1/2)
- Execução dos casos de teste da Parte 2, com evidências (prints/gravação)
- **Sessão de teste exploratório** documentada (charter + notas — estilo session-based testing)
- Abertura de **bugs como issues no Jira** (tipo Bug), com template (passos, esperado vs. obtido, severidade/prioridade) — o fluxo real de um QA no dia a dia
- Um relatório de execução (test summary report) publicado no Confluence ao final do ciclo

## Parte 5 — Automação de testes de API (Fase 2)
- Suite de testes de API para os endpoints da AUT (Playwright API request ou Postman/Newman)
- Casos: contrato/schema, status codes, regras de negócio, casos de erro, autenticação se houver
- Integração no pipeline como stage `api-tests` (encaixa perto de `integration-tests`, stage 26)

## Parte 6 — Automação E2E/UI (Fase 2/5)
- Suite Playwright cobrindo os fluxos críticos do front (mapeados na matriz de risco)
- Padrão Page Object para manter manutenível
- Integração como stage `e2e-tests` (já previsto na Fase 5, stage 46)

## Parte 7 — Testes unitários e gate de qualidade (Fase 2)
- Cobrir a lógica da AUT com testes unitários (stage 24)
- Configurar `coverage-gate` (stage 25) e ligar ao SonarQube CE / Semgrep (stages 27–28)

## Parte 8 — Testes não funcionais (Fase 2/6)
- **Performance**: script k6 (carga básica nos endpoints principais, thresholds de latência/erro)
- **Acessibilidade**: axe-core no front
- **Segurança básica**: OWASP ZAP baseline scan na AUT rodando local, Semgrep/Gitleaks já cobertos na esteira

## Parte 9 — Integração no pipeline CI/CD (Fase 2–6)
- Ligar todas as suites (unit, API, E2E, perf) como stages no Gitea Act Runner
- Gates de qualidade bloqueando merge/deploy em caso de falha
- Testar promoção `dev → staging` (Fase 4/5) validando com `e2e-tests` como gate de aprovação (stage 47)
- Automatizar `update-jira` (mover issue para "Done" via API do Jira) e `update-confluence` (registrar a execução) ao fim do pipeline (stages 61–62, com as ferramentas reais)

## Parte 10 — Observabilidade e "QA em produção" (Fase 6/7)
- Dashboards Grafana com métricas relevantes para QA: taxa de erro, latência, uso do `/health`
- Alerta básico no Alertmanager (ex.: taxa de erro acima de X%)
- Verificação de SLO antes de promover 100% do tráfego (stage 54) — ligar isso a um "gate de qualidade pós-deploy"

## Parte 11 — Métricas de QA e fechamento do portfólio
- Relatório consolidado de execução (Allure Report ou similar) publicado via pipeline
- Métricas de processo: % cobertura, taxa de bugs encontrados x escapados, tempo médio de execução da suite
- Documentação final em `/docs` (MkDocs) contando a história do projeto: decisões, trade-offs, o que testar manualmente vs. automatizar e por quê
- Ajustar `README.md` como vitrine (prints, badges de pipeline, link do relatório)

---

## Como vamos trabalhar
Sugiro fecharmos **uma Parte por vez**, cada uma virando um commit/PR revisável. Quando você disser "bora pra Parte X", eu detalho os arquivos e o passo a passo daquela parte especificamente, sem adiantar as demais.
