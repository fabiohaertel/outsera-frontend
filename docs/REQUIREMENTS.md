# Requisitos – Avaliação Front-End (Outsera)

> Fonte da verdade: [requirements.pdf](requirements.pdf).

## 1. Especificação do Teste

Desenvolver uma interface para possibilitar a leitura da lista de indicados e vencedores da categoria **Pior Filme** do Golden Raspberry Awards. A aplicação deverá ser composta por 2 views:

- Dashboard;
- Lista de todos os filmes.

A página deve possuir um menu com links para as views.

Os dados serão obtidos através da API disponibilizada em `https://challenge.outsera.tech/api/movies` (formato na seção 6).

Deve-se também criar testes unitários e incluir um arquivo readme com as instruções para rodar o projeto.

Documentação da API:

- OpenAPI: https://challenge.outsera.tech/v3/api-docs
- Swagger UI: https://challenge.outsera.tech/swagger-ui/index.html

## 2. Requisitos do sistema

1. O dashboard deve ser criado conforme o **Anexo 1** (seção 7.1) e composto por 4 painéis:
   - Mostrar em uma tabela os anos que tiveram mais de um vencedor;
   - Mostrar em uma tabela os três estúdios com mais vitórias;
   - Mostrar em tabelas os produtores com maior e menor intervalo entre vitórias;
   - Exibir em tabela os vencedores de determinado ano selecionado através de um campo de busca.
2. A view que lista todos os filmes deve seguir o **Anexo 2** (seção 7.2). Deverá possuir paginação e conter dois filtros:
   - Por ano;
   - Por vencedor.
3. Criar testes unitários de todas as funcionalidades.

## 3. Requisitos não funcionais do sistema

1. Responsividade mínima 768x1280;
2. Qualidade de código (legibilidade, lógica, indentação);
3. Boas práticas de implementação;
4. Documentação;
5. O código-fonte deve ser disponibilizado em um repositório git (Github, Gitlab, Bitbucket, etc).

## 4. LLMs, agentes e skills (inteligência artificial)

1. Para esta vaga, o uso de ferramentas de "inteligência artificial" é obrigatório e será avaliado;
2. O projeto deve conter no repositório um registro de interações com o agente. Isto pode ser disponibilizado no formato de logs, lista de prompts/skills utilizadas, ou histórico de interações.
3. A qualidade e desempenho do código serão avaliados nos mesmos critérios de uma revisão de código tradicional.

## 5. Endpoints

Base: `https://challenge.outsera.tech/api/movies`

| Uso | Método e caminho | Parâmetros |
| --- | --- | --- |
| Lista de filmes (paginada) | `GET /api/movies` | `page` e `size` (obrigatórios), `winner` (boolean, opcional), `year` (int, opcional) |
| Anos com mais de um vencedor | `GET /api/movies/yearsWithMultipleWinners` | — |
| Estúdios com contagem de vitórias | `GET /api/movies/studiosWithWinCount` | — |
| Intervalo de prêmios dos produtores | `GET /api/movies/maxMinWinIntervalForProducers` | — |
| Vencedores por ano | `GET /api/movies/winnersByYear` | `year` (int, obrigatório) |

Exemplo: `/api/movies?page=9&size=99&winner=true&year=2018`.

## 6. Formato da API

**Dados de filme** (`/api/movies`)

```json
{
  "content": [
    { "id": 999, "year": 1900, "title": "Movie Title", "studios": ["Studio Name"], "producers": ["Producer Name"], "winner": true },
    { "id": 999, "year": 1900, "title": "Movie Title", "studios": ["Studio Name", "Studio Name"], "producers": ["Producer Name"], "winner": false }
  ],
  "pageable": {
    "sort": { "sorted": false, "unsorted": true },
    "pageSize": 0,
    "pageNumber": 0,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 999,
  "last": false,
  "totalPages": 99,
  "first": true,
  "sort": { "sorted": false, "unsorted": true },
  "number": 0,
  "numberOfElements": 99,
  "size": 99
}
```

**Anos com mais de um vencedor** (`/yearsWithMultipleWinners`)

```json
{
  "years": [
    { "year": 9999, "winnerCount": 99 },
    { "year": 9999, "winnerCount": 99 }
  ]
}
```

**Estúdios** (`/studiosWithWinCount`)

```json
{
  "studios": [
    { "name": "Studio Name", "winCount": 9 },
    { "name": "Studio Name", "winCount": 9 }
  ]
}
```

**Intervalo de prêmios** (`/maxMinWinIntervalForProducers`)

```json
{
  "min": [
    { "producer": "Producer Name", "interval": 9, "previousWin": 2018, "followingWin": 2019 }
  ],
  "max": [
    { "producer": "Producer Name", "interval": 99, "previousWin": 1900, "followingWin": 1999 }
  ]
}
```

**Filme por ano** (`/winnersByYear?year=2018`)

O PDF mostra um objeto único, mas o OpenAPI define a resposta como **array** de filmes (ver 8.1):

```json
[
  { "id": 99, "year": 1990, "title": "Movie Title", "studios": ["Studio Name"], "producers": ["Producer Name"], "winner": true }
]
```

**Erro** (`400`, `404`, `500`, conforme OpenAPI)

```json
{ "status": "404 NOT_FOUND", "timestamp": "2025-01-01 23:59", "message": "The requested resource could not be found" }
```

## 7. Anexos (layout)

### 7.1 Anexo 1 – Dashboard

- Barra superior escura com o título da aplicação.
- Menu lateral à esquerda com os links **Dashboard** e **List**.
- Conteúdo em grade de 2 colunas com painéis em card:

| Painel | Título | Conteúdo |
| --- | --- | --- |
| 1 (sup. esquerdo) | List years with multiple winners | Tabela: `Year`, `Win Count` |
| 2 (sup. direito) | Top 3 studios with winners | Tabela: `Name`, `Win Count` |
| 3 (inf. esquerdo) | Producers with longest and shortest interval between wins | Subtítulo `Maximum` + tabela; subtítulo `Minimum` + tabela. Colunas: `Producer`, `Interval`, `Previous Year`, `Following Year` |
| 4 (inf. direito) | List movie winners by year | Campo numérico `Search by year` + botão de busca (ícone de lupa); tabela: `Id`, `Year`, `Title` |

### 7.2 Anexo 2 – Lista de filmes

- Mesma barra superior e menu lateral do Anexo 1.
- Título **List movies**.
- Tabela com as colunas:
  - `ID`;
  - `Year` – com campo de filtro `Filter by year` no cabeçalho;
  - `Title`;
  - `Winner?` – com select `Yes/No` no cabeçalho; valores exibidos como `Yes` / `No`.
- Paginação abaixo da tabela: primeira página, anterior, números de página (página atual destacada), próxima, última.
- O exemplo exibe 15 linhas por página.

---

## 8. Premissas e decisões (não fazem parte do enunciado)

### 8.1 Divergências entre o PDF e a API real

Verificado contra o OpenAPI e a API em 2026-10-25. Quando houver divergência, **a API real prevalece**:

- `winnersByYear` retorna um **array** de filmes (pode haver mais de um vencedor no ano, ou nenhum).
- `page` e `size` são **obrigatórios** em `/api/movies`; `page` começa em `0`.
- A resposta paginada também traz `empty` (boolean) e `sort.empty`.

### 8.2 Regras de negócio no front-end

- **Top 3 estúdios:** `studiosWithWinCount` retorna todos os estúdios. O front-end deve ordenar por `winCount` decrescente e exibir os 3 primeiros (não depender da ordem da resposta).
- **Intervalo de prêmios:** `min` e `max` são arrays; empates podem gerar várias linhas e todas devem ser exibidas.
- **Vencedores por ano:** a busca só é disparada com um ano válido (inteiro). Resultado vazio deve mostrar a tabela sem linhas ou uma mensagem de "nenhum resultado".
- **Lista de filmes:**
  - Alterar qualquer filtro volta para a primeira página.
  - Filtro de vencedor tem 3 estados: todos (sem parâmetro `winner`), `Yes` (`winner=true`) e `No` (`winner=false`).
  - Filtro de ano vazio não envia o parâmetro `year`.
  - Tamanho de página padrão: 15 (conforme Anexo 2).

### 8.3 Comportamento geral

- Cada painel/tela trata seus próprios estados de carregamento e erro, sem quebrar os demais painéis.
- Layout deve funcionar a partir de 768px de largura (seção 3, item 1).

### 8.4 Testes

- Testes unitários cobrindo: serviços de acesso à API (URLs e parâmetros), regras de negócio (ex.: top 3 estúdios), componentes de cada painel, filtros e paginação da lista, e o menu de navegação.
- Chamadas HTTP são mockadas nos testes; nenhum teste depende da API real.
