/**
 * api.js — Cliente HTTP centralizado para o back-end Sulco Cósmico (FastAPI)
 * Base URL: http://localhost:8000
 *
 * Rotas implementadas:
 *   GET    /orders          → listar pedidos
 *   POST   /orders          → criar pedido
 *   PUT    /orders/{id}     → atualizar status do pedido
 *   DELETE /orders/{id}     → remover pedido
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Helpers internos ─────────────────────────────────────────────────────────

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.detail || errorBody.message || errorMessage;
    } catch {
      // mantém mensagem padrão
    }
    throw new Error(errorMessage);
  }

  // DELETE retorna 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

// ─── Orders API ───────────────────────────────────────────────────────────────

/**
 * GET /orders
 * Retorna a lista de todos os pedidos.
 * @returns {Promise<Order[]>}
 */
export async function getOrders() {
  return request('/orders');
}

/**
 * POST /orders
 * Cria um novo pedido.
 * @param {Object} payload - { items: [{productId, name, price}], total: number }
 * @returns {Promise<Order>}
 */
export async function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /orders/{id}
 * Atualiza o status de um pedido existente.
 * @param {number} id - ID do pedido
 * @param {string} status - "pending" | "shipped" | "delivered"
 * @returns {Promise<Order>}
 */
export async function updateOrderStatus(id, status) {
  return request(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

/**
 * DELETE /orders/{id}
 * Remove um pedido.
 * @param {number} id - ID do pedido
 * @returns {Promise<null>}
 */
export async function deleteOrder(id) {
  return request(`/orders/${id}`, {
    method: 'DELETE',
  });
}
