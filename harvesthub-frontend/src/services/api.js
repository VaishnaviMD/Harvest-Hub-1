const defaultBaseUrl = process.env.REACT_APP_API_BASE_URL || "";
const USE_MOCK = true; // Set to false when backend is available

function getBaseUrl() {
  return defaultBaseUrl;
}

function getAuthToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  // Use mock if backend is not available
  if (USE_MOCK) {
    return mockRequest(path, options);
  }

  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      headers,
      ...options,
    });
    
    const contentType = res.headers.get("content-type") || "";
    let errorText = "";
    
    if (!res.ok) {
      // Try to get error message from response
      if (contentType.includes("application/json")) {
        try {
          const errorJson = await res.json();
          errorText = errorJson.message || errorJson.error || (typeof errorJson === 'string' ? errorJson : JSON.stringify(errorJson));
        } catch (e) {
          errorText = await res.text().catch(() => "");
        }
      } else {
        errorText = await res.text().catch(() => "");
      }
      throw new Error(errorText || `Request failed with status ${res.status}`);
    }
    
    if (contentType.includes("application/json")) {
      return res.json();
    }
    return res.text();
  } catch (error) {
    // Fallback to mock on network error
    if (error.message.includes("ECONNREFUSED") || error.message.includes("Failed to fetch")) {
      return mockRequest(path, options);
    }
    // If it's already an Error with message, rethrow it
    if (error instanceof Error && error.message) {
      throw error;
    }
    // Otherwise wrap it
    throw new Error(error.message || "Network error occurred");
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
    const body = JSON.parse(options.body || "{}");
    return mockAuth.signIn(body.email, body.password);
  }
  
  if (path === "/api/auth/signup" && options.method === "POST") {
    const body = JSON.parse(options.body || "{}");
    return mockAuth.signUp(body);
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
    const body = JSON.parse(options.body || "{}");
    return {
      orderId: Date.now(),
      totalAmount: body.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
      status: "PENDING",
    };
  }

  // Payment gateway
  if (path.includes("/payments/gateway/create-order") && options.method === "POST") {
    const body = JSON.parse(options.body || "{}");
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
      return await request("/api/auth/signin", { method: "POST", body: JSON.stringify(payload) });
    } catch (err) {
      // Fallback to mock
      const { mockAuth } = await import("./mockAuth");
      return mockAuth.signIn(payload.email, payload.password);
    }
  },
  signUp: async (payload) => {
    try {
      return await request("/api/auth/signup", { method: "POST", body: JSON.stringify(payload) });
    } catch (err) {
      // Fallback to mock
      const { mockAuth } = await import("./mockAuth");
      return mockAuth.signUp(payload);
    }
  },

  // Orders
  createOrder: (payload) => request("/api/orders", { method: "POST", body: JSON.stringify(payload) }),

  // Payments
  createPayment: (payload) => request("/api/payments", { method: "POST", body: JSON.stringify(payload) }),

  // Payment Gateway
  createPaymentOrder: (payload) => request("/api/payments/gateway/create-order", { method: "POST", body: JSON.stringify(payload) }),
  verifyPayment: (payload) => request("/api/payments/gateway/verify", { method: "POST", body: JSON.stringify(payload) }),

  // Google Maps
  getCoordinates: (address) => request(`/api/maps/geocode?address=${encodeURIComponent(address)}`),
  getDistance: (originLat, originLng, destLat, destLng) => 
    request(`/api/maps/distance?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`),
  getRoute: (originLat, originLng, destLat, destLng) => 
    request(`/api/maps/route?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`),
};


