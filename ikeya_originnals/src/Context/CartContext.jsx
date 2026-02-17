import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateGuestItemId = () =>
  `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getGuestCart = () => {
  try {
    const cart = localStorage.getItem("guestCart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (cart) => {
  try {
    localStorage.setItem("guestCart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving guest cart:", error);
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  // ── Watch localStorage token so cart reacts when user logs in/out ──
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Poll for token changes (handles login/logout from AuthContext)
  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem("token");
      setToken((prev) => (prev !== current ? current : prev));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Re-fetch cart whenever token changes
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ─── fetchCart ──────────────────────────────────────────────────────────────

  const fetchCart = async () => {
    setLoading(true);
    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        // Not logged in — use guest cart
        setCart(getGuestCart());
        setIsGuest(true);
        return;
      }

      // Logged in — fetch from backend
      setIsGuest(false);
      const response = await api.get("/cart");
      const cartData = response.data;
      setCart(Array.isArray(cartData) ? cartData : []);

      // Merge any guest items
      await mergeGuestCart();
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (err.response?.status === 401) {
        // Token invalid — treat as guest
        setCart(getGuestCart());
        setIsGuest(true);
      } else {
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── mergeGuestCart ─────────────────────────────────────────────────────────

  const mergeGuestCart = async () => {
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;

    try {
      for (const item of guestCart) {
        await api.post("/cart", {
          productId: item.product.id,
          quantity: item.quantity,
        });
      }
      localStorage.removeItem("guestCart");

      const response = await api.get("/cart");
      setCart(Array.isArray(response.data) ? response.data : []);
      toast.success("Your cart has been updated!");
    } catch (err) {
      console.error("Error merging guest cart:", err);
    }
  };

  // ─── addToBag ───────────────────────────────────────────────────────────────

  const addToBag = async (productOrData, qty = 1) => {
    try {
      const currentToken = localStorage.getItem("token");

      let productId, quantity, product;

      if (productOrData?.productId) {
        productId = productOrData.productId;
        quantity  = productOrData.quantity || 1;
        product   = productOrData.product;
      } else if (productOrData?.id) {
        productId = productOrData.id;
        quantity  = qty;
        product   = productOrData;
      } else {
        toast.error("Invalid product data");
        return;
      }

      // GUEST
      if (!currentToken) {
        const guestCart = getGuestCart();
        const existingIndex = guestCart.findIndex(
          (item) => item.product?.id === productId
        );

        if (existingIndex !== -1) {
          guestCart[existingIndex].quantity += quantity;
          toast.success("Cart updated!");
        } else {
          if (!product) { toast.error("Product information missing"); return; }
          guestCart.push({ id: generateGuestItemId(), productId, quantity, product });
          toast.success("Item added to cart!");
        }

        saveGuestCart(guestCart);
        setCart(guestCart);
        return guestCart;
      }

      // AUTHENTICATED
      await api.post("/cart", { productId, quantity });
      await fetchCart();
      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 401) {
        toast.error("Please log in to sync your cart");
      } else {
        toast.error(err.response?.data?.message || "Failed to add item to cart");
      }
      throw err;
    }
  };

  // ─── updateQuantity ─────────────────────────────────────────────────────────

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) { await removeFromCart(itemId); return; }

      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        const guestCart = getGuestCart();
        const idx = guestCart.findIndex((item) => item.id === itemId);
        if (idx !== -1) {
          guestCart[idx].quantity = quantity;
          saveGuestCart(guestCart);
          setCart(guestCart);
        }
        return;
      }

      await api.patch(`/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  // ─── removeFromCart ─────────────────────────────────────────────────────────

  const removeFromCart = async (itemId) => {
    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        const updated = getGuestCart().filter((item) => item.id !== itemId);
        saveGuestCart(updated);
        setCart(updated);
        toast.success("Item removed");
        return;
      }

      await api.delete(`/cart/${itemId}`);
      await fetchCart();
      toast.success("Item removed");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  // ─── clearCart ──────────────────────────────────────────────────────────────

  const clearCart = async () => {
    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        localStorage.removeItem("guestCart");
        setCart([]);
        return;
      }

      if (cart.length > 0) {
        await Promise.all(cart.map((item) => api.delete(`/cart/${item.id}`)));
      }
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // ─── Derived values ─────────────────────────────────────────────────────────

  const safeCart = Array.isArray(cart) ? cart : [];

  const cartCount = safeCart.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0),
    0
  );

  const cartTotal = safeCart.reduce((sum, item) => {
    const price = Number(item?.product?.price) || 0;
    const qty   = Number(item?.quantity)       || 0;
    return sum + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
        loading,
        isGuest,
        addToBag,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        mergeGuestCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
