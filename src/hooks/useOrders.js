/**
 * useOrders.js
 * ---------------------------------------------------------------------------
 * Hook reutilizável que encapsula todo o estado e operações de pedidos.
 *
 * Responsabilidades:
 *   - Buscar pedidos ao montar (GET /orders)
 *   - Criar pedido a partir do carrinho (POST /orders)
 *   - Atualizar status de um pedido (PUT /orders/{id})
 *   - Deletar um pedido (DELETE /orders/{id})
 *   - Gerenciar loading, error e success de forma granular
 *
 * Os componentes importam este hook e ficam totalmente desacoplados
 * da camada de serviços e de chamadas fetch diretas.
 * ---------------------------------------------------------------------------
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchOrders,
  submitOrder,
  changeOrderStatus,
  removeOrder,
} from '../services/ordersService';

export function useOrders() {
  // ── Estado principal ──────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);

  // loading granular: 'list' | 'create' | `update-${id}` | `delete-${id}` | null
  const [loadingState, setLoadingState] = useState(null);

  // erro e sucesso exibidos pelo componente de feedback
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  // ── Utilitário: limpa mensagens após 4 s ──────────────────────────────────
  const clearFeedback = useCallback(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // ── Derivados convenientes ────────────────────────────────────────────────
  const isLoading      = loadingState !== null;
  const isCreating     = loadingState === 'create';
  const isListLoading  = loadingState === 'list';
  const isUpdating     = (id) => loadingState === `update-${id}`;
  const isDeleting     = (id) => loadingState === `delete-${id}`;

  // ── GET /orders ───────────────────────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    setLoadingState('list');
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os pedidos.');
      clearFeedback();
    } finally {
      setLoadingState(null);
    }
  }, [clearFeedback]);

  // Busca automática ao montar o hook
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ── POST /orders ──────────────────────────────────────────────────────────
  /**
   * Cria um pedido a partir dos itens do CartContext.
   * Mapeia o formato interno do carrinho → formato da API.
   *
   * @param {Array}  cartItems  - itens do carrinho: [{id, album, price, quantity, ...}]
   * @param {Function} [onSuccess] - callback chamado com o pedido criado
   */
  const handleCreateOrder = async (cartItems, onSuccess) => {
    if (!cartItems?.length) return;

    setLoadingState('create');
    setError(null);
    setSuccess(null);

    try {
      const newOrder = await submitOrder(cartItems);

      // Otimistic UI: insere o pedido no topo da lista sem refetch
      setOrders((prev) => [newOrder, ...prev]);
      setSuccess(`Pedido #${newOrder.id} confirmado! 🎶`);
      clearFeedback();

      if (typeof onSuccess === 'function') onSuccess(newOrder);
    } catch (err) {
      setError(err.message || 'Falha ao criar pedido. Verifique se o servidor está rodando.');
      clearFeedback();
    } finally {
      setLoadingState(null);
    }
  };

  // ── PUT /orders/{id} ──────────────────────────────────────────────────────
  /**
   * Atualiza o status de um pedido existente.
   * Faz update otimista local sem precisar de refetch.
   *
   * @param {number} id
   * @param {'pending'|'shipped'|'delivered'} status
   */
  const handleUpdateOrder = async (id, status) => {
    setLoadingState(`update-${id}`);
    setError(null);
    setSuccess(null);

    try {
      await changeOrderStatus(id, status);

      // Atualiza localmente para resposta imediata na UI
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      );
      setSuccess('Status atualizado com sucesso! ✅');
      clearFeedback();
    } catch (err) {
      setError(err.message || 'Falha ao atualizar o status do pedido.');
      clearFeedback();
    } finally {
      setLoadingState(null);
    }
  };

  // ── DELETE /orders/{id} ───────────────────────────────────────────────────
  /**
   * Remove um pedido com animação de saída (aguarda 350 ms antes de
   * retirar do estado para a AnimatePresence ter tempo de animar).
   *
   * @param {number} id
   */
  const handleDeleteOrder = async (id) => {
    setLoadingState(`delete-${id}`);
    setError(null);
    setSuccess(null);

    try {
      await removeOrder(id);

      // Pequeno delay para animação de saída (AnimatePresence)
      setTimeout(() => {
        setOrders((prev) => prev.filter((order) => order.id !== id));
        setLoadingState(null);
        setSuccess('Pedido removido com sucesso. 🗑️');
        clearFeedback();
      }, 350);
    } catch (err) {
      setLoadingState(null);
      setError(err.message || 'Falha ao excluir o pedido.');
      clearFeedback();
    }
  };

  return {
    // Estado
    orders,
    error,
    success,

    // Flags de loading
    isLoading,
    isCreating,
    isListLoading,
    isUpdating,   // função: isUpdating(id) → boolean
    isDeleting,   // função: isDeleting(id) → boolean

    // Ações
    loadOrders,
    handleCreateOrder,
    handleUpdateOrder,
    handleDeleteOrder,
  };
}
