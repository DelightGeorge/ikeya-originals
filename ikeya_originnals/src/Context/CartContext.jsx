import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // ✅ ALWAYS initialize as empty array
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCart([]);
        setLoading(false);
        return;
      }

      const response = await api.get("/cart");
      
      // ✅ ALWAYS ensure we set an array
      const cartData = response.data;
      setCart(Array.isArray(cartData) ? cartData : []);
      
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]); // ✅ Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addToBag = async ({ productId, quantity = 1 }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add items to your cart");
        return;
      }

      console.log("🛒 Adding to cart:", { productId, quantity });

      const response = await api.post("/cart", { productId, quantity });
      
      console.log("✅ Cart response:", response.data);

      // Refresh cart after adding
      await fetchCart();
      
      alert("Item added to cart!");
      
      return response.data;
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      console.error("Error details:", err.response?.data);
      
      if (err.response?.status === 401) {
        alert("Please log in to add items to your cart");
      } else {
        alert("Failed to add item to cart. Please try again.");
      }
      throw err;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      await api.patch(`/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      // ✅ Safe check before mapping
      if (Array.isArray(cart) && cart.length > 0) {
        await Promise.all(cart.map((item) => api.delete(`/cart/${item.id}`)));
      }
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // ✅ TRIPLE SAFETY: Ensure cart is always an array before reduce
  const safeCart = Array.isArray(cart) ? cart : [];
  
  // ✅ Safe reduce with default values
  const cartCount = safeCart.reduce((sum, item) => {
    const qty = Number(item?.quantity) || 0;
    return sum + qty;
  }, 0);

  // ✅ Safe reduce for total price
  const cartTotal = safeCart.reduce((sum, item) => {
    const price = Number(item?.product?.price) || 0;
    const qty = Number(item?.quantity) || 0;
    return sum + (price * qty);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: safeCart, // ✅ Always provide the safe array
        loading,
        addToBag,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};