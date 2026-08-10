import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../Shared/Layout/Layout";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import { getProducts } from "../services/productService";
import { formatPrice } from "../utils/formatters";
import { Heart, ShoppingBag, MessageCircle, Loader2 } from "lucide-react";
import WishlistHeart from "../Components/WishlistHeart";

const Wishlist = () => {
  const { wishlistIds } = useWishlist();
  const { addToBag } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.content ?? res.data?.products ?? []);
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching products for wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const wishlistedProducts = allProducts.filter((p) =>
    wishlistIds.includes(p.id),
  );

  const getWhatsAppUrl = (product) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in *${product.name}*. Could you help me with sizing, availability, and how to place an order?`,
    );
    return `https://wa.me/+2349161270548?text=${msg}`;
  };

  const handleAddToBag = (product) => {
    addToBag({ productId: product.id, quantity: 1, product });
    window.dispatchEvent(new CustomEvent("cartItemAdded", { detail: { product } }));
  };

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <span className="text-amber-800 uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">
            Saved For Later
          </span>
          <h1 className="text-5xl md:text-6xl font-display text-black mb-4 uppercase tracking-tighter font-bold">
            Your <span className="text-amber-800 italic font-light">Wishlist</span>
          </h1>
        </header>

        {loading ? (
          <div className="h-[40vh] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-amber-900 mb-4" size={28} />
            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold">
              Loading Wishlist
            </p>
          </div>
        ) : wishlistedProducts.length === 0 ? (
          <div className="py-20 text-center">
            <Heart size={32} className="mx-auto mb-6 text-neutral-200" />
            <p className="text-neutral-400 uppercase tracking-widest text-xs font-bold mb-6">
              Your wishlist is empty
            </p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-amber-800 transition-all"
            >
              Browse The Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {wishlistedProducts.map((p) => {
              const outOfStock = typeof p.stock === "number" && p.stock <= 0;
              const isFashion = p.type === "FASHION";
              return (
                <div key={p.id} className="group flex flex-col h-full">
                  <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-4">
                    <Link to={`/product/${p.id}`}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${
                          outOfStock ? "grayscale-[60%] opacity-70" : ""
                        }`}
                      />
                    </Link>
                    <WishlistHeart
                      productId={p.id}
                      className="absolute top-3 right-3 z-10"
                    />
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
                  </div>

                  <div className="mt-auto space-y-1 text-center md:text-left">
                    <Link to={`/product/${p.id}`}>
                      <h3 className="text-sm font-bold text-black group-hover:text-amber-800 transition-colors uppercase tracking-tight">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-[10px] uppercase text-black/40 tracking-widest">{p.type}</p>
                    <p className="text-sm font-bold text-black">{formatPrice(p.price)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;