# Scans de segurança

Diferente dos testes de API/E2E/unitários, esses scans rodam via Docker,
sob demanda (não fazem parte do `npm test` de nenhum pacote). Todos exigem
a AUT rodando localmente (`docker compose up -d` na raiz do projeto).

## Gitleaks — segredos commitados

```powershell
docker run --rm -v "${PWD}:/repo" zricethezav/gitleaks:latest detect --source /repo --verbose
```

## Semgrep — análise estática (SAST)

```powershell
docker run --rm -v "${PWD}:/src" semgrep/semgrep semgrep scan --config auto /src
```

## OWASP ZAP — baseline scan (DAST)

Execute a partir desta pasta (`tests/security`):

```powershell
docker run --rm --network qa_fullcycle_network -v "${PWD}:/zap/wrk/:rw" -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://app:3000 -r zap-report.html
```

Usa a rede do `docker-compose` (`qa_fullcycle_network`) e o nome do serviço
(`app`) em vez de `host.docker.internal` — funciona igual local e no CI
(runners do GitHub Actions são Linux e não têm `host.docker.internal`).

Gera `zap-report.html` (não versionado — é um artefato de execução, como
o relatório de cobertura). O `zap.yaml` versionado é a configuração do
scan, criada automaticamente pelo próprio ZAP.

## Achados triados (histórico)

| Ferramenta | Achado                                                                                                           | Resolução                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Semgrep    | Container rodando como root                                                                                      | Corrigido — `USER node` no Dockerfile (KAN-12)                            |
| Semgrep    | GitHub Actions com tag mutável (`@v4`)                                                                           | Corrigido — pinado no hash de commit (Bug 8)                              |
| ZAP        | Cabeçalhos de segurança ausentes + CORS aberto                                                                   | Corrigido — `helmet` + remoção do `cors()` (Bug 6)                        |
| ZAP        | `Storable and Cacheable Content`, `Permissions-Policy`, `Modern Web Application`, `Cross-Origin-Embedder-Policy` | Triado como baixo risco para esta aplicação — não corrigido               |
| ZAP        | Protocolo HTTP sem criptografia entre containers no CI                                                           | Triado como baixo risco — tráfego interno, runner efêmero — não corrigido |
| SonarCloud | `npm ci` sem `--ignore-scripts` / `npx` sem versão travada (Dockerfile + ci.yml)                                 | Corrigido — hardening de supply-chain (Bug 9)                             |
