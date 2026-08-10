import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatters";
import { getProducts } from "../services/productService";

const RelatedProducts = ({ currentProductId, type, limit = 4 }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchRelated = async () => {
      try {
        const res = await getProducts();
        const filtered = res.data
          .filter((p) => p.type === type && p.id !== currentProductId)
          .slice(0, limit);
        if (!cancelled) setRelated(filtered);
      } catch (err) {
        console.error("Related products fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRelated();
    return () => { cancelled = true; };
  }, [currentProductId, type, limit]);

  if (loading || related.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-neutral-100">
      <h2 className="text-2xl font-display font-bold uppercase tracking-tighter text-black mb-10">
        You Might Also <span className="text-amber-800 italic font-light">Like</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {related.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="group flex flex-col">
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-amber-800 transition-colors truncate">
              {p.name}
            </h3>
            <p className="text-xs text-amber-900 font-medium mt-1">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;