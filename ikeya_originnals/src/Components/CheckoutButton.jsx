import React from "react";
import { initializePayment } from "../services/paymentService";
import { useNavigate } from "react-router-dom";

// ✅ `amount` prop must always be in NAIRA (e.g. 5000, not 500000)
const CheckoutButton = ({ amount }) => {
  const navigate = useNavigate();

  const handlePay = async () => {
    try {
      const { data } = await initializePayment(amount); // sends naira as-is

      if (!data?.authorization_url) {
        alert("Could not get payment URL. Please try again.");
        return;
      }

      const win = window.open(data.authorization_url, "_blank");

      if (!win) {
        // Popup was blocked — fall back to same-tab redirect
        window.location.href = data.authorization_url;
        return;
      }

      // Poll until the popup closes, then let PaymentCallback handle verification.
      // Avoid verifying here AND in PaymentCallback — that creates a race condition.
      const checkInterval = setInterval(() => {
        if (win.closed) {
          clearInterval(checkInterval);
          // Paystack will redirect to your callback URL after payment,
          // so PaymentCallback.jsx handles verification automatically.
          // Only use this polling path if you're NOT using a redirect callback.
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Payment could not be processed. Try again.");
    }
  };

  return (
    <button
      onClick={handlePay}
      className="bg-black text-white px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-amber-900 transition-all"
    >
      Pay ₦{amount.toLocaleString()}
    </button>
  );
};

export default CheckoutButton;