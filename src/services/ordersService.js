/**
 * ordersService.js
 * Camada de serviço para pedidos.
 * Toda a lógica de persistência vai para o back-end FastAPI via api.js.
 * Os componentes importam daqui — nunca importam api.js diretamente.
 */

import {
  getOrders as apiGetOrders,
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  deleteOrder as apiDeleteOrder,
} from './api';

/**
 * GET /orders — buscar todos os pedidos
 * @returns {Promise<Order[]>}
 */
export async function fetchOrders() {
  return apiGetOrders();
}

/**
 * POST /orders — criar pedido a partir dos itens do carrinho
 * Mapeia o formato interno do carrinho para o formato esperado pela API.
 *
 * Formato do carrinho: [{ id, album, artist, price, quantity, ... }]
 * Formato da API:      { items: [{ productId, name, price }], total }
 *
 * @param {Array} cartItems - itens do contexto do carrinho
 * @returns {Promise<Order>}
 */
export async function submitOrder(cartItems) {
  const items = cartItems.map(item => ({
    productId: item.id,
    name: item.album,
    price: +item.price.toFixed(2),
  }));

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return apiCreateOrder({ items, total: +total.toFixed(2) });
}

/**
 * PUT /orders/{id} — atualizar status de um pedido
 * @param {number} id
 * @param {'pending'|'shipped'|'delivered'} status
 * @returns {Promise<Order>}
 */
export async function changeOrderStatus(id, status) {
  return apiUpdateOrderStatus(id, status);
}

/**
 * DELETE /orders/{id} — excluir pedido
 * @param {number} id
 * @returns {Promise<null>}
 */
export async function removeOrder(id) {
  return apiDeleteOrder(id);
}
