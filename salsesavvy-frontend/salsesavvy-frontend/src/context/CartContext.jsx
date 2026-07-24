import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ products: [], overall_total_price: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart/items");
      setCart(res.data.cart || { products: [], overall_total_price: 0 });
    } catch (e) {
      setCart({ products: [], overall_total_price: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    await api.post("/api/cart/add", { productId, quantity });
    await refreshCart();
  };

  const itemCount = cart.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, addToCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
