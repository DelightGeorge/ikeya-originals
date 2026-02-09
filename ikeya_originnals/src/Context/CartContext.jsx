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

    const res = await api.get("/cart");
    const items = res.data || [];
    setCartItems(items);
    setCartCount(items.reduce((a, i) => a + i.quantity, 0));
  };

  const addToBag = async (product) => {
    if (!token) return toast.error("Please login");

    await api.post("/cart", { productId: product.id, quantity: 1 });
    toast.success("Added to bag");
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToBag }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
