import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProduct } from '../services/storeApi';
import { transformProduct } from '../utils/transform';
import { useCart } from '../context/CartContext';
import VinylDisc from '../components/VinylDisc';
import SkeletonCard from '../components/SkeletonCard';

const RARITY_COLORS = {
  'Prensagem Limitada': 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  '1ª Edição':          'text-purple-400 border-purple-400/40 bg-purple-400/10',
  'Reedição':           'text-blue-400 border-blue-400/40 bg-blue-400/10',
  'Comum':              'text-gray-400 border-gray-400/20 bg-gray-400/5',
};

export default function DiscDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [disc, setDisc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then(data => {
        setDisc(transformProduct(data));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {[80, 60, 40, 90, 50].map((w, i) => (
              <div key={i} className={`h-4 bg-white/5 rounded-full animate-pulse`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !disc) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">⚠️ {error || 'Disco não encontrado'}</p>
        <Link to="/" className="btn-primary">← Voltar ao catálogo</Link>
      </div>
    );
  }

  const priceInBRL = (disc.price * 5.2).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-cosmic-muted mb-8">
        <Link to="/" className="hover:text-cosmic-cream transition-colors">Catálogo</Link>
        <span>/</span>
        <span className="text-cosmic-cream truncate">{disc.album}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Lado esquerdo — visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Capa */}
          <div className="relative w-full max-w-sm">
            <div className="aspect-square rounded-2xl overflow-hidden bg-cosmic-dark border border-white/5 relative group">
              <img
                src={disc.cover}
                alt={disc.album}
                className="w-full h-full object-contain p-8"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/60 to-transparent" />
            </div>

            {/* Disco girando atrás da capa quando "playing" */}
            <motion.div
              className="absolute -right-8 top-1/2 -translate-y-1/2 z-0"
              animate={{ x: playing ? 0 : -20, opacity: playing ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <VinylDisc size={180} spinning={playing} />
            </motion.div>
          </div>

          {/* Botão de preview */}
          <motion.button
            onClick={() => setPlaying(!playing)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${
              playing
                ? 'bg-cosmic-purple border-cosmic-purple text-white'
                : 'border-cosmic-purple/40 text-cosmic-purple hover:bg-cosmic-purple/10'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {playing ? (
              <>
                <motion.div
                  className="flex gap-0.5 items-end h-5"
                  animate={{ scaleY: [1, 1.5, 0.8, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {[1,2,3,4].map(b => (
                    <motion.div
                      key={b}
                      className="w-1 bg-white rounded-full"
                      animate={{ height: ['8px', `${12 + b * 4}px`, '6px', `${14 + b * 2}px`, '8px'] }}
                      transition={{ duration: 0.6 + b * 0.1, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
                Tocando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Colocar na Vitrola
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Lado direito — info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-5"
        >
          {/* Genre + Rarity */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-mono text-cosmic-purple border border-cosmic-purple/30 bg-cosmic-purple/10 px-3 py-1 rounded-full">
              {disc.genre}
            </span>
            <span className={`text-xs font-mono border px-3 py-1 rounded-full ${RARITY_COLORS[disc.rarity]}`}>
              ✦ {disc.rarity}
            </span>
          </div>

          {/* Título */}
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-cosmic-cream leading-tight mb-2">
              {disc.album}
            </h1>
            <p className="text-cosmic-muted text-lg">{disc.artist}</p>
          </div>

          {/* Rating */}
          {disc.rating && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(disc.rating.rate) ? 'text-cosmic-gold' : 'text-white/10'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-cosmic-muted text-sm">
                {disc.rating.rate} — {disc.rating.count} avaliações
              </span>
            </div>
          )}

          {/* Descrição */}
          <p className="text-cosmic-muted text-sm leading-relaxed border-t border-white/5 pt-4">
            {disc.description}
          </p>

          {/* Detalhes técnicos fake */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Formato', value: '12" LP / 33⅓ RPM' },
              { label: 'Prensagem', value: disc.rarity },
              { label: 'Condição', value: 'Novo (Lacrado)' },
              { label: 'Catálogo', value: `SC-${String(disc.id).padStart(4, '0')}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/3 rounded-xl p-3 border border-white/5">
                <p className="text-cosmic-muted text-xs mb-0.5">{label}</p>
                <p className="text-cosmic-cream font-medium text-xs">{value}</p>
              </div>
            ))}
          </div>

          {/* Preço + Comprar */}
          <div className="border-t border-white/5 pt-5">
            <div className="flex items-end gap-2 mb-4">
              <span className="text-cosmic-gold font-mono font-black text-4xl">
                R$ {priceInBRL}
              </span>
              <span className="text-cosmic-muted text-sm mb-1">/ unidade</span>
            </div>

            {/* Quantidade */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-cosmic-muted text-sm">Quantidade:</span>
              <div className="flex items-center gap-2 bg-cosmic-black rounded-xl border border-white/10 px-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 text-cosmic-muted hover:text-cosmic-cream transition-colors"
                >−</button>
                <span className="w-6 text-center text-cosmic-cream font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 text-cosmic-muted hover:text-cosmic-cream transition-colors"
                >+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addItem(disc);
                }}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Adicionar ao Carrinho
              </motion.button>
              <Link to="/" className="btn-ghost py-3 px-4">
                ← Voltar
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
