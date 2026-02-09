import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get("/cart");
      const items = res.data || [];
      setCartItems(items);
      setCartCount(items.reduce((a, i) => a + i.quantity, 0));
    } catch (err) {
      setCartItems([]);
      setCartCount(0);
    }
  };

  const addToBag = async ({ productId, quantity }) => {
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
    if (!token) return;

    try {
      await api.patch(`/cart/${itemId}`, { quantity });
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    } catch (err) {
      toast.error("Could not update quantity");
    }
  };

  const removeItem = async (itemId) => {
    if (!token) return;

    try {
      await api.delete(`/cart/${itemId}`);
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Removed from bag");
    } catch (err) {
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
        fetchCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
