import { httpClient } from "./httpClient";

async function request(path, options = {}) {
  const { method = "GET", data, headers = {} } = options;

  const response = await httpClient({
    url: path,
    method,
    data,
    headers,
  });
  return response.data;
}

// No mock handler – require backend to be running

const mapProduct = (product) =>
  product
    ? {
        ...product,
        id: product.productId || product.id,
        productId: product.productId || product.id,
      }
    : product;

export const api = {
  // Products
  getProducts: async () => {
    const products = await request("/api/products");
    // Map productId to id for frontend compatibility, but preserve productId
    return Array.isArray(products) ? products.map(p => ({
      ...p,
      id: p.productId || p.id,
      productId: p.productId || p.id // Ensure productId is always available
    })) : [];
  },
  getProductById: (id) => request(`/api/products/${id}`),

  // Auth
  signIn: async (payload) => request("/api/auth/signin", { method: "POST", data: payload }),
  signUp: async (payload) => request("/api/auth/signup", { method: "POST", data: payload }),

  // Orders
  createOrder: (payload) => request("/api/orders", { method: "POST", data: payload }),

  // Payments removed

  // Google Maps
  getCoordinates: (address) => request(`/api/maps/geocode?address=${encodeURIComponent(address)}`),
  getDistance: (originLat, originLng, destLat, destLng) => 
    request(`/api/maps/distance?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`),
  getRoute: (originLat, originLng, destLat, destLng) => 
    request(`/api/maps/route?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`),

  // Product Management (for farmers)
  createProduct: async (payload) => {
    const product = await request("/api/farmer/products", { method: "POST", data: payload });
    return mapProduct(product);
  },
  updateProduct: async (id, payload) => {
    const product = await request(`/api/farmer/products/${id}`, { method: "PUT", data: payload });
    return mapProduct(product);
  },
  deleteProduct: (id) => request(`/api/farmer/products/${id}`, { method: "DELETE" }),
  getFarmerProducts: async () => {
    const products = await request(`/api/farmer/products`);
    return Array.isArray(products) ? products.map(mapProduct) : [];
  },
};


