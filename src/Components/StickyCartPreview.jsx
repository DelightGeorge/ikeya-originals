import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag, Check } from "lucide-react";
import { formatPrice } from "../utils/formatters";

const AUTO_HIDE_MS = 4500;

const StickyCartPreview = () => {
  const [visible, setVisible] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleAdd = (event) => {
      setLastItem(event.detail);
      setVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    };
    window.addEventListener("cartItemAdded", handleAdd);
    return () => {
      window.removeEventListener("cartItemAdded", handleAdd);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!lastItem) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[90] w-[320px] bg-white border border-neutral-200 shadow-2xl transition-all duration-500 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-[380px] opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between bg-black text-white px-4 py-2.5">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
          <Check size={12} className="text-green-400" /> Added to Bag
        </span>
        <button onClick={() => setVisible(false)} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>

      <div className="p-4 flex items-center gap-4">
        <img
          src={lastItem.product?.imageUrl}
          alt={lastItem.product?.name}
          className="w-16 h-16 object-cover bg-neutral-100 flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-tight text-black truncate">
            {lastItem.product?.name}
          </p>
          <p className="text-xs text-amber-900 font-medium mt-1">
            {formatPrice(lastItem.product?.price)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-neutral-100">
        <button
          onClick={() => setVisible(false)}
          className="py-3 text-[9px] font-bold uppercase tracking-widest text-neutral-500 hover:bg-neutral-50 transition-colors border-r border-neutral-100"
        >
          Continue Shopping
        </button>
        <Link
          to="/cart"
          onClick={() => setVisible(false)}
          className="py-3 text-[9px] font-bold uppercase tracking-widest text-white bg-black hover:bg-amber-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingBag size={12} /> View Bag
        </Link>
      </div>
    </div>
  );
};

export default StickyCartPreview;