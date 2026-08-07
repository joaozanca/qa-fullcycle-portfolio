# ADR-0003: Docker Compose em vez de Kubernetes

## Contexto

O material de estudo que inspirou o escopo original deste projeto (esteira de CI/CD de referência) previa Kubernetes local (k3d/kind) com ArgoCD e Argo Rollouts para deploy progressivo (canary).

## Decisão

Toda a infraestrutura local (app, banco, ferramentas de qualidade, observabilidade) roda via Docker Compose, com profiles (`quality`, `observability`) para controlar o que sobe em cada momento — sem Kubernetes.

## Consequências

- Setup mais simples e mais rápido de reproduzir por qualquer pessoa avaliando o portfólio (`docker compose up`, sem exigir um cluster local)
- Perde-se a demonstração de deploy progressivo/canary real — a verificação de SLO da Parte 10 (`observability/check-slo.js`) é a versão simplificada e honesta desse conceito, não uma simulação de Argo Rollouts
- Se o projeto crescer para múltiplos serviços com necessidade real de orquestração, esta decisão precisaria ser revisitada
