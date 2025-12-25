import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { ArrowRight, Loader2, MapPin, Phone, User, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const cartData = location.state;
  const subtotal = cartData?.subtotal || 0;
  const deliveryFee = 250000; 
  const total = subtotal + deliveryFee;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  if (!cartData || !cartData.items.length) return <Navigate to="/shop" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/orders", {
        address: formData.address,
        phone: formData.phone,
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success("Order Placed Successfully");
      navigate("/order-success", { state: { order: res.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (kobo) => `₦${(kobo / 100).toLocaleString()}`;

  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-display text-black uppercase tracking-tighter mb-12">Checkout</h1>
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3 space-y-12">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              <h2 className="text-[10px] font-bold text-amber-900 uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                <MapPin size={14} /> Shipping Information
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border-b border-neutral-200 focus-within:border-black transition-all pb-2">
                  <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Full Name</label>
                  <input required name="name" onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent outline-none text-sm py-1" placeholder="Jane Doe" />
                </div>
                <div className="border-b border-neutral-200 focus-within:border-black transition-all pb-2">
                  <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Phone</label>
                  <input required name="phone" onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent outline-none text-sm py-1" placeholder="+234..." />
                </div>
              </div>
              <div className="border-b border-neutral-200 focus-within:border-black transition-all pb-2">
                <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Address</label>
                <textarea required name="address" onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" className="w-full bg-transparent outline-none text-sm py-1 resize-none" placeholder="Street, City, State" />
              </div>
            </form>
            <div className="p-8 bg-neutral-50 border border-neutral-100 flex gap-4">
              <ShieldCheck className="text-amber-900" size={24} strokeWidth={1} />
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 leading-relaxed font-bold">
                Your payment and personal details are processed securely.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-neutral-100 p-8 sticky top-32 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900 mb-8 font-display">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {cartData.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-neutral-400">{item.product?.name} x{item.quantity}</span>
                    <span>{formatMoney(item.product?.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-100 pt-6 space-y-4 uppercase tracking-widest text-[10px] font-bold">
                <div className="flex justify-between text-neutral-400"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
                <div className="flex justify-between text-neutral-400"><span>Delivery</span><span>{formatMoney(deliveryFee)}</span></div>
                <div className="flex justify-between text-lg pt-4 text-black border-t border-neutral-50"><span>Total</span><span>{formatMoney(total)}</span></div>
              </div>
              <button form="checkout-form" disabled={loading} className="w-full mt-10 bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-900 transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <>Complete Order <ArrowRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;