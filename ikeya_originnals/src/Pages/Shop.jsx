import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { formatPrice } from "../utils/formatters";
import { PRODUCT_TYPES } from "../constants/products";
import { Filter, ShoppingBag, AlertCircle, X, MessageCircle, Eye } from "lucide-react";
import { getProducts } from "../services/productService";
import { useCart } from "../Context/CartContext";
import WishlistHeart from "../Components/WishlistHeart";
import QuickViewModal from "../Components/QuickViewModal";

const Shimmer = ({ className }) => (
  <div className={"animate-pulse bg-neutral-100 " + (className || "")} aria-hidden="true" />
);

const ProductSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Shimmer className="aspect-[3/4] w-full" />
    <Shimmer className="h-3 w-3/4 rounded" />
    <Shimmer className="h-3 w-1/4 rounded" />
    <Shimmer className="h-3 w-1/3 rounded" />
  </div>
);

const Shop = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const typeQuery = searchParams.get("type") || PRODUCT_TYPES.ALL;

  const [activeCategory, setActiveCategory] = useState(typeQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { addToBag } = useCart();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  useEffect(() => {
    const handleStockUpdate = (event) => {
      const { productId, stock } = event.detail;
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock } : p)));
    };
    window.addEventListener("productStockUpdated", handleStockUpdate);
    return () => window.removeEventListener("productStockUpdated", handleStockUpdate);
  }, []);

  useEffect(() => {
    setActiveCategory(typeQuery);
  }, [typeQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === PRODUCT_TYPES.ALL || p.type === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const categories = [
    { key: PRODUCT_TYPES.ALL, label: "All" },
    { key: PRODUCT_TYPES.FASHION, label: "StyleXIkeya" },
    { key: PRODUCT_TYPES.BEAUTY, label: "Ikeya Naturals" },
  ];

  const isOutOfStock = (p) => typeof p.stock === "number" && p.stock <= 0;

  const handleAddToBag = (product) => {
    addToBag({ productId: product.id, quantity: 1, product });
    window.dispatchEvent(new CustomEvent("cartItemAdded", { detail: { product } }));
  };

  const getWhatsAppUrl = (product) => {
    const msg = encodeURIComponent(
      "Hi! I'm interested in *" + product.name + "*. Could you help me with sizing, availability, and how to place an order?"
    );
    return "https://wa.me/+2349161270548?text=" + msg;
  };

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <span className="text-amber-800 uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">
            The House of Ikeyá
          </span>
          <h1 className="text-5xl md:text-7xl font-display text-black mb-4 uppercase tracking-tighter font-bold">
            The <span className="text-amber-800 italic font-light">Collection</span>
          </h1>
          <p className="text-neutral-400 text-sm font-light max-w-xl mx-auto leading-relaxed">
            Fashion that tells a story. Haircare that nurtures your crown.
          </p>

          {searchQuery && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Searching for:</span>
              <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1">
                <span className="text-[10px] font-bold uppercase tracking-widest italic">"{searchQuery}"</span>
                <Link to="/shop" className="text-neutral-400 hover:text-black">
                  <X size={12} />
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-neutral-100 pb-6 mb-10 gap-6">
          <div className="flex gap-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={
                  "text-xs uppercase tracking-[0.2em] font-bold transition-all pb-1 " +
                  (activeCategory === cat.key
                    ? "text-amber-800 border-b-2 border-amber-800"
                    : "text-black/40 hover:text-black/80")
                }
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-black/60 text-xs uppercase tracking-widest font-medium">
            <Filter size={14} className="text-amber-800" />
            {loading ? "—" : filteredProducts.length} Results
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle size={32} className="mb-4 text-red-400" />
            <p className="text-sm text-red-400 mb-6 text-center max-w-md">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-amber-800 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-neutral-400 uppercase tracking-widest text-xs font-bold mb-6">
              {searchQuery ? "No products found matching \"" + searchQuery + "\"" : "No products in this category yet"}
            </p>
            {searchQuery && (
              <Link
                to="/shop"
                className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-amber-800 transition-all"
              >
                View All Products
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {filteredProducts.map((p) => {
              const outOfStock = isOutOfStock(p);
              const isFashion = p.type === "FASHION";
              return (
                <div key={p.id} className="group flex flex-col h-full">
                  <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-4">
                    <Link to={"/product/" + p.id} state={{ productIds: filteredProducts.map((prod) => prod.id) }}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className={
                          "w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 " +
                          (outOfStock ? "grayscale-[60%] opacity-70" : "")
                        }
                      />
                    </Link>

                    <WishlistHeart productId={p.id} className="absolute top-3 right-3 z-10" />

                    {!outOfStock && (
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(p)}
                        aria-label={"Quick view " + p.name}
                        className="absolute top-3 left-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-black/60 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-amber-800 transition-all"
                      >
                        <Eye size={14} />
                      </button>
                    )}

                    {outOfStock ? (
                      <div className="absolute inset-0 flex items-end justify-center pb-4 px-4">
                        <div className="w-full bg-black/80 text-white py-3 text-[10px] uppercase font-bold tracking-widest text-center">
                          Out of Stock
                        </div>
                      </div>
                    ) : isFashion ? (
                      <a
                        href={getWhatsAppUrl(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 left-4 right-4 bg-white/95 text-black py-3 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white"
                      >
                        <MessageCircle size={14} /> Enquire on WhatsApp
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddToBag(p)}
                        className="absolute bottom-4 left-4 right-4 bg-white/95 text-black py-3 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2 hover:bg-black hover:text-white"
                      >
                        <ShoppingBag size={14} /> Add to Bag
                      </button>
                    )}

                    {!outOfStock && typeof p.stock === "number" && p.stock > 0 && p.stock <= 3 && (
                      <div className="absolute bottom-3 left-3 bg-amber-800 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1">
                        Only {p.stock} left
                      </div>
                    )}
                  </div>

                  <div className="mt-auto space-y-1 text-center md:text-left">
                    <Link to={"/product/" + p.id} state={{ productIds: filteredProducts.map((prod) => prod.id) }}>
                      <h3 className="text-sm font-bold text-black group-hover:text-amber-800 transition-colors uppercase tracking-tight">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-[10px] uppercase text-black/40 tracking-widest">{p.type}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-black">{formatPrice(p.price)}</p>
                      {outOfStock && (
                        <span className="text-[9px] uppercase tracking-widest text-red-400 font-bold">Sold Out</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          productList={filteredProducts}
          onClose={() => setQuickViewProduct(null)}
          onNavigate={(p) => setQuickViewProduct(p)}
        />
      )}
    </Layout>
  );
};

export default Shop;