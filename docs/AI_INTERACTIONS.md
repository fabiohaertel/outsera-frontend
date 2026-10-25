# Registro de interações com IA

Agente: **Claude Code** (modelo Claude Opus 5.5), extensão do VS Code.

Contexto fornecido ao agente: `AGENTS.md`/`CLAUDE.md` (stack, convenções, estrutura) e `docs/REQUIREMENTS.md` (requisitos transcritos do PDF + premissas de negócio).

## 1. Requisitos

**Prompt:** "Baseando-se nos requisitos deste arquivo, gere um arquivo docs/REQUIREMENTS.md com os requisitos. Esse arquivo será referenciado pelo AGENTS.md para ler as regras de negócio da avaliação." (com o `requirements.pdf` anexado)

O agente:

- Seguiu o formato do `REQUIREMENTS.md` do back-end.
- Transcreveu o PDF.
- Descreveu os anexos (layout): títulos, colunas, filtros e paginação.
- Consultou o OpenAPI e a API real e encontrou divergências em relação ao PDF:
  - `winnersByYear` retorna um array;
  - `page`/`size` são obrigatórios;
  - os estúdios vêm todos, então o front precisa calcular o top 3.
- Registrou essas divergências numa seção de premissas, junto com as regras de front-end (reset de página ao filtrar, filtro de vencedor com 3 estados, testes sem API real).

## 2. Planejamento

**Prompt:** "Faça um planejamento da implementação"

O agente (em modo de planejamento, sem editar código):

- Verificou o ambiente (Node 24, Angular CLI 22).
- Confirmou que a API permite CORS (não é preciso proxy).
- Levantou os valores reais para a verificação manual: anos 1986/1990/2015; Columbia 7, Paramount 6, Warner 5; 206 filmes.
- Propôs:
  - Angular 22 zoneless com signals e `rxResource`;
  - serviço único de API e regra do top 3 numa função pura;
  - componentes por painel e paginação própria com Bootstrap;
  - testes unitários com Vitest e HTTP mockado.

## 3. Implementação

**Prompt:** aprovação do plano.

O agente implementou o plano, rodou `npm test` (55 testes passando) e `npm run build` (sem warnings).

Ajustes feitos durante a implementação:

- **Bundle:** o CSS completo do Bootstrap + bootstrap-icons estourava o budget inicial (590 kB > 500 kB). A solução:
  - importar só os módulos Sass usados do Bootstrap;
  - trocar a fonte de ícones por SVG inline e caracteres (« ‹ › »).

  Resultado: 441 kB.
- **Busca por ano:** `(ngSubmit)` não dispara num `<form>` sem `NgForm`/`[formGroup]`, e o teste unitário pegou esse bug. A busca passou a usar o evento nativo `(submit)` com `preventDefault()`.
- **Debounce do filtro de ano:** os fake timers do Vitest não disparavam o debounce alimentado pelo effect de `toObservable`. Os testes desse fluxo passaram a usar timers reais com espera curta (~350 ms).
