import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "../Context/WishlistContext";

const WishlistHeart = ({ productId, size = 16, className = "" }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [popping, setPopping] = useState(false);
  const active = isWishlisted(productId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    setPopping(true);
    setTimeout(() => setPopping(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`relative flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm p-2 hover:bg-white transition-colors ${className}`}
    >
      <Heart
        size={size}
        className={`transition-all duration-300 ${
          active ? "fill-amber-800 text-amber-800" : "fill-none text-black/60"
        } ${popping ? "animate-heart-pop" : ""}`}
      />
      <style>{`
        @keyframes heart-pop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.5); }
          55%  { transform: scale(0.85); }
          75%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-heart-pop {
          animation: heart-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </button>
  );
};

export default WishlistHeart;