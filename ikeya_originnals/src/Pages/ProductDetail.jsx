import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Layout from "../Shared/Layout/Layout";
import { useCart } from "../Context/CartContext";
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  ChevronRight, 
  Loader2, 
  ShieldCheck, 
  Truck, 
  RefreshCw 
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToBag } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Ensure this matches your backend route for a single product
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (priceInKobo) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(priceInKobo / 100);
  };

  if (loading) {
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-amber-900 mb-4" size={32} />
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold">Revealing Details</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-display mb-4 uppercase">Product Not Found</h2>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">Return to Shop</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 mb-12">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-black font-bold">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* You can map additional images here if your schema supports them */}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
            <span className="text-amber-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
              {product.type} / {product.category?.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-black mb-6">
              {product.name}
            </h1>
            <p className="text-2xl text-black font-light mb-8">
              {formatPrice(product.price)}
            </p>

            <div className="h-[1px] bg-neutral-100 w-full mb-8" />

            {/* Quantity Selector */}
            <div className="flex flex-col gap-4 mb-10">
              <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Quantity</span>
              <div className="flex items-center border border-neutral-200 w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-neutral-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-neutral-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => addToBag({...product, quantity})}
                className="grow bg-black text-white py-5 px-8 uppercase text-[10px] font-bold tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-900 transition-all duration-500"
              >
                <ShoppingBag size={16} /> Add to Bag
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-12 py-6 border-y border-neutral-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={18} className="text-amber-800" />
                <span className="text-[8px] uppercase tracking-tighter font-bold">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={18} className="text-amber-800" />
                <span className="text-[8px] uppercase tracking-tighter font-bold">Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw size={18} className="text-amber-800" />
                <span className="text-[8px] uppercase tracking-tighter font-bold">Easy Returns</span>
              </div>
            </div>

            {/* Tabs (Description/Details) */}
            <div className="space-y-6">
              <div className="flex gap-8 border-b border-neutral-100">
                {["description", "details"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-all ${
                      activeTab === tab ? "border-b-2 border-black text-black" : "text-neutral-400"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-neutral-500 text-sm leading-relaxed min-h-[100px]">
                {activeTab === "description" ? (
                  <p>{product.description || "No description available for this premium piece."}</p>
                ) : (
                  <ul className="space-y-2">
                    <li>• Sustainably Sourced</li>
                    <li>• Handcrafted Details</li>
                    <li>• Signature House Style</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;