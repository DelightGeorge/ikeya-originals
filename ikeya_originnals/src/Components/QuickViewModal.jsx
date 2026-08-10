import { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, ShoppingBag, MessageCircle } from "lucide-react";
import { formatPrice } from "../utils/formatters";
import { useCart } from "../Context/CartContext";
import WishlistHeart from "./WishlistHeart";

function getWhatsAppUrl(product) {
  const msg = encodeURIComponent(
    "Hi! I'm interested in *" + product.name + "*. Could you help me with sizing, availability, and how to place an order?"
  );
  return "https://wa.me/+2349161270548?text=" + msg;
}

const QuickViewModal = ({ product, productList, onClose, onNavigate }) => {
  const { addToBag } = useCart();
  const list = productList || [];

  const currentIndex = product ? list.findIndex(function (p) { return p.id === product.id; }) : -1;
  const prevProduct = currentIndex > 0 ? list[currentIndex - 1] : null;
  const nextProduct = currentIndex >= 0 && currentIndex < list.length - 1 ? list[currentIndex + 1] : null;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prevProduct) onNavigate(prevProduct);
      if (e.key === "ArrowRight" && nextProduct) onNavigate(nextProduct);
    },
    [onClose, onNavigate, prevProduct, nextProduct]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!product) {
    return null;
  }

  const outOfStock = typeof product.stock === "number" && product.stock <= 0;
  const isFashion = product.type === "FASHION";

  const handleAddToBag = () => {
    addToBag({ productId: product.id, quantity: 1, product: product });
    window.dispatchEvent(new CustomEvent("cartItemAdded", { detail: { product: product } }));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in"
      onClick={onClose}
    >
      {prevProduct && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(prevProduct);
          }}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Previous product"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <div
        className="relative bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto grid md:grid-cols-2 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/80 text-white p-2 hover:bg-black transition-colors"
          aria-label="Close quick view"
        >
          <X size={16} />
        </button>

        <div className="relative aspect-[3/4] bg-neutral-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={"w-full h-full object-cover" + (outOfStock ? " opacity-50 grayscale-[40%]" : "")}
          />
          <WishlistHeart productId={product.id} className="absolute top-4 left-4" />
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <p className="text-white font-bold uppercase text-xs tracking-widest">Out of Stock</p>
            </div>
          )}
        </div>

        <div className="p-8 flex flex-col">
          <p className="text-[10px] uppercase tracking-widest text-amber-800 font-bold mb-2">
            {product.type}
          </p>
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-3">
            {product.name}
          </h2>
          <p className="text-xl text-amber-900 font-medium mb-4">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 line-clamp-4">
              {product.description}
            </p>
          )}

          {!outOfStock && typeof product.stock === "number" && product.stock <= 3 && (
            <p className="text-[10px] text-amber-700 font-bold uppercase mb-4">
              Only {product.stock} left
            </p>
          )}

          <div className="mt-auto flex flex-col gap-3">
            {isFashion ? (
              <a
                href={getWhatsAppUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-black text-white py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={14} /> Enquire on WhatsApp
              </a>
            ) : (
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={outOfStock}
                className={
                  "w-full py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors " +
                  (outOfStock ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" : "bg-black text-white hover:bg-amber-800")
                }
              >
                <ShoppingBag size={14} /> {outOfStock ? "Out of Stock" : "Add to Bag"}
              </button>
            )}
            <Link
              to={"/product/" + product.id}
              state={{ productIds: list.map(function (p) { return p.id; }) }}
              className="w-full text-center border border-black/20 text-black py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-black transition-colors"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>

      {nextProduct && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(nextProduct);
          }}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Next product"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <style>{
        "@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }" +
        "@keyframes scale-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }" +
        ".animate-fade-in { animation: fade-in 0.2s ease-out; }" +
        ".animate-scale-in { animation: scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1); }"
      }</style>
    </div>
  );
};

export default QuickViewModal;