/**
 * storeApi.js
 * ---------------------------------------------------------------------------
 * Camada de acesso ao catálogo de produtos via iTunes Search API (Apple).
 *
 * A iTunes Search API é uma API pública, gratuita e sem necessidade de
 * autenticação. Neste projeto ela é utilizada como componente externo
 * responsável por fornecer o catálogo de álbuns musicais — substituindo
 * a FakeStore API, cujos dados não tinham relação com o domínio de vinis.
 *
 * Documentação oficial: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
 *
 * Cada registro retornado pela API contém:
 *   collectionId     → identificador único do álbum (usado como productId)
 *   artistName       → nome do artista
 *   collectionName   → nome do álbum
 *   artworkUrl100    → capa do álbum em 100×100 px (substituída por 600×600)
 *   primaryGenreName → gênero musical principal
 *   releaseDate      → data de lançamento
 *   collectionPrice  → preço sugerido (usado como base de precificação)
 *   trackCount       → número de faixas
 * ---------------------------------------------------------------------------
 */

// Termos de busca que compõem o catálogo da loja.
// Cada termo gera até `LIMIT` resultados; a união forma o catálogo completo.
const SEARCH_TERMS = [
  'Pink Floyd',
  'David Bowie',
  'Miles Davis',
  'Radiohead',
  'Tame Impala',
  'Amy Winehouse',
  'The Beatles',
  'Daft Punk',
];

// Número máximo de álbuns retornados por consulta
const LIMIT = 4;

// URL base da iTunes Search API
// Em desenvolvimento o Vite proxy redireciona /itunes → https://itunes.apple.com
// Em produção (Nginx) o proxy também é configurado via nginx.conf
const ITUNES_BASE = import.meta.env.DEV
  ? '/itunes/search'
  : '/itunes/search';

/**
 * Busca álbuns de um artista/termo na iTunes Search API.
 *
 * @param {string} term - Termo de busca (nome do artista ou álbum)
 * @param {number} limit - Número máximo de resultados
 * @returns {Promise<Array>} Lista de objetos de álbum retornados pela API
 */
async function searchAlbums(term, limit = LIMIT) {
  const params = new URLSearchParams({
    term,
    media: 'music',       // somente conteúdo musical
    entity: 'album',      // somente álbuns (não faixas individuais)
    limit: String(limit),
  });

  const res = await fetch(`${ITUNES_BASE}?${params}`);
  if (!res.ok) throw new Error(`Falha ao buscar "${term}" na iTunes API`);

  const json = await res.json();
  // Filtra apenas registros do tipo "collection" (álbuns completos)
  return json.results.filter(r => r.wrapperType === 'collection');
}

/**
 * Busca e agrega o catálogo completo de álbuns a partir dos termos definidos
 * em SEARCH_TERMS. Consultas são realizadas em paralelo para minimizar
 * a latência total (Promise.all).
 *
 * Duplicatas são removidas pelo collectionId para garantir que um mesmo
 * álbum não apareça duas vezes caso distintos termos retornem o mesmo resultado.
 *
 * @returns {Promise<Array>} Lista deduplicada de álbuns
 */
export async function fetchProducts() {
  const results = await Promise.all(
    SEARCH_TERMS.map(term => searchAlbums(term))
  );

  // Achata o array de arrays e remove duplicatas por collectionId
  const flat = results.flat();
  const seen = new Set();
  return flat.filter(album => {
    if (seen.has(album.collectionId)) return false;
    seen.add(album.collectionId);
    return true;
  });
}

/**
 * Busca um álbum específico pelo seu collectionId na iTunes Lookup API.
 *
 * A iTunes Lookup API permite recuperar um item pelo seu identificador único,
 * retornando os mesmos campos da Search API.
 *
 * @param {string|number} id - collectionId do álbum
 * @returns {Promise<Object>} Objeto do álbum
 */
export async function fetchProduct(id) {
  const params = new URLSearchParams({
    id: String(id),
    entity: 'album',
  });

  const res = await fetch(`/itunes/lookup?${params}`);
  if (!res.ok) throw new Error('Álbum não encontrado');

  const json = await res.json();
  const album = json.results.find(r => r.wrapperType === 'collection');
  if (!album) throw new Error('Álbum não encontrado');
  return album;
}

/**
 * Retorna a lista de gêneros únicos presentes no catálogo atual.
 * Gerada dinamicamente a partir dos dados da API (não é um endpoint separado).
 *
 * @returns {Promise<string[]>} Lista de strings de gênero
 */
export async function fetchCategories() {
  const products = await fetchProducts();
  const genres = [...new Set(products.map(p => p.primaryGenreName).filter(Boolean))];
  return genres;
}

/**
 * Filtra o catálogo pelo gênero musical informado.
 *
 * @param {string} category - Nome do gênero (primaryGenreName)
 * @returns {Promise<Array>} Álbuns do gênero especificado
 */
export async function fetchProductsByCategory(category) {
  const products = await fetchProducts();
  return products.filter(p => p.primaryGenreName === category);
}
