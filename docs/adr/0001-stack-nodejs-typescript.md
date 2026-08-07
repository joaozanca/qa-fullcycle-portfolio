# ADR-0001: Node.js + TypeScript como stack da AUT

## Contexto

Precisávamos de uma stack para a aplicação sob teste (AUT). A automação de testes (Parte 5/6) já estava decidida como Playwright, que é nativo em Node.js/TypeScript.

## Decisão

API + frontend mínimo em Node.js/TypeScript (Express), em vez de Python ou outra linguagem.

## Consequências

- Um único ecossistema entre aplicação e automação (menos troca de contexto para quem lê o repositório inteiro)
- Testes de API do Playwright rodam contra a AUT sem nenhuma ponte entre linguagens
- Trade-off: quem vier de uma vaga de QA orientada a Python não vê essa linguagem aqui — decisão consciente, já que o foco do portfólio é o processo de QA, não a linguagem da AUT
