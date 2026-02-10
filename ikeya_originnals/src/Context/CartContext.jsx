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
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart on mount
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
      // Ensure we always set an array
      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]); // Set empty array on error
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
      
      // Optional: Show success feedback
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
      // Remove each item
      if (cart && cart.length > 0) {
        await Promise.all(cart.map((item) => api.delete(`/cart/${item.id}`)));
      }
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // FIXED: Always ensure cart is an array before using reduce
  const cartCount = (cart && Array.isArray(cart)) 
    ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  const cartTotal = (cart && Array.isArray(cart))
    ? cart.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 0)), 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart: cart || [], // Always provide an array
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
