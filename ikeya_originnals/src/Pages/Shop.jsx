import { useState } from "react";
import Layout from "../Shared/Layout/Layout";
import { Filter, ShoppingBag } from "lucide-react";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Fashion", "Beauty"];

  const products = [
    // --- FASHION CATEGORY ---
    {
      id: 1,
      category: "Fashion",
      name: "Signature Silk Dress",
      price: "₦45,000",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 2,
      category: "Fashion",
      name: "Adire Two-Piece Set",
      price: "₦32,000",
      img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 3,
      category: "Fashion",
      name: "Minimal Linen Wear",
      price: "₦38,000",
      img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 4,
      category: "Fashion",
      name: "Classic Evening Gown",
      price: "₦65,000",
      img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 5,
      category: "Fashion",
      name: "Summer Kaftan",
      price: "₦28,000",
      img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 6,
      category: "Fashion",
      name: "Pleated Midi Skirt",
      price: "₦22,500",
      img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 7,
      category: "Fashion",
      name: "Luxe Wrap Top",
      price: "₦18,000",
      img: "https://images.unsplash.com/photo-1604176354204-926e737828ee?auto=format&fit=crop&q=75&w=1000",
    },
    {
      id: 8,
      category: "Fashion",
      name: "Boubou Elegance",
      price: "₦42,000",
      img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=75&w=1000",
    },

    // --- BEAUTY CATEGORY ---
    {
      id: 101,
      category: "Beauty",
      name: "Nourishing Growth Oil",
      price: "₦8,500",
      img: "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=75&w=800",
    },
    {
      id: 102,
      category: "Beauty",
      name: "Whipped Shea Hair Butter",
      price: "₦7,000",
      img: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=75&w=800",
    },
    {
      id: 103,
      category: "Beauty",
      name: "Hydrating Hair Mist",
      price: "₦5,500",
      img: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&q=75&w=800",
    },
    {
      id: 104,
      category: "Beauty",
      name: "Scalp Detox Scrub",
      price: "₦9,000",
      img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=75&w=800",
    },
    {
      id: 105,
      category: "Beauty",
      name: "Complete Hair Kit",
      price: "₦25,000",
      img: "https://images.unsplash.com/photo-1594125355635-32923ad44d27?auto=format&fit=crop&q=75&w=800",
    },
    {
      id: 106,
      category: "Beauty",
      name: "Satin Hair Bonnet",
      price: "₦4,500",
      img: "https://images.unsplash.com/photo-1634449571010-023595e5b7fe?auto=format&fit=crop&q=75&w=800",
    }
  ];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-plum mb-4 uppercase tracking-tighter">
            Ikeyà <span className="text-rosegold italic">Shop</span>
          </h1>
          <p className="text-plum/60 max-w-md mx-auto">
            From handcrafted garments to organic beauty rituals. Everything you need to glow.
          </p>
        </header>

        {/* --- FILTER BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-plum/10 pb-6 mb-10 gap-6">
          <div className="flex gap-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-[0.2em] font-bold transition-all ${
                  activeCategory === cat 
                    ? "text-rosegold border-b-2 border-rosegold" 
                    : "text-plum/40 hover:text-plum"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-plum/60 text-xs uppercase tracking-widest font-medium">
            <Filter size={14} className="text-rosegold" />
            {filteredProducts.length} Results
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
          {filteredProducts.map((p) => (
            <div key={p.id} className="group flex flex-col h-full">
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-plum/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* QUICK ADD BUTTON */}
                <button className="absolute bottom-4 left-4 right-4 bg-white/95 text-plum py-3 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-rosegold hover:text-white">
                  <ShoppingBag size={14} /> Add to Bag
                </button>
              </div>
              
              <div className="mt-auto space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-plum group-hover:text-rosegold transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[10px] uppercase text-plum/50 tracking-widest font-medium">
                      {p.category}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-plum">{p.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NO RESULTS FOUND */}
        {filteredProducts.length === 0 && (
          <div className="py-40 text-center">
            <h3 className="text-2xl font-display text-plum/30">No products found.</h3>
            <button 
              onClick={() => setActiveCategory("All")}
              className="mt-4 text-rosegold underline uppercase text-xs font-bold"
            >
              Back to all products
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shop;