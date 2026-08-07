# ADR-0002: PostgreSQL + Prisma como camada de dados

## Contexto

A AUT precisava de persistência real (não em memória), para validar migrations, estado entre reinicializações, e comportamento de concorrência (relevante para o bug de condição de corrida encontrado na Parte 4).

## Decisão

PostgreSQL rodando em container + Prisma como ORM, em vez de um banco embarcado (SQLite) ou serviço gerenciado de nuvem.

## Consequências

- Migrations versionadas em `app/prisma/migrations`, aplicadas via `prisma migrate deploy` — mesmo mecanismo local e em produção (container)
- Prisma Client gerado em tempo de build exige atenção extra no Dockerfile Alpine (dependência de OpenSSL, ver Parte 3) e ao usar `--ignore-scripts` no `npm ci` (Parte 9) — o `prisma generate` precisou virar um passo explícito
- Trade-off: Postgres em container tem custo de setup (vs. SQLite), mas sem isso não testaríamos migrations nem replicaríamos o comportamento real de um banco de produção
