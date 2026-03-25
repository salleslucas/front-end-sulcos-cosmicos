/**
 * transform.js
 * ---------------------------------------------------------------------------
 * Camada de transformação de dados da iTunes Search API para o modelo de
 * domínio interno da aplicação Sulcos Cósmicos.
 *
 * Esta camada isola o restante da aplicação do contrato específico da API
 * externa. Caso a fonte de dados seja substituída no futuro, apenas este
 * módulo precisa ser alterado — os componentes React e hooks permanecem
 * intactos, pois consomem exclusivamente o modelo interno definido aqui.
 *
 * Modelo interno de um disco (objeto retornado por transformProduct):
 *   id          {number}  - collectionId único do álbum na iTunes API
 *   artist      {string}  - Nome do artista
 *   album       {string}  - Título do álbum
 *   genre       {string}  - Gênero musical (mapeado para categorias da loja)
 *   cover       {string}  - URL da capa do álbum em 600×600 px
 *   price       {number}  - Preço em BRL (calculado a partir do preço em USD)
 *   releaseYear {number}  - Ano de lançamento
 *   trackCount  {number}  - Número de faixas
 *   rarity      {string}  - Classificação de raridade baseada no ano
 *   rating      {object}  - Compatibilidade com o sistema de avaliação anterior
 *   description {string}  - Texto descritivo gerado a partir dos metadados
 * ---------------------------------------------------------------------------
 */

// Taxa de conversão USD → BRL aplicada sobre o collectionPrice da iTunes API.
// O valor é fixo para fins de simulação no contexto acadêmico do projeto.
const USD_TO_BRL = 5.2;

// Margem de revenda aplicada sobre o preço de tabela da iTunes API,
// simulando o custo de importação de um disco de vinil físico.
const MARKUP = 3.5;

// Preço mínimo em BRL para itens sem preço definido na API
const FALLBACK_PRICE_BRL = 89.9;

/**
 * Mapeia os gêneros retornados pela iTunes API para as categorias
 * utilizadas nos filtros da interface da loja.
 *
 * Gêneros não mapeados explicitamente recebem a categoria "World / Ambient".
 */
const GENRE_MAP = {
  'Rock':              'Rock Clássico',
  'Alternative':       'Rock Clássico',
  'Punk':              'Rock Clássico',
  'Metal':             'Rock Clássico',
  'Jazz':              'Jazz / Soul',
  'Soul':              'Jazz / Soul',
  'Blues':             'Jazz / Soul',
  'R&B/Soul':          'R&B / Indie Pop',
  'Pop':               'R&B / Indie Pop',
  'Indie Pop':         'R&B / Indie Pop',
  'Electronic':        'Eletrônica / Synth',
  'Dance':             'Eletrônica / Synth',
  'Electronica':       'Eletrônica / Synth',
  'Hip-Hop/Rap':       'Hip-Hop',
  'Rap':               'Hip-Hop',
  'Classical':         'World / Ambient',
  'World':             'World / Ambient',
  'Ambient':           'World / Ambient',
  'Reggae':            'World / Ambient',
  'Funk':              'R&B / Indie Pop',
};

/**
 * Determina a classificação de raridade do disco com base no ano de
 * lançamento. Álbuns mais antigos tendem a ser mais raros e valiosos
 * no mercado de vinis, o que justifica esta heurística.
 *
 * @param {number} year - Ano de lançamento do álbum
 * @returns {string} Classificação de raridade
 */
function getRarity(year) {
  if (year <= 1975) return 'Prensagem Limitada';
  if (year <= 1990) return '1ª Edição';
  if (year <= 2005) return 'Reedição';
  return 'Comum';
}

/**
 * Converte um objeto de álbum retornado pela iTunes Search/Lookup API
 * para o modelo de domínio interno da aplicação.
 *
 * A URL da capa é redimensionada de 100×100 para 600×600 substituindo
 * o sufixo da URL, conforme documentado pela Apple.
 *
 * @param {Object} album - Objeto bruto retornado pela iTunes API
 * @returns {Object} Disco no formato interno da aplicação
 */
export function transformProduct(album) {
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : null;

  // Preço: collectionPrice (USD) × markup × taxa de câmbio,
  // ou valor de fallback caso o álbum não tenha preço definido na API
  const rawPrice = album.collectionPrice && album.collectionPrice > 0
    ? album.collectionPrice * MARKUP * USD_TO_BRL
    : FALLBACK_PRICE_BRL;
  const price = Math.round(rawPrice / 0.1) * 0.1; // arredonda para R$ 0,10

  // Capa em alta resolução: substitui "100x100bb" por "600x600bb" na URL
  const cover = album.artworkUrl100
    ? album.artworkUrl100.replace('100x100bb', '600x600bb')
    : null;

  const genreRaw = album.primaryGenreName || '';
  const genre = GENRE_MAP[genreRaw] || 'World / Ambient';

  const rarity = releaseYear ? getRarity(releaseYear) : 'Comum';

  // Rating sintético para compatibilidade com o sistema de ordenação
  // existente na interface; baseado na raridade do disco
  const ratingValue = {
    'Prensagem Limitada': 4.8,
    '1ª Edição':          4.3,
    'Reedição':           3.8,
    'Comum':              3.2,
  }[rarity];

  const description = [
    album.artistName,
    releaseYear ? `Lançado em ${releaseYear}` : null,
    album.trackCount ? `${album.trackCount} faixas` : null,
    album.country ? `Origem: ${album.country}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return {
    id: album.collectionId,
    artist: album.artistName || 'Artista Desconhecido',
    album: album.collectionName || 'Álbum sem título',
    genre,
    cover,
    price,
    releaseYear,
    trackCount: album.trackCount || null,
    rarity,
    rating: { rate: ratingValue, count: Math.floor(Math.random() * 300) + 50 },
    description,
    // Campos mantidos por compatibilidade com DiscDetail e CartDrawer
    originalTitle: album.collectionName,
    category: genreRaw,
  };
}

/**
 * Converte uma lista de objetos brutos da iTunes API para o modelo interno.
 *
 * @param {Array} albums - Lista de álbuns retornados pela iTunes API
 * @returns {Array} Lista de discos no formato interno da aplicação
 */
export function transformProducts(albums) {
  return albums.map(transformProduct);
}
