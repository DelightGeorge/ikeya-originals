import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get("/cart");
      const items = Array.isArray(res.data) ? res.data : [];
      setCartItems(items);
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch (err) {
      console.error("Fetch cart failed");
    }
  };

  const addToBag = async (productId, quantity = 1) => {
    if (!token) return toast.error("Please login");

    try {
      await api.post("/cart", { productId, quantity });
      toast.success("Added to bag");
      fetchCart();
    } catch (err) {
      toast.error("Could not add to bag");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.patch(`/cart/${itemId}`, { quantity });
      fetchCart();
    } catch {
      toast.error("Could not update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      toast.success("Removed from bag");
      fetchCart();
    } catch {
      toast.error("Could not remove item");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToBag,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
