import Layout from "../Shared/Layout/Layout";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Order = () => {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto text-center">
        <CheckCircle size={56} className="mx-auto text-rosegold mb-8" />

        <h1 className="text-4xl font-display text-plum mb-4 uppercase tracking-tighter">
          Order Confirmed
        </h1>

        <p className="text-plum/60 mb-10">
          Thank you for shopping Ikeyà Originals. Your order is being prepared.
        </p>

        <div className="bg-beige p-8 mb-10 text-left">
          <p className="text-xs uppercase tracking-widest text-plum/50 mb-2">
            Order ID
          </p>
          <p className="font-bold text-plum">#IKY-2025-001</p>
        </div>

        <Link
          to="/shop"
          className="inline-block bg-plum text-cream px-12 py-4 uppercase text-xs font-bold tracking-widest hover:bg-rosegold transition"
        >
          Continue Shopping
        </Link>
      </div>
    </Layout>
  );
};

export default Order;
