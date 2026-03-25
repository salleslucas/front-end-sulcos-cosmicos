# Sulcos Cósmicos — Front-end

Interface web desenvolvida com **React + Vite** para o e-commerce de vinis Sulcos Cósmicos, como parte do trabalho acadêmico da Pós-Graduação em Desenvolvimento Full Stack da **PUC-Rio** (Sprint 2).

---

## Descrição do Projeto

Este componente implementa a interface do usuário do sistema Sulcos Cósmicos, uma loja virtual de discos de vinil com identidade visual artística e temática espacial. O front-end consome dois serviços distintos: a **iTunes Search API** para o catálogo de álbuns e a **API REST** do back-end próprio (FastAPI) para o gerenciamento de pedidos.

A iTunes Search API é uma API pública da Apple, gratuita e sem necessidade de autenticação. Ela retorna dados reais de álbuns musicais com artista, título, capa e gênero, o que a torna adequada para o domínio de uma loja de vinis. A lógica de pedidos fica inteiramente no back-end, mantendo cada parte do sistema com uma responsabilidade bem definida.

### Por que a iTunes Search API?

A FakeStore API foi substituída porque retorna produtos genéricos (eletrônicos, roupas, joias) que não têm nenhuma relação com uma loja de vinis. A iTunes Search API fornece dados reais do catálogo musical da Apple, com nome do artista, título do álbum, capa em alta resolução, gênero e ano de lançamento. Isso tornou o catálogo da loja coerente com o domínio do projeto.

### Tecnologias utilizadas

| Tecnologia          | Versão  | Finalidade                                              |
|---------------------|---------|----------------------------------------------------------|
| **React**           | 18.3    | Biblioteca de construção de interfaces                  |
| **Vite**            | 5.x     | Empacotador e servidor de desenvolvimento               |
| **Tailwind CSS**    | 3.4     | Estilização utilitária                                  |
| **Framer Motion**   | 11.x    | Animações declarativas em componentes React             |
| **React Router DOM**| 6.x     | Roteamento client-side (SPA)                            |
| **react-hot-toast** | 2.x     | Notificações de feedback ao usuário                     |
| **Nginx**           | 1.27    | Servidor web para a build de produção no Docker         |
| **Docker**          | —       | Conteinerização para execução reproduzível              |

---

## Arquitetura

O diagrama abaixo representa o fluxo de dados entre os componentes do sistema:

```
┌────────────────────────────────────────────────────────────────────┐
│                     Front-End (React + Vite)                       │
│                                                                    │
│  src/                                                              │
│  ├── pages/        Telas da aplicação (Home, Cart, etc.)          │
│  ├── components/   Componentes reutilizáveis de UI                │
│  ├── context/      Estado global do carrinho (React Context)      │
│  ├── hooks/        Custom hooks (useOrders)                       │
│  ├── services/     Camada de acesso às APIs                       │
│  └── utils/        Transformação de dados (transform.js)          │
└───────────────┬────────────────────────┬───────────────────────────┘
                │                        │
                ▼                        ▼
  ┌─────────────────────┐   ┌────────────────────────────┐
  │  iTunes Search API  │   │  API REST Sulcos Cósmicos  │
  │  catálogo de vinis  │   │  FastAPI + SQLite           │
  │  (API externa)      │   │  (back-end próprio)         │
  └─────────────────────┘   └────────────────────────────┘
```

### Camada de serviços (`src/services/`)

| Arquivo            | Responsabilidade                                               |
|--------------------|----------------------------------------------------------------|
| `storeApi.js`      | Consultas à iTunes Search API para o catálogo de álbuns       |
| `ordersService.js` | Comunicação com o back-end para CRUD de pedidos               |
| `api.js`           | Cliente HTTP base com tratamento centralizado de erros        |

### Camada de transformação (`src/utils/transform.js`)

Converte os objetos retornados pela iTunes API para o modelo interno da aplicação, isolando os componentes React do contrato específico da API externa. Também calcula o preço em BRL (a partir do valor em USD com margem de revenda) e define a raridade do disco com base no ano de lançamento do álbum.

---

## Funcionalidades

| Funcionalidade       | Descrição                                                                  |
|----------------------|----------------------------------------------------------------------------|
| Catálogo de discos   | Listagem com capas reais, artista, gênero, raridade e avaliação           |
| Filtros              | Por gênero musical, raridade, busca textual e ordenação por preço/avaliação|
| Paginação            | 8 discos por página                                                        |
| Detalhe do disco     | Animação de vitrola com informações completas do álbum                    |
| Carrinho             | Drawer lateral animado com controle de quantidade e total                 |
| Checkout             | Formulário de entrega com envio do pedido ao back-end via POST            |
| Histórico de pedidos | Listagem com status, expansão de itens e opções de atualização/exclusão   |
| Skeleton loading     | Cards placeholder durante o carregamento das requisições                  |
| Animações            | Framer Motion em todos os elementos interativos                           |
| Toasts               | Feedback visual ao adicionar ao carrinho e ao confirmar pedido            |

---

## Estrutura do Projeto

```
front-end-sulcos-cosmicos/
├── public/
│   └── vinyl-icon.svg
├── src/
│   ├── assets/              Imagens e logotipos da marca
│   ├── components/
│   │   ├── CartDrawer.jsx   Drawer lateral do carrinho
│   │   ├── DiscCard.jsx     Card de disco com hover e animações
│   │   ├── Feedback.jsx     Componente de feedback (erro/sucesso)
│   │   ├── Navbar.jsx       Barra de navegação
│   │   ├── SkeletonCard.jsx Placeholder de carregamento
│   │   └── VinylDisc.jsx    Componente de disco animado
│   ├── context/
│   │   └── CartContext.jsx  Estado global do carrinho (React Context API)
│   ├── hooks/
│   │   └── useOrders.js     Custom hook para gerenciamento de pedidos
│   ├── pages/
│   │   ├── Home.jsx         Catálogo (GET álbuns via iTunes API)
│   │   ├── DiscDetail.jsx   Detalhe do disco (GET álbum por ID)
│   │   ├── Cart.jsx         Checkout (POST pedido ao back-end)
│   │   └── OrderHistory.jsx Histórico (GET/PUT/DELETE pedidos no back-end)
│   ├── services/
│   │   ├── storeApi.js      Consultas à iTunes Search API
│   │   ├── ordersService.js CRUD de pedidos via API REST
│   │   └── api.js           Cliente HTTP base
│   ├── utils/
│   │   └── transform.js     Transformação iTunes API para modelo interno
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yml
├── nginx.conf
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Pré-requisitos

- **Node.js** >= 22 e **npm** >= 10, ou
- **Docker** e **Docker Compose** para execução conteinerizada

---

## Execução local (desenvolvimento)

```bash
# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em: **http://localhost:5173**

---

## Build de produção

```bash
npm run build
npm run preview
```

---

## Execução com Docker (recomendado)

```bash
# Constrói a imagem e sobe o container
docker compose up --build

# Em segundo plano
docker compose up --build -d

# Encerrar o container
docker compose down
```

Acesse em: **http://localhost:3000**

---

## API Externa: iTunes Search API

O catálogo de álbuns da loja é fornecido pela **iTunes Search API**, uma API pública disponibilizada pela Apple.

| Item | Detalhe |
|---|---|
| Provedor | Apple Inc. |
| Licença | Uso gratuito conforme os [Termos de Serviço da Apple](https://www.apple.com/legal/internet-services/itunes/br/terms.html) |
| Cadastro | Não é necessário |
| Autenticação | Não é necessária |
| Documentação oficial | https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/ |

### Rotas utilizadas

**`GET https://itunes.apple.com/search`**

Busca álbuns por termo (nome do artista). Utilizada para compor o catálogo da loja.

Parâmetros enviados:
- `term` — nome do artista (ex: `Pink Floyd`)
- `media=music` — restringe a conteúdo musical
- `entity=album` — retorna apenas álbuns completos
- `limit` — número máximo de resultados por consulta

Exemplo:
```
GET https://itunes.apple.com/search?term=Pink+Floyd&media=music&entity=album&limit=4
```

**`GET https://itunes.apple.com/lookup`**

Busca um álbum específico pelo seu identificador único (`collectionId`). Utilizada na página de detalhe do disco.

Parâmetros enviados:
- `id` — `collectionId` do álbum
- `entity=album`

Exemplo:
```
GET https://itunes.apple.com/lookup?id=1065973975&entity=album
```

Os dados retornados pela API são transformados pelo módulo `src/utils/transform.js` antes de serem exibidos na interface, sem nenhum redirecionamento para serviços externos.

---

## Integração com a API externa (iTunes Search API)

O arquivo `src/services/storeApi.js` centraliza todas as chamadas à iTunes Search API. Os termos de busca são predefinidos com artistas como Pink Floyd, David Bowie e Miles Davis, e as consultas são feitas em paralelo via `Promise.all`. Os resultados são deduplicados por `collectionId` antes de compor o catálogo final da loja.

O arquivo `src/utils/transform.js` converte os campos retornados pela API (`collectionId`, `artistName`, `collectionName`, `artworkUrl100`, `primaryGenreName`, `releaseDate`) para o modelo interno utilizado pelos componentes React, com o mapeamento de gêneros e o cálculo de preço e raridade.

---

## Autor

**Lucas Salles** — PUC-Rio, Pós-Graduação em Desenvolvimento Full Stack, Sprint 2
