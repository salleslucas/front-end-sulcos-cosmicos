// Mapeamento temático: transforma dados genéricos da Fake Store em vinil
const GENRE_MAP = {
  "electronics":        "Eletrônica / Synth",
  "jewelery":           "Jazz / Soul",
  "men's clothing":     "Rock Clássico",
  "women's clothing":   "R&B / Indie Pop",
};

const ARTIST_PREFIXES = [
  "The Cosmic", "Nova", "Stellar", "Deep", "Orbital",
  "Lunar", "Astral", "Velvet", "Eclipse", "Dark Matter",
];

const ALBUM_SUFFIXES = [
  "Sessions", "Chronicles", "Frequencies", "Transmission",
  "Void", "Odyssey", "Spectrum", "Resonance", "Archive",
];

// Gera nome de álbum/artista a partir do título original
export function transformProduct(product) {
  const words = product.title.split(" ");
  const seed = product.id % ARTIST_PREFIXES.length;
  const seedB = (product.id * 3) % ALBUM_SUFFIXES.length;

  const artist = `${ARTIST_PREFIXES[seed]} ${words[0]}`;
  const album = `${words.slice(1, 3).join(" ")} ${ALBUM_SUFFIXES[seedB]}`;

  return {
    id: product.id,
    artist,
    album: album.trim() || product.title,
    genre: GENRE_MAP[product.category] || "World / Ambient",
    cover: product.image,
    price: product.price,
    originalTitle: product.title,
    category: product.category,
    description: product.description,
    rating: product.rating,
    // "raridade" fake baseada no rating
    rarity: product.rating?.rate >= 4.5 ? "Prensagem Limitada" :
            product.rating?.rate >= 4.0 ? "1ª Edição" :
            product.rating?.rate >= 3.5 ? "Reedição" : "Comum",
  };
}

export function transformProducts(products) {
  return products.map(transformProduct);
}
