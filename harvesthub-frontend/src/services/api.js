import { httpClient } from "./httpClient";

const USE_MOCK = false; // Set to false when backend is available

const mockFarmerProducts = [
  { productId: 101, id: 101, name: "Heirloom Tomatoes", category: "Vegetables", price: 120, quantity: 12, image: "/category-vegetables.jpg", freshness: 95 },
  { productId: 102, id: 102, name: "Raw Honey", category: "Other", price: 350, quantity: 6, image: "/category-dairy.jpg", freshness: 100 },
];
let mockFarmerProductCounter = 200;

async function request(path, options = {}) {
  const { method = "GET", data, headers = {} } = options;

  if (USE_MOCK) {
    return mockRequest(path, { method, data });
  }

  try {
    const response = await httpClient({
      url: path,
      method,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    const message = error?.message || "";
    if (!error.status && (message.includes("Network Error") || message.includes("ECONNREFUSED"))) {
      return mockRequest(path, { method, data });
    }
    if (error.status) {
      throw error;
    }
    const generic = new Error(message || "Network error occurred");
    throw generic;
  }
}

// Mock request handler
async function mockRequest(path, options) {
  const { mockAuth } = await import("./mockAuth");
  const { mockMaps } = await import("./mockMaps");
  const { mockPayment } = await import("./mockPayment");
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Auth endpoints
  if (path === "/api/auth/signin" && options.method === "POST") {
    const body = options.data || {};
    return mockAuth.signIn(body.email, body.password);
  }
  
  if (path === "/api/auth/signup" && options.method === "POST") {
    const body = options.data || {};
    return mockAuth.signUp(body);
  }

  // Farmer product management
  if (path.startsWith("/api/farmer/products")) {
    const method = options.method || "GET";
    const [, , , , productIdSegment] = path.split("/");

    if (method === "GET") {
      if (productIdSegment) {
        const target = mockFarmerProducts.find((p) => String(p.productId) === productIdSegment);
        if (!target) {
          throw new Error("Product not found");
        }
        return target;
      }
      return mockFarmerProducts;
    }

    if (method === "POST") {
      const body = options.data || {};
      const newProduct = {
        ...body,
        productId: ++mockFarmerProductCounter,
        id: mockFarmerProductCounter,
        image: body.image || "/category-vegetables.jpg",
      };
      mockFarmerProducts.unshift(newProduct);
      return newProduct;
    }

    if (method === "PUT" && productIdSegment) {
      const body = options.data || {};
      const idx = mockFarmerProducts.findIndex((p) => String(p.productId) === productIdSegment);
      if (idx === -1) {
        throw new Error("Product not found");
      }
      mockFarmerProducts[idx] = {
        ...mockFarmerProducts[idx],
        ...body,
        productId: mockFarmerProducts[idx].productId,
        id: mockFarmerProducts[idx].productId,
      };
      return mockFarmerProducts[idx];
    }

    if (method === "DELETE" && productIdSegment) {
      const idx = mockFarmerProducts.findIndex((p) => String(p.productId) === productIdSegment);
      if (idx !== -1) {
        mockFarmerProducts.splice(idx, 1);
      }
      return { success: true };
    }
  }

  // Products - return mock products
  if (path === "/api/products" && options.method !== "POST") {
    return [
      { productId: 1, id: 1, name: "Organic Tomatoes", price: 99, category: "Vegetables", image: "/category-vegetables.jpg" },
      { productId: 2, id: 2, name: "Fresh Strawberries", price: 149, category: "Fruits", image: "/category-fruits.jpg" },
      { productId: 3, id: 3, name: "Farm Milk 1L", price: 79, category: "Dairy", image: "/category-dairy.jpg" },
      { productId: 4, id: 4, name: "Kale Bunch", price: 69, category: "Vegetables", image: "/category-vegetables.jpg" },
      { productId: 5, id: 5, name: "Bananas (6)", price: 59, category: "Fruits", image: "/category-fruits.jpg" },
      { productId: 6, id: 6, name: "Greek Yogurt", price: 119, category: "Dairy", image: "/category-dairy.jpg" },
    ];
  }

  // Orders - mock success
  if (path === "/api/orders" && options.method === "POST") {
    const body = options.data || {};
    return {
      orderId: Date.now(),
      totalAmount: body.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
      status: "PENDING",
    };
  }

  // Payment gateway
  if (path.includes("/payments/gateway/create-order") && options.method === "POST") {
    const body = options.data || {};
    return mockPayment.createOrder(body.amount, body.currency);
  }

  // Maps
  if (path.includes("/maps/geocode")) {
    const address = new URLSearchParams(path.split("?")[1]).get("address");
    return mockMaps.getCoordinatesFromAddress(address);
  }

  if (path.includes("/maps/distance")) {
    const params = new URLSearchParams(path.split("?")[1]);
    return mockMaps.calculateDistanceAndTime(
      parseFloat(params.get("originLat")),
      parseFloat(params.get("originLng")),
      parseFloat(params.get("destLat")),
      parseFloat(params.get("destLng"))
    );
  }

  return { success: true, message: "Mock response" };
}

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
  signIn: async (payload) => {
    try {
      return await request("/api/auth/signin", { method: "POST", data: payload });
    } catch (err) {
      const { mockAuth } = await import("./mockAuth");
      return mockAuth.signIn(payload.email, payload.password);
    }
  },
  signUp: async (payload) => {
    try {
      return await request("/api/auth/signup", { method: "POST", data: payload });
    } catch (err) {
      const { mockAuth } = await import("./mockAuth");
      return mockAuth.signUp(payload);
    }
  },

  // Orders
  createOrder: (payload) => request("/api/orders", { method: "POST", data: payload }),

  // Payments
  createPayment: (payload) => request("/api/payments", { method: "POST", data: payload }),

  // Payment Gateway
  createPaymentOrder: (payload) => request("/api/payments/gateway/create-order", { method: "POST", data: payload }),
  verifyPayment: (payload) => request("/api/payments/gateway/verify", { method: "POST", data: payload }),

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


