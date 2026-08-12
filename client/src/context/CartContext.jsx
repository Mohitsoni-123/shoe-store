import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const API_URL = "http://localhost:5000/api/cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(false);

  // ================================
  // GET CART
  // ================================
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCart({ items: [] });
        return;
      }

      setLoading(true);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      console.log("GET CART RESPONSE:", result);

      if (!response.ok || !result.success) {
        console.error("GET CART ERROR:", result.message);
        return;
      }

      setCart(result.cart || { items: [] });
    } catch (error) {
      console.error("FETCH CART ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // ADD TO CART
  // ================================
  const addToCart = async (productId, size, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return {
          success: false,
          message: "Please login first",
        };
      }

      if (!productId || !size) {
        return {
          success: false,
          message: "Product and size are required",
        };
      }

      const response = await fetch(`${API_URL}/add`, {
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

      const result = await response.json();

      console.log("ADD TO CART RESPONSE:", result);

      if (!response.ok || !result.success) {
        console.error("ADD TO CART ERROR:", result.message);

        return {
          success: false,
          message: result.message || "Failed to add product to cart",
        };
      }

      setCart(result.cart || { items: [] });

      return {
        success: true,
        message: result.message,
        cart: result.cart,
      };
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      return {
        success: false,
        message: "Failed to add product to cart",
      };
    }
  };

  // ================================
  // UPDATE CART ITEM
  // ================================
  const updateCartItem = async (
    productId,
    size,
    quantity
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");

        return {
          success: false,
          message: "Please login first",
        };
      }

      const response = await fetch(`${API_URL}/update`, {
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

      const result = await response.json();

      console.log("UPDATE CART RESPONSE:", result);

      if (!response.ok || !result.success) {
        console.error(
          "UPDATE CART ERROR:",
          result.message
        );

        return {
          success: false,
          message:
            result.message || "Failed to update cart",
        };
      }

      setCart(result.cart || { items: [] });

      return {
        success: true,
        message: result.message,
        cart: result.cart,
      };
    } catch (error) {
      console.error("UPDATE CART ERROR:", error);

      return {
        success: false,
        message: "Failed to update cart",
      };
    }
  };

  // ================================
  // REMOVE FROM CART
  // ================================
  const removeFromCart = async (
    productId,
    size
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");

        return {
          success: false,
          message: "Please login first",
        };
      }

      const response = await fetch(`${API_URL}/remove`, {
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

      const result = await response.json();

      console.log("REMOVE CART RESPONSE:", result);

      if (!response.ok || !result.success) {
        console.error(
          "REMOVE CART ERROR:",
          result.message
        );

        return {
          success: false,
          message:
            result.message || "Failed to remove item",
        };
      }

      setCart(result.cart || { items: [] });

      return {
        success: true,
        message: result.message,
        cart: result.cart,
      };
    } catch (error) {
      console.error("REMOVE CART ERROR:", error);

      return {
        success: false,
        message: "Failed to remove item",
      };
    }
  };

  // ================================
  // INCREASE QUANTITY
  // ================================
  const increaseQuantity = async (
    productId,
    size,
    currentQuantity
  ) => {
    return await updateCartItem(
      productId,
      size,
      Number(currentQuantity) + 1
    );
  };

  // ================================
  // DECREASE QUANTITY
  // ================================
  const decreaseQuantity = async (
    productId,
    size,
    currentQuantity
  ) => {
    const newQuantity =
      Number(currentQuantity) - 1;

    if (newQuantity <= 0) {
      return await removeFromCart(
        productId,
        size
      );
    }

    return await updateCartItem(
      productId,
      size,
      newQuantity
    );
  };

  // ================================
  // CART TOTAL
  // ================================
  const getCartTotal = () => {
    if (!cart?.items?.length) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      const price =
        Number(
          item.product?.discountPrice ||
            item.product?.price ||
            0
        );

      return (
        total +
        price * Number(item.quantity || 0)
      );
    }, 0);
  };

  // ================================
  // CART ITEM COUNT
  // ================================
  const getCartCount = () => {
    if (!cart?.items?.length) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  };

  // ================================
  // FETCH CART WHEN APP LOADS
  // ================================
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,

        fetchCart,

        addToCart,

        updateCartItem,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        getCartTotal,

        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ================================
// CUSTOM HOOK
// ================================
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};

export default CartContext;