import api from "./api";

// Initialize a payment
export const initializePayment = async (amount) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) throw new Error("User not logged in");

  const response = await api.post("/payments/initialize", {
    amount,
    email: user.email,
  });

  return response.data; // contains authorization_url and reference
};

// Verify payment
export const verifyPayment = async (reference) => {
  const response = await api.get(`/payments/verify/${reference}`);
  return response.data; // contains payment status
};
