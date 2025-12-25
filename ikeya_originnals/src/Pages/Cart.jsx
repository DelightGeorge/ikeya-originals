import { useState, useEffect } from "react";
import Layout from "../Shared/Layout/Layout";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
    else setLoading(false);
  }, [token]);

  const updateQuantity = async (itemId, delta) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);

    try {
      await axios.patch(`http://localhost:5000/cart/${itemId}`, { quantity: newQty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i)));
    } catch (err) {
      toast.error("Could not update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Removed from bag");
    } catch (err) {
      toast.error("Could not remove item");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const formatMoney = (kobo) => `₦${(kobo / 100).toLocaleString()}`;

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { items: cartItems, subtotal } });
  };

  if (loading) return (
    <Layout>
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-amber-900" size={32} />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-display text-black mb-12 uppercase tracking-tighter">Your Bag</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-10">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-8 pb-10 border-b border-neutral-100 items-center">
                  <div className="w-24 h-32 bg-neutral-50 overflow-hidden">
                    <img src={item.product?.imageUrl} alt={item.product?.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[10px] uppercase text-amber-900 font-bold tracking-[0.2em] mb-1">{item.product?.type}</p>
                        <h3 className="text-sm font-bold uppercase tracking-widest">{item.product?.name}</h3>
                      </div>
                      <p className="font-bold text-sm">{formatMoney(item.product?.price * item.quantity)}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center border border-neutral-200">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-neutral-50"><Minus size={12} /></button>
                        <span className="px-4 text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-neutral-50"><Plus size={12} /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-[10px] uppercase font-bold text-neutral-400 hover:text-red-600 transition flex items-center gap-2">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-neutral-50 p-8 border border-neutral-100 sticky top-32">
                <h2 className="text-[10px] uppercase font-bold tracking-[0.3em] mb-8 text-amber-900">Summary</h2>
                <div className="space-y-4 text-xs font-medium uppercase tracking-widest border-b border-neutral-200 pb-6 mb-6">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
                  <div className="flex justify-between text-neutral-400"><span>Shipping</span><span>Calculated at checkout</span></div>
                </div>
                <div className="flex justify-between font-bold text-lg mb-8 uppercase tracking-tighter">
                  <span>Total</span><span>{formatMoney(subtotal)}</span>
                </div>
                <button onClick={handleProceedToCheckout} className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-900 transition-all flex items-center justify-center gap-3 group">
                  Proceed to Checkout <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center space-y-6">
            <ShoppingBag size={48} className="mx-auto text-neutral-100" />
            <p className="text-neutral-400 uppercase tracking-widest text-xs font-bold">Your bag is currently empty</p>
            <Link to="/shop" className="inline-block bg-black text-white px-12 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-amber-900 transition-all">Shop Collection</Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;