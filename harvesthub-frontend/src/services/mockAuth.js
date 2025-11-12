// Mock authentication service that works without backend
const MOCK_USERS = [
  { userId: 1, email: "customer@test.com", password: "123456", name: "Test Customer", type: "Customer" },
  { userId: 2, email: "farmer@test.com", password: "123456", name: "Test Farmer", type: "Farmer" },
];

export const mockAuth = {
  signIn: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const token = `mock_token_${Date.now()}`;
      return {
        success: true,
        token,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          type: user.type,
        },
      };
    }
    return { success: false, message: "Invalid email or password" };
  },

  signUp: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: "User with this email already exists" };
    }
    
    const newUser = {
      userId: MOCK_USERS.length + 1,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      type: userData.type || "Customer",
    };
    MOCK_USERS.push(newUser);
    
    const token = `mock_token_${Date.now()}`;
    return {
      success: true,
      token,
      user: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type,
      },
    };
  },
};

