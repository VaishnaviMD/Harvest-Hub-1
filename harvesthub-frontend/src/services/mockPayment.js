// Mock payment gateway service that works without Razorpay API
export const mockPayment = {
  createOrder: async (amount, currency = "INR") => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderId = `order_${Date.now()}`;
    return {
      orderId,
      amount,
      currency,
      keyId: "mock_key_id",
    };
  },

  processPayment: async (orderId, amount, paymentMethod) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        paymentId: `pay_${Date.now()}`,
        transactionId: `TXN${Date.now()}`,
        status: "SUCCESS",
        amount,
      };
    } else {
      return {
        success: false,
        message: "Payment failed. Please try again.",
      };
    }
  },
};

