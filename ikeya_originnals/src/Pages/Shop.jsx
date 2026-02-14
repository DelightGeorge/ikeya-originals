import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";

import { formatPrice } from "../utils/formatters";
import { PRODUCT_TYPES } from "../constants/products";
import { Filter, ShoppingBag, AlertCircle, X } from "lucide-react";
import { getProducts } from "../services/productService";
import { useCart } from "../Context/CartContext";
import LoadingScreen from "../components/LoadingScreen";

const Shop = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const typeQuery = searchParams.get("type") || PRODUCT_TYPES.ALL;

  const [activeCategory, setActiveCategory] = useState(typeQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === PRODUCT_TYPES.ALL || p.type === activeCategory;

      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const categories = [
    PRODUCT_TYPES.ALL,
    PRODUCT_TYPES.FASHION,
    PRODUCT_TYPES.BEAUTY,
  ];

  if (loading) {
    return (
      <Layout>
        <LoadingScreen message="Curating Collection..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-black mb-4 uppercase tracking-tighter">
            Ikeyà <span className="text-amber-800 italic">Collection</span>
          </h1>

          {searchQuery && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Searching for:
              </span>
              <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold uppercase tracking-widest italic">
                  "{searchQuery}"
                </span>
                <Link to="/shop" className="text-neutral-400 hover:text-black">
                  <X size={12} />
                </Link>
              </div>
            </div>
          )}
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center border-b border-neutral-100 pb-6 mb-10 gap-6">
          <div className="flex gap-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-[0.2em] font-bold transition-all ${
                  activeCategory === cat
                    ? "text-amber-800 border-b-2 border-amber-800"
                    : "text-black/40 hover:text-black/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-black/60 text-xs uppercase tracking-widest font-medium">
            <Filter size={14} className="text-amber-800" />
            {filteredProducts.length} Results
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle size={32} className="mb-4 text-red-400" />
            <p className="text-sm text-red-400 mb-6 text-center max-w-md">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-amber-800 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-neutral-400 uppercase tracking-widest text-xs font-bold mb-6">
              {searchQuery
                ? `No products found matching "${searchQuery}"`
                : "No products in this category yet"}
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
            {filteredProducts.map((p) => (
              <div key={p.id} className="group flex flex-col h-full">
                <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-4">
                  <Link to={`/product/${p.id}`}>
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </Link>

                  <button
                    onClick={() => addToBag({ productId: p.id, quantity: 1 })}
                    className="absolute bottom-4 left-4 right-4 bg-white/95 text-black py-3 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2 hover:bg-black hover:text-white"
                  >
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                </div>

                <div className="mt-auto space-y-2 text-center md:text-left">
                  <Link to={`/product/${p.id}`}>
                    <h3 className="text-sm font-bold text-black group-hover:text-amber-800 transition-colors uppercase tracking-tight">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-[10px] uppercase text-black/50 tracking-widest">
                    {p.type}
                  </p>
                  <p className="text-sm font-bold text-black mt-1">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
