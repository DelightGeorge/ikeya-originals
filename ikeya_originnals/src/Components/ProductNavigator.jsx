// components/ProductNavigator.jsx
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * productIds: ordered array of ids from whatever list the user arrived from
 * currentId: the id of the product currently being viewed
 */
const ProductNavigator = ({ productIds = [], currentId, className = "" }) => {
  const navigate = useNavigate();
  const currentIndex = productIds.indexOf(currentId);
  const prevId = currentIndex > 0 ? productIds[currentIndex - 1] : null;
  const nextId =
    currentIndex >= 0 && currentIndex < productIds.length - 1
      ? productIds[currentIndex + 1]
      : null;

  const goTo = useCallback(
    (id) => {
      if (!id) return;
      navigate(`/product/${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate],
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goTo(prevId);
      if (e.key === "ArrowRight") goTo(nextId);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prevId, nextId, goTo]);

  if (productIds.length <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => goTo(prevId)}
        disabled={!prevId}
        className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-black/60 transition-colors"
      >
        <ChevronLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Previous
      </button>

      <span className="text-[9px] uppercase tracking-widest text-neutral-300 font-bold">
        {currentIndex + 1} / {productIds.length}
      </span>

      <button
        onClick={() => goTo(nextId)}
        disabled={!nextId}
        className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-black/60 transition-colors"
      >
        Next
        <ChevronRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
};

export default ProductNavigator;