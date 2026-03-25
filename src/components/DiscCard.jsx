import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const RARITY_COLORS = {
  'Prensagem Limitada': 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  '1ª Edição':          'text-purple-400 border-purple-400/40 bg-purple-400/10',
  'Reedição':           'text-blue-400 border-blue-400/40 bg-blue-400/10',
  'Comum':              'text-gray-400 border-gray-400/20 bg-gray-400/5',
};

export default function DiscCard({ disc }) {
  const { addItem } = useCart();

  return (
    <motion.div
      className="glass-card group relative overflow-hidden cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Badge de raridade */}
      <span className={`absolute top-3 right-3 z-10 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${RARITY_COLORS[disc.rarity]}`}>
        {disc.rarity}
      </span>

      {/* Capa do disco */}
      <Link to={`/disco/${disc.id}`}>
        <div className="relative overflow-hidden rounded-t-2xl aspect-square bg-cosmic-dark">
          <img
            src={disc.cover}
            alt={disc.album}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay com efeito de vinil */}
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-card via-transparent to-transparent opacity-60" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-cosmic-muted text-xs font-mono uppercase tracking-widest mb-1">{disc.genre}</p>
        <Link to={`/disco/${disc.id}`}>
          <h3 className="text-cosmic-cream font-display font-bold text-base leading-tight hover:text-cosmic-gold transition-colors line-clamp-2 mb-1">
            {disc.album}
          </h3>
        </Link>
        <p className="text-cosmic-muted text-sm mb-3">{disc.artist}</p>

        {/* Rating */}
        {disc.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-3 h-3 ${s <= Math.round(disc.rating.rate) ? 'text-cosmic-gold' : 'text-white/10'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-cosmic-muted text-xs">({disc.rating.count})</span>
          </div>
        )}

        {/* Preço e botão */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-cosmic-gold font-mono font-bold text-lg">
            R$ {disc.price.toFixed(2)}
          </span>
          <motion.button
            onClick={() => addItem(disc)}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9" strokeWidth="1"/>
              <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2"/>
            </svg>
            Vitrola
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
