import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];

  // Increase quantity
  const increaseQuantity = async (item) => {
    if (!item.product) return;

    const currentQuantity = Number(item.quantity || 1);

    await updateCartItem(
      item.product._id,
      item.size,
      currentQuantity + 1
    );
  };

  // Decrease quantity
  const decreaseQuantity = async (item) => {
    if (!item.product) return;

    const currentQuantity = Number(item.quantity || 1);
    const newQuantity = currentQuantity - 1;

    if (newQuantity <= 0) {
      await removeFromCart(
        item.product._id,
        item.size
      );
      return;
    }

    await updateCartItem(
      item.product._id,
      item.size,
      newQuantity
    );
  };

  // Remove item
  const removeItem = async (item) => {
    if (!item.product) return;

    await removeFromCart(
      item.product._id,
      item.size
    );
  };

  // Only valid products
  const validItems = items.filter(
    (item) => item.product
  );

  // Calculate total
  const total = validItems.reduce((sum, item) => {
    const price = Number(
      item.product?.discountPrice ??
        item.product?.price ??
        0
    );

    const quantity = Number(
      item.quantity || 0
    );

    return sum + price * quantity;
  }, 0);

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1>Your Cart</h1>

      {/* Empty Cart */}
      {validItems.length === 0 ? (
        <h3>Your cart is empty</h3>
      ) : (
        <>
          {/* Cart Items */}
          {validItems.map((item) => {
            const price = Number(
              item.product?.discountPrice ??
                item.product?.price ??
                0
            );

            const quantity = Number(
              item.quantity || 1
            );

            return (
              <div
                key={`${item.product._id}-${item.size}`}
                style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                }}
              >
                <h2>
                  {item.product?.name}
                </h2>

                <p>
                  Price: ₹{price}
                </p>

                <p>
                  Size: {item.size}
                </p>

                <p>
                  Quantity: {quantity}
                </p>

                {/* Quantity Controls */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item)
                    }
                  >
                    -
                  </button>

                  <span
                    style={{
                      fontWeight: "bold",
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item)
                    }
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() =>
                    removeItem(item)
                  }
                  style={{
                    marginTop: "15px",
                    color: "red",
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}

          {/* Total */}
          <hr />

          <h2>
            Total: ₹{total}
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/checkout")
            }
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;