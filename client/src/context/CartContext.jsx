import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
  });

  const token = localStorage.getItem("token");

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      if (!token) {
        setCart({ items: [] });
        return;
      }

      const response = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("FETCH CART RESPONSE:", data);

      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("FETCH CART ERROR:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async (productId, size, quantity = 1) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            size,
            quantity,
          }),
        }
      );

      const data = await response.json();

      console.log("ADD TO CART RESPONSE:", data);

      if (data.success) {
        setCart(data.cart);
        return true;
      }

      return false;
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      return false;
    }
  };

  // =========================
  // UPDATE CART ITEM
  // =========================
  const updateCartItem = async (
    productId,
    size,
    quantity
  ) => {
    try {
      console.log("UPDATE REQUEST:", {
        productId,
        size,
        quantity,
      });

      const response = await fetch(
        "http://localhost:5000/api/cart/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            size,
            quantity,
          }),
        }
      );

      const data = await response.json();

      console.log("UPDATE RESPONSE:", data);

      if (data.success) {
        setCart(data.cart);
        return true;
      }

      return false;
    } catch (error) {
      console.error("UPDATE CART ERROR:", error);
      return false;
    }
  };

  // =========================
  // REMOVE FROM CART
  // =========================
  const removeFromCart = async (productId, size) => {
    try {
      console.log("REMOVE REQUEST:", {
        productId,
        size,
      });

      const response = await fetch(
        "http://localhost:5000/api/cart/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            size,
          }),
        }
      );

      const data = await response.json();

      console.log("REMOVE RESPONSE:", data);

      if (data.success) {
        setCart(data.cart);
        return true;
      }

      return false;
    } catch (error) {
      console.error("REMOVE CART ERROR:", error);
      return false;
    }
  };

  // =========================
  // CONTEXT
  // =========================
  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// IMPORTANT
export const useCart = () => {
  return useContext(CartContext);
};