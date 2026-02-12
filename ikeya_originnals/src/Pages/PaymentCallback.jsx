import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { Loader2, XCircle } from "lucide-react";
import { verifyPayment } from "../services/paymentService";
import api from "../services/api";
import { toast } from "react-hot-toast";

/**
 * PaymentCallback
 *
 * Paystack redirects here after payment with:
 *   /payment-callback?reference=xxx&trxref=xxx
 *
 * This page:
 *  1. Reads `reference` from the URL
 *  2. Calls our backend to verify the payment
 *  3. On success → creates the order in the DB
 *  4. Navigates to /order-success
 */
const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState("verifying"); // "verifying" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setErrorMessage("No payment reference found. Please contact support.");
      return;
    }

    const handleVerification = async () => {
      try {
        // Step 1: Verify payment with our backend (which calls Paystack)
        const verifyData = await verifyPayment(reference);

        if (verifyData?.data?.status !== "success") {
          setStatus("error");
          setErrorMessage("Payment was not successful. Please try again.");
          return;
        }

        // Step 2: Retrieve pending order data saved before redirect
        const pending = JSON.parse(sessionStorage.getItem("pendingOrder"));

        if (!pending) {
          setStatus("error");
          setErrorMessage("Order data was lost. Please contact support with your reference: " + reference);
          return;
        }

        // Step 3: Create the order in the database now that payment is confirmed
        // Uses the api.js instance which already has the Render base URL + auth token
        const orderRes = await api.post("/orders", {
          address: pending.address,
          phone: pending.phone,
          paystackReference: reference,
        });

        // Step 4: Clean up sessionStorage
        sessionStorage.removeItem("pendingOrder");

        toast.success("Payment confirmed! Order placed.");

        // Step 5: Navigate to success page
        navigate("/order-success", {
          replace: true,
          state: { order: orderRes.data },
        });
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setErrorMessage(
          err.response?.data?.message || "Verification failed. Please contact support."
        );
      }
    };

    handleVerification();
  }, [reference, navigate]);

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 max-w-xl mx-auto text-center">
        {status === "verifying" && (
          <div className="space-y-6">
            <Loader2
              size={48}
              className="mx-auto text-amber-900 animate-spin"
              strokeWidth={1}
            />
            <h1 className="text-2xl font-display uppercase tracking-tighter text-black">
              Confirming Payment
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
              Please wait — do not close or refresh this page.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={40} className="text-red-500" strokeWidth={1} />
            </div>
            <h1 className="text-2xl font-display uppercase tracking-tighter text-black">
              Payment Failed
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="inline-block mt-4 bg-black text-white px-12 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-amber-900 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentCallback;
