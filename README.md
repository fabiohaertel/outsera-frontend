# Golden Raspberry Awards – Front-End

Interface em Angular para consultar os indicados e vencedores da categoria **Pior Filme** do Golden Raspberry Awards, consumindo a API `https://challenge.outsera.tech/api/movies`.

A aplicação tem duas telas, acessíveis pelo menu lateral:

- **Dashboard**: anos com mais de um vencedor, top 3 estúdios com mais vitórias, produtores com maior e menor intervalo entre vitórias e busca de vencedores por ano.
- **List**: lista paginada de todos os filmes, com filtros por ano e por vencedor.

## Requisitos

- Node.js `^22.22.3`, `^24.15.0` ou `>=26` (exigência do Angular 22).
- npm 10 ou superior. O npm 9 falha ao instalar as dependências com o erro `Cannot read properties of null (reading 'edgesOut')`.

## Instalação

```bash
npm install
```

## Executando

```bash
npm start
```

Abra `http://localhost:4200`. A API pública permite CORS, então não é necessário proxy.

## Testes

```bash
npm test
```

Testes unitários com Vitest (`ng test`, ambiente jsdom). Todas as chamadas HTTP são mockadas, então nenhum teste depende da API real. Cobrem:

- o serviço da API (URLs e parâmetros);
- a regra do top 3 estúdios;
- cada painel do dashboard (dados, lista vazia, erro);
- a busca por ano (validação e resultado);
- a lista de filmes (paginação, filtros, debounce do ano);
- o componente de paginação, o menu e as rotas.

## Build

```bash
npm run build
```

Gera os arquivos em `dist/outsera-frontend/browser`.

## Estrutura

```text
src/app/
  app.ts / app.html                 # layout: barra superior, menu lateral e <router-outlet>
  app.routes.ts                     # /dashboard e /list (lazy), '' e rotas desconhecidas → /dashboard
  core/
    api/movie-api.ts                # acesso à API (HttpClient)
    api/api-base-url.ts             # token com a URL base da API
    models/movie.ts                 # tipos das respostas da API
    utils/top-studios.ts            # ordena estúdios por vitórias e pega os N primeiros
  features/
    dashboard/                      # tela Dashboard e um componente por painel
    movie-list/                     # tela List (tabela, filtros, paginação)
  shared/
    pipes/yes-no.ts                 # true/false → Yes/No
    ui/panel/                       # card com título usado pelos painéis
    ui/resource-state/              # carregamento e erro (com "Retry") de um resource
    ui/pagination/                  # controles de paginação
src/testing/                        # helpers de teste (DOM e fixtures)
docs/                               # requisitos e registro de interações com IA
```

## Decisões

- **Angular 22** com componentes standalone, sem zone.js (zoneless) e com signals. Os dados são carregados com `rxResource`, que fornece os estados de carregamento, erro e valor de cada painel. Assim, uma falha num painel não afeta os outros.
- **Bootstrap 5** via Sass, importando só os módulos usados para manter o bundle inicial abaixo do budget de 500 kB.
- **Divergências do PDF:** quando o PDF e a API real divergem, prevalece a API real. Por exemplo, `winnersByYear` retorna uma lista de filmes, não um objeto. Os detalhes estão em [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md), seção 8.
- **Top 3 estúdios:** a API retorna todos os estúdios, sem garantia de ordem. O front ordena por vitórias (desempate por nome) e exibe os 3 primeiros.
- **Lista de filmes:**
  - 15 itens por página.
  - O filtro de ano só é aplicado com 4 dígitos, após 300 ms sem digitação.
  - Qualquer mudança de filtro volta para a primeira página.
- **Layout:** a partir de 768px de largura. Abaixo de 1200px os painéis do dashboard ficam empilhados, e as tabelas rolam horizontalmente quando necessário.

## Uso de IA

O registro das interações com o agente está em [docs/AI_INTERACTIONS.md](docs/AI_INTERACTIONS.md).
