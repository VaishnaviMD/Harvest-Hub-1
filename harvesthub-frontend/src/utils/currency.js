export const formatINR = (value) => {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
  } catch {
    return `₹${Number(value).toFixed(2)}`;
  }
};


