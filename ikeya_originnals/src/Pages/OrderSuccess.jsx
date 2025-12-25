import { useLocation, Link, Navigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { CheckCircle2, Package, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  // If someone tries to access this page without an actual order, redirect to shop
  if (!order) return <Navigate to="/shop" replace />;

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-600" strokeWidth={1} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display text-black mb-4 uppercase tracking-tighter">
            Order <span className="text-amber-900 italic">Confirmed</span>
          </h1>

          <p className="text-sm text-neutral-500 uppercase tracking-widest mb-12">
            Thank you for choosing Ikeyà. Your pieces are being prepared.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-100 border border-neutral-100">
          <div className="bg-white p-8">
            <div className="flex items-center gap-3 mb-4 text-amber-900">
              <Package size={18} strokeWidth={1.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Order Details</span>
            </div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Order ID</p>
            <p className="text-sm font-bold mb-4">#IKY-{order.id.slice(-8).toUpperCase()}</p>
            
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-sm font-bold">₦{order.totalAmount.toLocaleString()}</p>
          </div>

          <div className="bg-white p-8">
            <div className="flex items-center gap-3 mb-4 text-amber-900">
              <MapPin size={18} strokeWidth={1.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Shipping To</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              {order.address}
            </p>
            <p className="text-xs text-neutral-500 mt-2">{order.phone}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <Link
            to="/shop"
            className="w-full md:w-auto bg-black text-white px-16 py-5 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-amber-900 transition-all duration-500 flex items-center justify-center gap-3 group"
          >
            Continue Shopping
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link to="/profile" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-amber-900 hover:border-amber-900 transition-colors">
            Track Order in Profile
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;