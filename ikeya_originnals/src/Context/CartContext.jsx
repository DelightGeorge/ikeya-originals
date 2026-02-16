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

// Helper: Generate unique ID for guest cart items
const generateGuestItemId = () => `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper: Get guest cart from localStorage
const getGuestCart = () => {
  try {
    const cart = localStorage.getItem("guestCart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading guest cart:", error);
    return [];
  }
};

// Helper: Save guest cart to localStorage
const saveGuestCart = (cart) => {
  try {
    localStorage.setItem("guestCart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving guest cart:", error);
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        // User is not logged in - load guest cart
        const guestCart = getGuestCart();
        setCart(guestCart);
        setIsGuest(true);
        setLoading(false);
        return;
      }

      // User is logged in - fetch from backend
      setIsGuest(false);
      const response = await api.get("/cart");
      const cartData = response.data;
      setCart(Array.isArray(cartData) ? cartData : []);
      
      // Merge any guest cart items
      await mergeGuestCart();
      
    } catch (err) {
      console.error("Error fetching cart:", err);
      
      // If auth fails, fall back to guest cart
      if (err.response?.status === 401) {
        const guestCart = getGuestCart();
        setCart(guestCart);
        setIsGuest(true);
      } else {
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Merge guest cart into user cart when logging in
  const mergeGuestCart = async () => {
    const guestCart = getGuestCart();
    
    if (guestCart.length === 0) return;

    try {
      // Add each guest cart item to the user's cart
      for (const item of guestCart) {
        await api.post("/cart", {
          productId: item.product.id,
          quantity: item.quantity,
        });
      }
      
      // Clear guest cart after merging
      localStorage.removeItem("guestCart");
      
      // Refresh cart from backend
      const response = await api.get("/cart");
      const cartData = response.data;
      setCart(Array.isArray(cartData) ? cartData : []);
      
      toast.success("Your cart has been updated!");
    } catch (err) {
      console.error("Error merging guest cart:", err);
    }
  };

  const addToBag = async (productOrData, qty = 1) => {
    try {
      const token = localStorage.getItem("token");

      // Handle both formats:
      // addToBag(product) or addToBag({ productId, quantity })
      let productId, quantity, product;
      
      if (productOrData?.productId) {
        // Called as: addToBag({ productId: "123", quantity: 2 })
        productId = productOrData.productId;
        quantity = productOrData.quantity || 1;
        product = productOrData.product; // May be undefined
      } else if (productOrData?.id) {
        // Called as: addToBag(product)
        productId = productOrData.id;
        quantity = qty;
        product = productOrData;
      } else {
        console.error("Invalid product data:", productOrData);
        toast.error("Invalid product data");
        return;
      }

      console.log("🛒 Adding to cart:", { productId, quantity, isGuest: !token });

      // GUEST CART LOGIC
      if (!token) {
        const guestCart = getGuestCart();
        
        // Check if item already exists
        const existingIndex = guestCart.findIndex(
          item => item.product?.id === productId
        );

        if (existingIndex !== -1) {
          // Update quantity
          guestCart[existingIndex].quantity += quantity;
          toast.success("Cart updated!");
        } else {
          // Add new item
          if (!product) {
            toast.error("Product information missing");
            return;
          }
          
          guestCart.push({
            id: generateGuestItemId(),
            productId,
            quantity,
            product,
          });
          toast.success("Item added to cart!");
        }

        saveGuestCart(guestCart);
        setCart(guestCart);
        return guestCart;
      }

      // AUTHENTICATED USER LOGIC
      const response = await api.post("/cart", { productId, quantity });
      
      console.log("✅ Cart response:", response.data);

      // Refresh cart after adding
      await fetchCart();
      
      toast.success("Item added to cart!");
      
      return response.data;
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      console.error("Error details:", err.response?.data);
      
      if (err.response?.status === 401) {
        toast.error("Please log in to sync your cart");
      } else {
        const errorMsg = err.response?.data?.message || "Failed to add item to cart. Please try again.";
        toast.error(errorMsg);
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

      const token = localStorage.getItem("token");

      // GUEST CART LOGIC
      if (!token) {
        const guestCart = getGuestCart();
        const itemIndex = guestCart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
          guestCart[itemIndex].quantity = quantity;
          saveGuestCart(guestCart);
          setCart(guestCart);
        }
        return;
      }

      // AUTHENTICATED USER LOGIC
      await api.patch(`/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");

      // GUEST CART LOGIC
      if (!token) {
        const guestCart = getGuestCart();
        const updatedCart = guestCart.filter(item => item.id !== itemId);
        saveGuestCart(updatedCart);
        setCart(updatedCart);
        toast.success("Item removed from cart");
        return;
      }

      // AUTHENTICATED USER LOGIC
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");

      // GUEST CART LOGIC
      if (!token) {
        localStorage.removeItem("guestCart");
        setCart([]);
        return;
      }

      // AUTHENTICATED USER LOGIC
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
