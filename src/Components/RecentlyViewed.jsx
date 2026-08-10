import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatters";
import { getRecentlyViewed, RECENTLY_VIEWED_EVENT } from "../utils/recentlyViewed";
import WishlistHeart from "./WishlistHeart";

const RecentlyViewed = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = () => setItems(getRecentlyViewed());
    load();
    window.addEventListener(RECENTLY_VIEWED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(RECENTLY_VIEWED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto bg-white border-t border-neutral-100">
      <div className="mb-10">
        <span className="text-amber-800 uppercase tracking-[0.4em] text-[10px] font-bold mb-3 block">
          Pick Up Where You Left Off
        </span>
        <h2 className="text-2xl md:text-3xl font-display text-black font-bold uppercase tracking-tighter">
          Recently Viewed
        </h2>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
        {items.map((p) => {
          const outOfStock = typeof p.stock === "number" && p.stock <= 0;
          return (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group flex-shrink-0 w-40 sm:w-48 snap-start"
            >
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-3">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className={`w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 ${
                    outOfStock ? "opacity-50" : ""
                  }`}
                />
                <WishlistHeart
                  productId={p.id}
                  size={13}
                  className="absolute top-2 right-2 z-10"
                />
                {outOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <p className="text-white font-bold uppercase text-[9px]">
                      Out of Stock
                    </p>
                  </div>
                )}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-amber-800 transition-colors truncate">
                {p.name}
              </h3>
              <p className="text-amber-900 font-medium text-xs">
                {formatPrice(p.price)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecentlyViewed;