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
      const cartData = response.data;
      setCart(Array.isArray(cartData) ? cartData : []);
      
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToBag = async (productOrData, qty = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add items to your cart");
        return;
      }

      // Handle both formats:
      // addToBag(product) or addToBag({ productId, quantity })
      let productId, quantity;
      
      if (productOrData?.productId) {
        // Called as: addToBag({ productId: "123", quantity: 2 })
        productId = productOrData.productId;
        quantity = productOrData.quantity || 1;
      } else if (productOrData?.id) {
        // Called as: addToBag(product)
        productId = productOrData.id;
        quantity = qty;
      } else {
        console.error("Invalid product data:", productOrData);
        alert("Invalid product data");
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
        const errorMsg = err.response?.data?.message || "Failed to add item to cart. Please try again.";
        alert(errorMsg);
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
      if (Array.isArray(cart) && cart.length > 0) {
        await Promise.all(cart.map((item) => api.delete(`/cart/${item.id}`)));
      }
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const safeCart = Array.isArray(cart) ? cart : [];
  
  const cartCount = safeCart.reduce((sum, item) => {
    const qty = Number(item?.quantity) || 0;
    return sum + qty;
  }, 0);

  const cartTotal = safeCart.reduce((sum, item) => {
    const price = Number(item?.product?.price) || 0;
    const qty = Number(item?.quantity) || 0;
    return sum + (price * qty);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
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