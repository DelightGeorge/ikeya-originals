import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { useCart } from "../Context/CartContext";
import { getProductsByType } from "../services/productService";
import { formatPrice } from "../utils/formatters";
import { PRODUCT_TYPES } from "../constants/products";
import WishlistHeart from "../Components/WishlistHeart";
import QuickViewModal from "../Components/QuickViewModal";
import {
  Leaf,
  Droplet,
  ShieldCheck,
  ShoppingBag,
  Eye,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const Shimmer = ({ className = "" }) => (
  <div className={`animate-pulse bg-neutral-700 ${className}`} aria-hidden="true" />
);

const CardSkeleton = () => (
  <div className="flex flex-col sm:flex-row bg-white/5 p-4 border border-white/5 gap-10 items-center">
    <Shimmer className="w-full sm:w-1/2 aspect-square" />
    <div className="w-full sm:w-1/2 space-y-4 pr-4">
      <Shimmer className="h-3 w-1/3 rounded" />
      <Shimmer className="h-6 w-3/4 rounded" />
      <Shimmer className="h-4 w-1/4 rounded" />
      <Shimmer className="h-10 w-full rounded" />
    </div>
  </div>
);

const Hair = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewList, setQuickViewList] = useState([]);

  const { addToBag } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeauty = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProductsByType(PRODUCT_TYPES.BEAUTY);
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.content ?? res.data?.products ?? []);
        setProducts(data);
      } catch (err) {
        console.error("Beauty fetch error:", err);
        setError("Unable to load products right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBeauty();
  }, []);

  useEffect(() => {
    const handleStockUpdate = (event) => {
      const { productId, stock } = event.detail;
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock } : p)));
    };
    window.addEventListener("productStockUpdated", handleStockUpdate);
    return () => window.removeEventListener("productStockUpdated", handleStockUpdate);
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category?.name).filter(Boolean))];
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category?.name === activeCategory);
  }, [products, activeCategory]);

  const handleAddToBag = (product) => {
    addToBag({ productId: product.id, quantity: 1, product });
    window.dispatchEvent(new CustomEvent("cartItemAdded", { detail: { product } }));
  };

  const openQuickView = (product) => {
    setQuickViewList(filteredProducts);
    setQuickViewProduct(product);
  };

  return (
    <Layout>
      {/* HERO */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-black">
        <img
          src="https://res.cloudinary.com/dk8uaekik/image/upload/v1770901094/ikeya11_bsl0lo.jpg"
          alt="Ikeyá Naturals Hair Care Essentials"
          className="w-full h-full object-cover object-center brightness-[0.55]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-amber-500 uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">
            Sub-Brand 02
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white uppercase tracking-tighter mb-6">
            Ikeyá <span className="italic font-light text-amber-500">Naturals</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-light max-w-xl mx-auto tracking-[0.15em] uppercase">
            Premium Botanical Hair Care Essentials
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center bg-white">
        <Leaf size={28} className="text-amber-800 mx-auto mb-8" strokeWidth={1.5} />
        <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-black mb-6">
          Honest Care, From The Earth
        </h2>
        <p className="text-neutral-500 text-lg leading-relaxed font-light">
          We believe that what you put on your body is as important as what you put in it. Every
          oil and butter is formulated with earth-derived, botanical ingredients to restore the
          strength, shine, and majesty of your natural crown — no shortcuts, no fillers.
        </p>
      </section>

      {/* TRUST STRIP */}
      <div className="bg-[#1a1a1a] py-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-y-6 text-white text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-center">
          {[
            { icon: <Leaf size={18} />, text: "Botanical Ingredients" },
            { icon: <Droplet size={18} />, text: "Deep Nourishment" },
            { icon: <ShieldCheck size={18} />, text: "Honest Formulation" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-3">
              <span className="text-amber-600">{item.icon}</span> {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6 border-l-4 border-amber-800 pl-8">
            <div>
              <span className="text-amber-600 uppercase tracking-[0.4em] text-[10px] font-bold mb-3 block">
                The Full Range
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter">
                Naturals Essentials
              </h2>
            </div>

            {!loading && categories.length > 2 && (
              <div className="flex flex-wrap gap-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs uppercase tracking-[0.2em] font-bold transition-all pb-1 border-b-2 ${
                      activeCategory === cat
                        ? "text-amber-500 border-amber-500"
                        : "text-white/40 border-transparent hover:text-white/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <AlertCircle size={28} className="mx-auto mb-4 text-red-400" />
              <p className="text-sm text-neutral-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-amber-600 text-xs uppercase tracking-widest font-bold hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 text-xs uppercase tracking-widest">
              Products coming soon
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12">
              {filteredProducts.map((p) => {
                const outOfStock = typeof p.stock === "number" && p.stock <= 0;
                return (
                  <div
                    key={p.id}
                    className={`group flex flex-col sm:flex-row bg-white/5 p-4 items-center gap-10 border border-white/5 hover:border-amber-800/50 transition-all duration-700 ${
                      outOfStock ? "opacity-60" : ""
                    }`}
                  >
                    <div className="w-full sm:w-1/2 aspect-square overflow-hidden relative">
                      <Link to={`/product/${p.id}`} state={{ productIds: filteredProducts.map((prod) => prod.id) }}>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                      </Link>
                      <WishlistHeart productId={p.id} className="absolute top-3 right-3 z-10" />
                      {!outOfStock && (
                        <button
                          type="button"
                          onClick={() => openQuickView(p)}
                          aria-label={`Quick view ${p.name}`}
                          className="absolute top-3 left-3 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white text-black shadow-md active:bg-amber-800 active:text-white transition-colors"
                        >
                          <Eye size={15} strokeWidth={2} />
                        </button>
                      )}
                      {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <p className="text-white font-bold uppercase text-xs">Out of Stock</p>
                        </div>
                      )}
                    </div>
                    <div className="w-full sm:w-1/2 pr-4 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-600 mb-3">
                        <Leaf size={14} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                          {p.category?.name || "Organic"}
                        </span>
                      </div>
                      <h3 className="text-2xl font-display font-bold mb-2 uppercase tracking-tight">
                        {p.name}
                      </h3>
                      <p className="text-xl text-white font-light mb-6 italic">
                        {formatPrice(p.price)}
                      </p>
                      {typeof p.stock === "number" && p.stock > 0 && p.stock <= 3 && (
                        <p className="text-[10px] text-amber-500 font-bold uppercase mb-3">
                          Only {p.stock} left
                        </p>
                      )}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => handleAddToBag(p)}
                          disabled={outOfStock}
                          className={`w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                            outOfStock
                              ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                              : "bg-white text-black hover:bg-amber-800 hover:text-white"
                          }`}
                        >
                          <ShoppingBag size={14} /> {outOfStock ? "Out of Stock" : "Add to Bag"}
                        </button>
                        <Link
                          to={`/product/${p.id}`}
                          className="block w-full text-center border border-white/30 text-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-white transition-all"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-20 border-t border-neutral-100 max-w-3xl mx-auto px-6 text-center bg-white">
        <p className="text-black font-display text-2xl md:text-3xl italic leading-snug mb-6">
          "I really love the oil and butter you sent me. It smells sweet and minty at the same
          time, and it looks and feels so good."
        </p>
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
          — Stephanie.
        </span>
      </section>

      {/* CTA */}
      <section className="py-24 bg-amber-900 text-white text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter mb-4">
            Nourish Your Crown Today
          </h2>
          <p className="text-white/70 text-sm font-light mb-10 tracking-wider">
            Botanical hair care, delivered nationwide.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black hover:text-white transition-all duration-500"
          >
            View My Bag <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          productList={quickViewList}
          onClose={() => setQuickViewProduct(null)}
          onNavigate={(p) => setQuickViewProduct(p)}
        />
      )}
    </Layout>
  );
};

export default Hair;