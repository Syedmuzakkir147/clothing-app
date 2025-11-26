import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import api from "../AxiosInstance/Api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart || []);
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  const addCart = async (product) => {
    try {
      console.log("Product added",product);
      const res = await api.post("/cart/add", {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      setCart(res.data.cart || []);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };


  const updateCart = async (productId, quantity) => {
    try {
      const res = await api.put("/cart/update", { productId, quantity });
      setCart(res.data.cart || []);
      console.log("Cart updated successfully:", { productId, quantity });
    } catch (err) {
      console.log("Update quantity failed:", err);
    }
  };

  const removeCart = async (productId) => {
    try {
      const res = await api.delete("/cart/remove", {
        data: { productId },
      });
      setCart(res.data.cart || []);
      console.log("Item removed successfully:", productId);
    } catch (err) {
      console.log("Remove item failed:", err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      setCart([]);
      console.log("Cart cleared successfully");
    } catch (err) {
      console.log("Clear cart failed:", err);
    }
  };

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) fetchCart();
    else setCart([]);
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addCart,
        updateCart,
        removeCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
