# Decisões e trade-offs

Nem toda decisão neste projeto foi óbvia de antemão. Esta página documenta as que valem explicação — o "porquê", não só o "o quê".

## Jira e Confluence reais, não simulados

A maior parte de projetos de portfólio de QA substitui ferramentas corporativas por versões locais/gratuitas. Aqui foi o oposto: Jira e Confluence de verdade (plano gratuito), porque o objetivo era simular a _rotina_ de um QA, e a rotina inclui usar essas ferramentas especificamente — não um substituto genérico.

## GitHub público + GitHub Actions, não Gitea local

A referência inicial de pipeline "custo zero" evitava GitHub por causa de minutos pagos em repositórios privados. Mas este é um portfólio _público_ — repositório público no GitHub tem Actions ilimitado e gratuito, e mais importante: um recrutador consegue abrir o link e ver o pipeline rodando de verdade. Um runner só na máquina local não entrega isso.

## Testar manualmente antes de automatizar

A ordem das Partes não foi acidental: testes manuais e exploratórios (Parte 4) vieram _antes_ da automação (Partes 5-6). Os 2 bugs da Parte 4 foram encontrados assim — um deles (condição de corrida em cliques duplos) só foi _confirmado_ de forma confiável depois, via requisições concorrentes disparadas por script, porque clique humano não é rápido o suficiente para expor a mesma falha de forma consistente.

## Cobertura de testes unitários restrita de propósito

O gate de cobertura da Parte 7 exige 100%, mas só sobre um módulo (`validation.ts`), não o `src/` inteiro. Rotas e integração com banco são cobertas por testes de API e E2E, que rodam contra o servidor real — mockar o Prisma só para inflar uma métrica de cobertura teria menos valor real do que os testes de integração que já existem.

## Dois SonarQube diferentes, para propósitos diferentes

**SonarQube Community Edition**, local, sob demanda: usado para explorar achados manualmente durante o desenvolvimento (Parte 8).
**SonarCloud**, hospedado, no pipeline: porque o GitHub Actions roda em servidores do GitHub, que não enxergam `localhost`. Não são a mesma ferramenta com nomes diferentes — servem momentos diferentes do fluxo. (E foi preciso descobrir, na prática, que um projeto duplicado no SonarCloud pode existir silenciosamente se a chave do projeto não bater entre o `sonar-project.properties` local e o que a integração automática do GitHub cria.)

## Nem todo achado de ferramenta vira bug

Scanners de segurança (ZAP, Semgrep, SonarCloud) sempre trazem itens de baixíssimo valor junto com os reais — cache-control em rotas que nem existem, headers pensados para cenários que não se aplicam a esta aplicação. Cada achado foi triado individualmente (documentado em `tests/security/README.md`), com justificativa para o que foi corrigido e o que foi conscientemente aceito. Corrigir tudo cegamente é tão ruim quanto ignorar tudo.

## Pull Request de verdade, adotado no meio do projeto

Até a Parte 9, todo commit ia direto para a `main`. Ao configurar branch protection exigindo checks de CI, ficou claro que isso só tem efeito real se mudanças passarem por Pull Request — então o fluxo mudou a partir dali: toda mudança subsequente (observabilidade, este mesmo fechamento) passou por branch + PR + merge, com os checks rodando de verdade antes de cada merge.
