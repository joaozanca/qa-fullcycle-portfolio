# QA Fullcycle Portfolio

Projeto de portfólio construído para aprender e demonstrar a rotina completa de um QA — não só automação, mas o ciclo inteiro: planejamento, execução manual, automação, bugs, pipeline de CI/CD e observabilidade.

## Por que este projeto existe

Grande parte dos portfólios de QA mostra só scripts de automação soltos, sem o contexto de onde eles se encaixam. Este projeto tenta cobrir o caminho inteiro: da leitura de um requisito até o dashboard de produção, usando ferramentas reais de mercado (Jira, Confluence, GitHub Actions, SonarCloud) em vez de simulações.

## A aplicação sob teste (AUT)

Uma API REST + frontend mínimo de CRUD de `Task`, construída deliberadamente simples — o ponto do projeto nunca foi a complexidade da aplicação, e sim a rotina de QA ao redor dela.

## Onde encontrar cada coisa

- **Código e testes**: [repositório no GitHub](https://github.com/joaozanca/qa-fullcycle-portfolio)
- **Pipeline de CI**: [GitHub Actions](https://github.com/joaozanca/qa-fullcycle-portfolio/actions)
- **Quality gate**: [SonarCloud](https://sonarcloud.io/dashboard?id=qa-fullcycle-portfolio)
- **Backlog e bugs**: Jira (projeto "Projeto Completo QA")
- **Documentação de processo**: [Confluence](https://joao-zanca.atlassian.net/wiki/spaces/~7120207430e143f1454afe9c57211d86eee509/overview?homepageId=163934) (Test Plan, Test Strategy, relatórios de execução) — requer conta Atlassian

Esta documentação (`/docs`) complementa o Confluence — enquanto o Confluence guarda os artefatos de processo (Test Plan, matrizes, relatórios), aqui fica a narrativa técnica: as decisões, os trade-offs, e por quê.
