import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/carrinho');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cosmic-dark border-l border-white/5 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-display font-bold text-xl text-cosmic-cream">
                🎵 Sua Vitrola
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-cosmic-muted hover:text-cosmic-cream transition-colors p-2 rounded-xl hover:bg-white/5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="text-6xl">🎶</div>
                  <p className="text-cosmic-muted font-body">
                    Sua vitrola está vazia.<br/>
                    <span className="text-cosmic-cream">Descubra um disco!</span>
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-card p-3 flex gap-3"
                    >
                      <img
                        src={item.cover}
                        alt={item.album}
                        className="w-16 h-16 object-contain bg-cosmic-black rounded-lg p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-cosmic-cream font-semibold text-sm truncate">{item.album}</p>
                        <p className="text-cosmic-muted text-xs truncate">{item.artist}</p>
                        <p className="text-cosmic-gold font-mono text-sm mt-1">
                          R$ {(item.price * 5.2).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-cosmic-muted hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-sm flex items-center justify-center transition-colors"
                          >−</button>
                          <span className="text-cosmic-cream font-mono text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-sm flex items-center justify-center transition-colors"
                          >+</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-muted">Total</span>
                  <span className="text-cosmic-gold font-mono font-bold text-xl">
                    R$ {(totalPrice * 5.2).toFixed(2)}
                  </span>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full text-center">
                  Finalizar Pedido
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-cosmic-muted text-sm hover:text-red-400 transition-colors"
                >
                  Limpar carrinho
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
