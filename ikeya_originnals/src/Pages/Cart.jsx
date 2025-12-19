import { useState } from "react";
import Layout from "../Shared/Layout/Layout";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  // Mock data for the cart
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Signature Silk Dress",
      price: 45000,
      size: "M",
      category: "Fashion",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=75&w=400",
      quantity: 1,
    },
    {
      id: 101,
      name: "Nourishing Growth Oil",
      price: 8500,
      size: "100ml",
      category: "Beauty",
      img: "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=75&w=400",
      quantity: 2,
    },
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 2500; // Standard Nigeria nationwide delivery

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-display text-plum mb-10 uppercase tracking-tighter">Your Bag</h1>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-16">
            {/* --- ITEMS LIST --- */}
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 pb-8 border-b border-plum/5">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-beige overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase text-rosegold font-bold tracking-widest">{item.category}</p>
                          <h3 className="text-lg font-bold text-plum">{item.name}</h3>
                          <p className="text-sm text-plum/50">Size: {item.size}</p>
                        </div>
                        <p className="font-bold text-plum">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-plum/10">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-beige transition"><Minus size={14} /></button>
                        <span className="px-4 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-beige transition"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-plum/40 hover:text-rosegold transition flex items-center gap-1 text-xs uppercase font-bold">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- ORDER SUMMARY --- */}
            <div className="lg:col-span-1">
              <div className="bg-beige p-8 sticky top-32">
                <h2 className="text-xl font-display text-plum mb-6">Order Summary</h2>
                <div className="space-y-4 text-sm mb-8">
                  <div className="flex justify-between text-plum/60">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-plum/60">
                    <span>Estimated Delivery</span>
                    <span>₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-plum/10 flex justify-between font-bold text-lg text-plum">
                    <span>Total</span>
                    <span>₦{(subtotal + deliveryFee).toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full bg-plum text-cream py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-rosegold transition-colors flex items-center justify-center gap-2 group">
                  Proceed to Checkout <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="mt-6 text-[10px] text-center text-plum/40 uppercase tracking-widest leading-relaxed">
                  Nationwide Delivery Available <br /> Secure Payment via Paystack/Flutterwave
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center space-y-6">
            <ShoppingBag size={48} className="mx-auto text-plum/20" />
            <p className="text-plum/50 italic text-xl font-display">Your bag is as light as silk. Let's fill it.</p>
            <Link to="/shop" className="inline-block bg-plum text-cream px-10 py-4 uppercase text-xs font-bold tracking-widest hover:bg-rosegold transition">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;