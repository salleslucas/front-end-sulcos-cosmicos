import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchOrders, changeOrderStatus, removeOrder } from '../services/ordersService';
import VinylDisc from '../components/VinylDisc';
import toast from 'react-hot-toast';

// Apenas os status suportados pela API FastAPI
const STATUS_LABELS = {
  pending:   { label: 'Pendente',  color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  shipped:   { label: 'Enviado',   color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
  delivered: { label: 'Entregue', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
};

const STATUS_FLOW = ['pending', 'shipped', 'delivered'];

export default function OrderHistory() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [updatingId, setUpdatingId] = useState(null); // id em loading de PUT
  const [deletingId, setDeletingId] = useState(null); // id em loading de DELETE

  // GET /orders — busca do back-end real
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os pedidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // PUT /orders/{id} — atualizar status
  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await changeOrderStatus(id, status);
      // Atualiza localmente sem refetch completo
      setOrders(prev =>
        prev.map(o => o.id === id ? { ...o, status } : o)
      );
      toast.success(`Status → "${STATUS_LABELS[status]?.label}"`, { icon: '✅' });
    } catch (err) {
      toast.error(err.message || 'Falha ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  };

  // DELETE /orders/{id} — remover pedido
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await removeOrder(id);
      // Pequeno delay para a animação de saída
      setTimeout(() => {
        setOrders(prev => prev.filter(o => o.id !== id));
        if (expanded === id) setExpanded(null);
        setDeletingId(null);
        toast.success('Pedido removido', { icon: '🗑️' });
      }, 350);
    } catch (err) {
      setDeletingId(null);
      toast.error(err.message || 'Falha ao excluir pedido');
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-cosmic-cream">
            Histórico de Pedidos
          </h1>
          <p className="text-cosmic-muted text-sm mt-1">
            {loading ? 'Carregando...' : `${orders.length} pedido${orders.length !== 1 ? 's' : ''} registrado${orders.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="btn-ghost py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-40"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Atualizar
        </button>
      </div>

      {/* Erro de conexão */}
      {error && (
        <div className="glass-card p-5 mb-6 flex items-start gap-3 border-red-500/20">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p className="text-red-400 font-semibold text-sm">Erro ao carregar pedidos</p>
            <p className="text-cosmic-muted text-xs mt-1">{error}</p>
            <button onClick={loadOrders} className="text-xs text-cosmic-purple underline mt-2">Tentar novamente</button>
          </div>
        </div>
      )}

      {/* Skeleton loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2].map(j => (
                    <div key={j} className="w-10 h-10 rounded-full bg-white/5 border-2 border-cosmic-dark" />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-white/8 rounded-full w-32 mb-2" />
                  <div className="h-3 bg-white/5 rounded-full w-24" />
                </div>
                <div className="h-6 bg-white/5 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista vazia */}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <VinylDisc size={100} />
          <h2 className="font-display font-bold text-xl text-cosmic-cream">
            Nenhum pedido ainda
          </h2>
          <p className="text-cosmic-muted">Seus pedidos aparecerão aqui após a compra.</p>
        </div>
      )}

      {/* Lista de pedidos */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence>
            {orders.map(order => {
              const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
              const currentStep = STATUS_FLOW.indexOf(order.status);
              const isUpdating = updatingId === order.id;
              const isDeleting = deletingId === order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isDeleting ? 0 : 1,
                    y: 0,
                    scale: isDeleting ? 0.97 : 1,
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card overflow-hidden"
                >
                  {/* Header do pedido */}
                  <div
                    className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        {/* Ícones dos itens */}
                        <div className="flex -space-x-2">
                          {(order.items || []).slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-10 h-10 rounded-full border-2 border-cosmic-dark bg-cosmic-black flex items-center justify-center flex-shrink-0 overflow-hidden"
                            >
                              {item.cover ? (
                                <img src={item.cover} alt={item.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                <span className="text-lg">🎵</span>
                              )}
                            </div>
                          ))}
                          {(order.items || []).length > 3 && (
                            <div className="w-10 h-10 rounded-full border-2 border-cosmic-dark bg-cosmic-card flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-cosmic-muted">+{order.items.length - 3}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-cosmic-cream font-semibold">Pedido #{order.id}</p>
                          <p className="text-cosmic-muted text-xs">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs font-mono border px-3 py-1 rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-cosmic-gold font-mono font-bold">
                          R$ {Number(order.total).toFixed(2)}
                        </span>
                        <motion.svg
                          className="w-4 h-4 text-cosmic-muted"
                          animate={{ rotate: expanded === order.id ? 180 : 0 }}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </motion.svg>
                      </div>
                    </div>

                    {/* Progress bar de status */}
                    <div className="mt-4">
                      <div className="flex items-center">
                        {STATUS_FLOW.map((s, i) => (
                          <div key={s} className="flex items-center flex-1">
                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-500 ${
                              i <= currentStep ? 'bg-cosmic-purple shadow-[0_0_6px_rgba(108,63,197,0.8)]' : 'bg-white/10'
                            }`} />
                            {i < STATUS_FLOW.length - 1 && (
                              <div className={`h-px flex-1 transition-all duration-500 ${
                                i < currentStep ? 'bg-cosmic-purple' : 'bg-white/10'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1.5">
                        {STATUS_FLOW.map((s, i) => (
                          <span key={s} className={`text-[10px] font-mono transition-colors ${
                            i <= currentStep ? 'text-cosmic-purple' : 'text-white/20'
                          }`}>
                            {STATUS_LABELS[s].label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  <AnimatePresence>
                    {expanded === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-white/5 overflow-hidden"
                      >
                        <div className="p-5 space-y-5">
                          {/* Itens do pedido */}
                          <div className="space-y-2">
                            <p className="text-cosmic-muted text-xs font-mono uppercase tracking-widest mb-3">Itens</p>
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <div className="w-10 h-10 bg-cosmic-black rounded-lg flex items-center justify-center flex-shrink-0 border border-white/5">
                                  {item.cover
                                    ? <img src={item.cover} alt={item.name} className="w-full h-full object-contain p-1" />
                                    : <span className="text-lg">🎵</span>
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-cosmic-cream truncate">{item.name}</p>
                                  <p className="text-cosmic-muted text-xs font-mono">ID #{item.productId}</p>
                                </div>
                                <span className="text-cosmic-gold font-mono text-sm">
                                  R$ {Number(item.price).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Ações — PUT e DELETE */}
                          <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
                            <span className="text-cosmic-muted text-xs self-center mr-1">
                              {isUpdating ? 'Atualizando...' : 'Atualizar status:'}
                            </span>

                            {/* Botões PUT — apenas status diferentes do atual */}
                            {Object.entries(STATUS_LABELS)
                              .filter(([s]) => s !== order.status)
                              .map(([s, info]) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusUpdate(order.id, s)}
                                  disabled={isUpdating}
                                  className={`text-xs border px-3 py-1.5 rounded-full transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ${info.color}`}
                                >
                                  {info.label}
                                </button>
                              ))
                            }

                            {/* Botão DELETE */}
                            <button
                              onClick={() => handleDelete(order.id)}
                              disabled={isDeleting || isUpdating}
                              className="ml-auto text-xs border border-red-400/30 text-red-400 bg-red-400/5 hover:bg-red-400/15 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? (
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                              )}
                              Excluir
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}