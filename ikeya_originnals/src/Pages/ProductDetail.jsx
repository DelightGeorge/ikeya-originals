import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Layout from "../Shared/Layout/Layout";
import { useCart } from "../Context/CartContext";
import { toast } from "react-hot-toast";
import {
  Plus, Minus, ShoppingBag, ChevronRight,
  Loader2, ShieldCheck, Truck, RefreshCw, XCircle,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToBag } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const formatPrice = (priceInKobo) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(priceInKobo / 100);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ─── Stock helpers ────────────────────────────────────────────────────────
  const isOutOfStock = (p) => typeof p?.stock === "number" && p.stock <= 0;
  const isLowStock   = (p) => typeof p?.stock === "number" && p.stock > 0 && p.stock <= 3;

  // ✅ GUARD: passes full product so CartContext can also verify stock
  const handleAddToBag = () => {
    if (isOutOfStock(product)) {
      toast.error("Sorry, this item is currently out of stock.", {
        icon: "🚫",
        duration: 3000,
      });
      return;
    }
    addToBag({ productId: product.id, quantity, product });
  };

  if (loading)
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-amber-900 mb-4" size={32} />
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold">
            Revealing Details
          </p>
        </div>
      </Layout>
    );

  if (!product)
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-display mb-4 uppercase">Product Not Found</h2>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">
            Return to Shop
          </Link>
        </div>
      </Layout>
    );

  const outOfStock = isOutOfStock(product);
  const lowStock   = isLowStock(product);

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

          {/* LEFT: Image */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-all ${outOfStock ? "grayscale-[50%] opacity-70" : ""}`}
              />
              {/* Out of stock overlay on image */}
              {outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="bg-black/80 text-white px-8 py-4 text-center">
                    <XCircle size={24} className="mx-auto mb-2 text-red-400" />
                    <p className="text-xs font-bold uppercase tracking-widest">Out of Stock</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
            <span className="text-amber-800 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
              {product.type} / {product.category?.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-black mb-6">
              {product.name}
            </h1>
            <p className="text-2xl text-black font-light mb-4">
              {formatPrice(product.price)}
            </p>

            {/* ── Stock Status ── */}
            {outOfStock ? (
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                  <XCircle size={11} /> Out of Stock
                </span>
                <span className="text-[10px] text-neutral-400 font-light">
                  This item is currently unavailable
                </span>
              </div>
            ) : lowStock ? (
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                  Only {product.stock} left — order soon
                </span>
              </div>
            ) : typeof product.stock === "number" && product.stock > 0 ? (
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                  In Stock
                </span>
              </div>
            ) : (
              <div className="mb-6" /> /* no stock data — show nothing */
            )}

            <div className="h-[1px] bg-neutral-100 w-full mb-8" />

            {/* Quantity Selector — hidden when out of stock */}
            {!outOfStock && (
              <div className="flex flex-col gap-4 mb-10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  Quantity
                </span>
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
            )}

            {/* Add to Bag / Out of Stock Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {outOfStock ? (
                <button
                  disabled
                  className="grow bg-neutral-200 text-neutral-400 py-5 px-8 uppercase text-[10px] font-bold tracking-[0.3em] flex items-center justify-center gap-3 cursor-not-allowed"
                >
                  <XCircle size={16} /> Currently Out of Stock
                </button>
              ) : (
                <button
                  onClick={handleAddToBag}
                  className="grow bg-black text-white py-5 px-8 uppercase text-[10px] font-bold tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-900 transition-all duration-500"
                >
                  <ShoppingBag size={16} /> Add to Bag
                </button>
              )}
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

            {/* Tabs */}
            <div className="space-y-6">
              <div className="flex gap-8 border-b border-neutral-100">
                {["description", "details"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-all ${
                      activeTab === tab
                        ? "border-b-2 border-black text-black"
                        : "text-neutral-400"
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