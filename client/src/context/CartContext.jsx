import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
  });

  // Always get latest token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      const token = getToken();

      if (!token) {
        setCart({ items: [] });
        return;
      }

      const response = await fetch("http://localhost:5000/api/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("FETCH CART RESPONSE:", data);

      if (data.success) {
        setCart(data.cart);
      } else {
        setCart({ items: [] });
      }
    } catch (error) {
      console.error("FETCH CART ERROR:", error);
      setCart({ items: [] });
    }
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async (productId, size, quantity = 1) => {
    try {
      const token = getToken();

      if (!token) {
        console.error("No token found");
        return false;
      }

      const response = await fetch("http://localhost:5000/api/cart/add", {
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
      });

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
  // UPDATE CART
  // =========================
  const updateCartItem = async (productId, size, quantity) => {
    try {
      const token = getToken();

      if (!token) {
        console.error("No token found");
        return false;
      }

      const response = await fetch("http://localhost:5000/api/cart/update", {
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
      });

      const data = await response.json();

      console.log("UPDATE CART RESPONSE:", data);

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
      const token = getToken();

      if (!token) {
        console.error("No token found");
        return false;
      }

      const response = await fetch("http://localhost:5000/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          size,
        }),
      });

      const data = await response.json();

      console.log("REMOVE CART RESPONSE:", data);

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
  // INITIAL CART
  // =========================
  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // LOGIN / LOGOUT LISTENER
  // =========================
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("AUTH CHANGED - FETCHING CART");

      fetchCart();
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

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

export const useCart = () => {
  return useContext(CartContext);
};
