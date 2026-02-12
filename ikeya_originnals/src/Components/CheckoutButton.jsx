import React from "react";
import { initializePayment, verifyPayment } from "../services/paymentService";
import { useNavigate } from "react-router-dom";

const CheckoutButton = ({ amount }) => {
  const navigate = useNavigate();

  const handlePay = async () => {
    try {
      // Initialize payment
      const { data } = await initializePayment(amount);

      if (data?.authorization_url) {
        // Open Paystack checkout in new tab
        const win = window.open(data.authorization_url, "_blank");

        // Polling for verification (optional for instant verification)
        const checkInterval = setInterval(async () => {
          if (win.closed) {
            clearInterval(checkInterval);
            // Verify payment
            const verify = await verifyPayment(data.reference);
            if (verify.data.status === "success") {
              // Payment confirmed, navigate to OrderSuccess
              navigate("/order-success", { state: { order: { id: data.reference, totalAmount: amount } } });
            } else {
              alert("Payment failed or not completed.");
            }
          }
        }, 1000);
      }
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
