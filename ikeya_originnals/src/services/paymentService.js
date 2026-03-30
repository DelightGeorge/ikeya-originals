import api from "./api";

/**
 * Initialize a Paystack payment.
 *
 * @param {number} amountInKobo - Total charge in kobo (from CartContext + deliveryFee).
 *                                e.g. 650000 = ₦6,500
 *
 * Flow:
 *   CartContext prices  → kobo  (e.g. 500000)
 *   deliveryZones fees  → kobo  (e.g. 180000)
 *   total               → kobo  (e.g. 680000)
 *   ÷ 100 here          → naira (e.g. 6800)    ← sent to backend
 *   backend × 100       → kobo  (e.g. 680000)  ← sent to Paystack ✅
 */
export const initializePayment = async (amountInKobo) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) throw new Error("User not logged in");

  // Convert kobo → naira before sending to backend.
  // The backend (paymentController.js) does the final × 100 for Paystack.
  const amountInNaira = amountInKobo / 100;

  const response = await api.post("/payments/initialize", {
    amount: amountInNaira,
    email:  user.email,
  });

  return response.data; // contains { data: { authorization_url, reference, ... } }
};

/**
 * Verify a completed Paystack payment by reference.
 *
 * @param {string} reference - Paystack transaction reference from the callback URL.
 */
export const verifyPayment = async (reference) => {
  const response = await api.get(`/payments/verify/${reference}`);
  return response.data; // contains { data: { status, amount, ... } }
};