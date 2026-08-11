import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import WishlistHeart from "../Components/WishlistHeart";
import QuickViewModal from "../Components/QuickViewModal";
import { getProductsByType } from "../services/productService";
import { formatPrice } from "../utils/formatters";
import { PRODUCT_TYPES } from "../constants/products";
import {
  Scissors,
  Sparkles,
  Truck,
  ShieldCheck,
  MessageCircle,
  Eye,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

const Shimmer = ({ className = "" }) => (
  <div className={`animate-pulse bg-neutral-100 ${className}`} aria-hidden="true" />
);

const CardSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Shimmer className="aspect-[3/4] w-full" />
    <Shimmer className="h-3 w-3/4 rounded" />
    <Shimmer className="h-3 w-1/3 rounded" />
  </div>
);

const Fashion = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewList, setQuickViewList] = useState([]);

  useEffect(() => {
    const fetchFashion = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProductsByType(PRODUCT_TYPES.FASHION);
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.content ?? res.data?.products ?? []);
        setProducts(data);
      } catch (err) {
        console.error("Fashion fetch error:", err);
        setError("Unable to load the collection right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFashion();
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

  const getWhatsAppUrl = (product) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in *${product.name}*. Could you help me with sizing, availability, and how to place an order?`,
    );
    return `https://wa.me/+2349161270548?text=${msg}`;
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
          src="https://res.cloudinary.com/dk8uaekik/image/upload/v1786384492/1st_one_hnwqst.jpg"
          alt="Ikeyá Fashion Collection"
          className="w-full h-full object-cover object-center brightness-[0.6]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-amber-500 uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">
            Sub-Brand 01
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white uppercase tracking-tighter mb-6">
            <span className="italic font-light text-amber-500">Ikeyá</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-light max-w-xl mx-auto tracking-[0.15em] uppercase">
            Contemporary Fashion Rooted In African Heritage
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <Scissors size={28} className="text-amber-800 mx-auto mb-8" strokeWidth={1.5} />
        <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-black mb-6">
          Crafted, Not Mass-Produced
        </h2>
        <p className="text-neutral-500 text-lg leading-relaxed font-light">
          Every piece in this collection is made-to-order and tailored around you. We blend
          structured silhouettes with traditional textiles to create timeless garments for the
          modern visionary — nothing rushed, nothing generic, and nothing that already exists on
          a rack somewhere else.
        </p>
      </section>

      {/* TRUST STRIP */}
      <div className="bg-black py-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-y-6 text-white text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-center">
          {[
            { icon: <Sparkles size={18} />, text: "Made To Order" },
            { icon: <Truck size={18} />, text: "Nationwide Delivery" },
            { icon: <ShieldCheck size={18} />, text: "Authentic Craftsmanship" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-3">
              <span className="text-amber-700">{item.icon}</span> {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* COLLECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-amber-800 uppercase tracking-[0.4em] text-[10px] font-bold mb-3 block">
              The Full Range
            </span>
            <h2 className="text-4xl md:text-5xl font-display text-black font-bold uppercase tracking-tighter">
              The Collection
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
                      ? "text-amber-800 border-amber-800"
                      : "text-black/40 border-transparent hover:text-black/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <AlertCircle size={28} className="mx-auto mb-4 text-red-400" />
            <p className="text-sm text-red-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-amber-800 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-neutral-300 text-xs uppercase tracking-widest">
            Collection coming soon
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {filteredProducts.map((p) => {
              const outOfStock = typeof p.stock === "number" && p.stock <= 0;
              return (
                <div key={p.id} className="group flex flex-col h-full">
                  <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-5">
                    <Link to={`/product/${p.id}`} state={{ productIds: filteredProducts.map((prod) => prod.id) }}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className={`w-full h-full object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 ${
                          outOfStock ? "opacity-50" : ""
                        }`}
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
                    {outOfStock ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <p className="text-white font-bold uppercase text-xs">Out of Stock</p>
                      </div>
                    ) : (
                      <a
                        href={getWhatsAppUrl(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 left-4 right-4 bg-white/95 text-black py-3 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white"
                      >
                        <MessageCircle size={14} /> Enquire on WhatsApp
                      </a>
                    )}
                  </div>
                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-1 hover:text-amber-800 transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-amber-900 font-medium text-sm">{formatPrice(p.price)}</p>
                  {typeof p.stock === "number" && p.stock > 0 && p.stock <= 3 && (
                    <p className="text-[10px] text-amber-700 font-bold uppercase mt-1">
                      Only {p.stock} left
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* QUOTE */}
      <section className="py-20 border-t border-neutral-100 max-w-3xl mx-auto px-6 text-center">
        <p className="text-black font-display text-2xl md:text-3xl italic leading-snug mb-6">
          "I really love my dress and the fact you made it perfectly without seeing me."
        </p>
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
          — Miss Toni.
        </span>
      </section>

      {/* CTA */}
      <section className="py-24 bg-amber-900 text-white text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter mb-4">
            Ready For Something Tailored?
          </h2>
          <p className="text-white/70 text-sm font-light mb-10 tracking-wider">
            Chat with us on WhatsApp about sizing, fabric, and timelines.
          </p>
          <a
            href="https://wa.me/+2349161270548"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black hover:text-white transition-all duration-500"
          >
            Start a Conversation <ArrowRight size={14} />
          </a>
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

export default Fashion;