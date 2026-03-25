import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import VinylDisc from '../components/VinylDisc';
import Feedback from '../components/Feedback';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '' });

  // Hook reutilizável — encapsula estado e chamadas ao back-end FastAPI
  const { isCreating, error, success, handleCreateOrder } = useOrders();

  // POST /orders — envia pedido ao back-end FastAPI
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    await handleCreateOrder(items, (order) => {
      // Callback executado apenas em caso de sucesso
      clearCart();
      toast.success(`Pedido #${order.id} confirmado! 🎶`, { duration: 4000 });
      navigate('/historico');
    });
  };

  if (items.length === 0 && !isCreating) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <VinylDisc size={120} />
          <h2 className="font-display font-bold text-2xl text-cosmic-cream">
            Sua vitrola está vazia
          </h2>
          <p className="text-cosmic-muted">Adicione discos ao carrinho para continuar.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Explorar Catálogo
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display font-black text-3xl text-cosmic-cream mb-8">
        🛒 Finalizar Pedido
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Lista de itens */}
        <div className="lg:col-span-3 space-y-3">
          <h2 className="text-cosmic-muted font-mono text-xs uppercase tracking-widest mb-4">
            Itens no carrinho ({items.length})
          </h2>

          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 flex gap-4"
              >
                {/* Imagem com disco girando no hover */}
                <div className="relative w-20 h-20 flex-shrink-0 group">
                  <img
                    src={item.cover}
                    alt={item.album}
                    className="w-full h-full object-contain bg-cosmic-black rounded-xl p-2 border border-white/5"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <VinylDisc size={60} spinning />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-cosmic-cream font-semibold truncate">{item.album}</p>
                  <p className="text-cosmic-muted text-sm truncate">{item.artist}</p>
                  <p className="text-xs text-cosmic-purple font-mono mt-1">{item.genre}</p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-cosmic-gold font-mono font-bold">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 bg-cosmic-black rounded-xl border border-white/10 px-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 text-cosmic-muted hover:text-cosmic-cream transition-colors text-sm"
                    >−</button>
                    <span className="text-cosmic-cream font-mono text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 text-cosmic-muted hover:text-cosmic-cream transition-colors text-sm"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-cosmic-muted hover:text-red-400 transition-colors"
                  >
                    remover
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Formulário e resumo */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 sticky top-20">
            <h2 className="text-cosmic-muted font-mono text-xs uppercase tracking-widest mb-5">
              Dados de entrega
            </h2>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="text-cosmic-muted text-xs block mb-1.5">Nome completo</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Seu nome"
                  className="w-full bg-cosmic-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-cosmic-cream placeholder-cosmic-muted focus:outline-none focus:border-cosmic-purple/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-cosmic-muted text-xs block mb-1.5">E-mail</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="seu@email.com"
                  className="w-full bg-cosmic-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-cosmic-cream placeholder-cosmic-muted focus:outline-none focus:border-cosmic-purple/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-cosmic-muted text-xs block mb-1.5">Endereço</label>
                <textarea
                  required
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Rua, número, cidade..."
                  rows={2}
                  className="w-full bg-cosmic-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-cosmic-cream placeholder-cosmic-muted focus:outline-none focus:border-cosmic-purple/50 transition-colors resize-none"
                />
              </div>

              {/* Feedback de erro / sucesso via hook */}
              <Feedback error={error} success={success} />

              {/* Resumo */}
              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cosmic-muted">Subtotal</span>
                  <span className="text-cosmic-cream font-mono">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cosmic-muted">Frete</span>
                  <span className="text-green-400 font-mono">Grátis</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-cosmic-cream">Total</span>
                  <span className="text-cosmic-gold font-mono text-lg">R$ {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isCreating}
                className="btn-primary w-full flex items-center justify-center gap-3"
                whileTap={{ scale: 0.97 }}
              >
                {isCreating ? (
                  <>
                    <VinylDisc size={20} spinning />
                    Processando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    Confirmar Pedido
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
