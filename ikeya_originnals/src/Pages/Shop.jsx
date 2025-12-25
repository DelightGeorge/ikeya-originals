import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; 
import Layout from "../Shared/Layout/Layout";
import { Filter, ShoppingBag, Loader2, AlertCircle, X } from "lucide-react";
import { getProducts } from "../services/productService"; 
import { useCart } from "../Context/CartContext";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToBag } = useCart();
  const location = useLocation();

  // --- GET SEARCH QUERY FROM URL ---
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data); 
      } catch (err) {
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  // --- COMBINED FILTER LOGIC (Category + Search) ---
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || 
      p.category?.name === activeCategory || 
      p.type === activeCategory;
    
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description?.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Fashion", "Beauty"];

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-black mb-4 uppercase tracking-tighter">
            Ikeyà <span className="text-amber-800 italic">Collection</span>
          </h1>
          
          {/* Active Search Indicator */}
          {searchQuery && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Searching for:</span>
              <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold uppercase tracking-widest italic">"{searchQuery}"</span>
                <Link to="/shop" className="text-neutral-400 hover:text-black"><X size={12}/></Link>
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
                  activeCategory === cat ? "text-amber-800 border-b-2 border-amber-800" : "text-black/40 hover:text-black/80"
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-amber-900 mb-4" size={32} />
            <p className="text-[10px] uppercase tracking-widest text-black/40">Curating Collection...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <AlertCircle size={32} className="mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">No pieces found matching your criteria.</p>
            <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest border-b border-black mt-4 inline-block">View All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group flex flex-col h-full">
                <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-4">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  </Link>
                  <button 
                    onClick={() => addToBag(p)}
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
                    {p.category?.name || p.type}
                  </p>
                  <p className="text-sm font-bold text-black mt-1">
                    ₦{(p.price / (p.price > 100000 ? 1 : 1)).toLocaleString()}
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