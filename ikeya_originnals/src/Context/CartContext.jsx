import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data) ? res.data : [];
      setCartItems(items);
      const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity);
    } catch (err) {
      console.error("Cart fetch error", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToBag = async (product) => {
    if (!token) {
      toast.error("Please login to shop", { style: { borderRadius: '0', background: '#000', color: '#fff', fontSize: '10px', letterSpacing: '0.1em' } });
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/cart",
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`${product.name.toUpperCase()} ADDED TO BAG`, {
        style: { borderRadius: '0', background: '#000', color: '#fff', fontSize: '10px', letterSpacing: '0.1em' }
      });
      
      fetchCart(); // This triggers the Navbar update
    } catch (err) {
      toast.error("COULD NOT ADD TO BAG");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToBag, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);