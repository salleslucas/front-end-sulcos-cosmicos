import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { fetchProducts } from '../services/storeApi';
import { transformProducts } from '../utils/transform';
import DiscCard from '../components/DiscCard';
import SkeletonCard from '../components/SkeletonCard';
import nebulaImg from '../assets/WhatsApp Image 2026-03-15 at 14.34.26.jpeg';
import marcaDaguaImg from "../assets/marca d'agua sulcos cosmicos.png";

const GENRES = ['Todos', 'Eletrônica / Synth', 'Jazz / Soul', 'Rock Clássico', 'R&B / Indie Pop', 'World / Ambient'];
const RARITIES = ['Todas', 'Prensagem Limitada', '1ª Edição', 'Reedição', 'Comum'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Padrão' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'rating', label: 'Mais bem avaliados' },
];

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const [allDiscs, setAllDiscs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState('Todos');
  const [rarity, setRarity] = useState('Todas');
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setAllDiscs(transformProducts(data));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = [...allDiscs];

    if (genre !== 'Todos') result = result.filter(d => d.genre === genre);
    if (rarity !== 'Todas') result = result.filter(d => d.rarity === rarity);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.album.toLowerCase().includes(q) ||
        d.artist.toLowerCase().includes(q) ||
        d.genre.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));

    return result;
  }, [allDiscs, genre, rarity, sortBy, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetPage = () => setPage(1);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      {showHero && (
        <section className="relative overflow-hidden py-10 px-4 text-center flex items-center">
          {/* Background: foto da nebulosa */}
          <div className="absolute inset-0">
            <img
              src={nebulaImg}
              alt=""
              className="w-full h-full object-cover opacity-40"
            />
            {/* Gradiente sobre a foto para escurecer bordas */}
            <div className="absolute inset-0 bg-gradient-to-b from-cosmic-black/60 via-transparent to-cosmic-black" />
            <div className="absolute inset-0 bg-gradient-to-r from-cosmic-black/50 via-transparent to-cosmic-black/50" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10 max-w-3xl mx-auto w-full"
          >
            {/* Logo de marca d'água no hero */}
            <motion.img
              src={marcaDaguaImg}
              alt="Sulcos Cósmicos"
              className="w-90 sm:w-80 mx-auto mb-1 object-contain drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.2 }}
            />

            <p className="text-cosmic-muted font-mono text-xs uppercase tracking-widest mb-4">
              ✦ Descubra o disco pelo sulco ✦
            </p>
            <p className="text-cosmic-cream/80 text-lg max-w-xl mx-auto mb-8">
              Não é só uma loja. É uma experiência de descoberta musical.
              Vinis raros, edições limitadas e clássicos atemporais.
            </p>
            <motion.button
              onClick={() => setShowHero(false)}
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Explorar Catálogo</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </motion.button>
          </motion.div>
        </section>
      )}

      {/* CATÁLOGO */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-cosmic-cream">
            Catálogo
            <span className="text-cosmic-muted text-base font-body font-normal ml-2">
              ({filtered.length} discos)
            </span>
          </h2>
        </div>

        {/* Filtros */}
        <div className="glass-card p-4 mb-6 space-y-4">
          {/* Busca */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmic-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar disco, artista ou gênero..."
              value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}
              className="w-full bg-cosmic-black border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-cosmic-cream placeholder-cosmic-muted focus:outline-none focus:border-cosmic-purple/50 transition-colors"
            />
          </div>

          {/* Filtros em linha */}
          <div className="flex flex-wrap gap-3">
            {/* Gênero */}
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => { setGenre(g); resetPage(); }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    genre === g
                      ? 'bg-cosmic-purple border-cosmic-purple text-white'
                      : 'border-white/10 text-cosmic-muted hover:border-cosmic-purple/40 hover:text-cosmic-cream'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Raridade */}
            <select
              value={rarity}
              onChange={e => { setRarity(e.target.value); resetPage(); }}
              className="bg-cosmic-black border border-white/10 rounded-xl px-3 py-2 text-sm text-cosmic-cream focus:outline-none focus:border-cosmic-purple/50 transition-colors"
            >
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); resetPage(); }}
              className="bg-cosmic-black border border-white/10 rounded-xl px-3 py-2 text-sm text-cosmic-cream focus:outline-none focus:border-cosmic-purple/50 transition-colors"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Reset */}
            {(genre !== 'Todos' || rarity !== 'Todas' || search || sortBy !== 'default') && (
              <button
                onClick={() => { setGenre('Todos'); setRarity('Todas'); setSearch(''); setSortBy('default'); resetPage(); }}
                className="text-xs text-cosmic-muted hover:text-red-400 transition-colors underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">⚠️ {error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Tentar novamente</button>
          </div>
        )}

        {/* Grid de discos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : paginated.map((disc, i) => (
                <motion.div
                  key={disc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <DiscCard disc={disc} />
                </motion.div>
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && paginated.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-cosmic-muted">Nenhum disco encontrado com esses filtros.</p>
          </div>
        )}

        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost py-2 px-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-mono transition-all ${
                  page === i + 1
                    ? 'bg-cosmic-purple text-white'
                    : 'text-cosmic-muted hover:text-cosmic-cream hover:bg-white/5'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost py-2 px-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
