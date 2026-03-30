import api from "./api";

export const initializePayment = async (amount) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) throw new Error("User not logged in");

  // ✅ Send the naira value as-is — backend handles kobo conversion
  // ❌ Do NOT do: amount * 100 here
  const response = await api.post("/payments/initialize", {
    amount, // e.g. 5000 (naira)
    email: user.email,
  });

  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await api.get(`/payments/verify/${reference}`);
  return response.data;
};