const BASE_URL = 'https://fakestoreapi.com';

// GET — listar todos os produtos
export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error('Falha ao carregar produtos');
  return res.json();
}

// GET — buscar produto por id
export async function fetchProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Produto não encontrado');
  return res.json();
}

// GET — listar categorias
export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error('Falha ao carregar categorias');
  return res.json();
}

// GET — produtos por categoria
export async function fetchProductsByCategory(category) {
  const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error('Falha ao carregar categoria');
  return res.json();
}
