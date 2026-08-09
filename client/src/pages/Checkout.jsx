import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce((sum, item) => {
    const price = Number(
      item.product?.discountPrice ?? item.product?.price ?? 0,
    );

    const quantity = Number(item.quantity || 0);

    return sum + price * quantity;
  }, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          paymentMethod: "COD",
        }),
      });

      const data = await response.json();

      console.log("CREATE ORDER RESPONSE:", data);

      if (!data.success) {
        setError(data.message || "Failed to place order");
        return;
      }

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);

      setError("Something went wrong while placing order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Your cart is empty</h2>

        <button onClick={() => navigate("/products")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Checkout</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "30px",
        }}
      >
        {/* SHIPPING ADDRESS */}

        <div style={{ flex: 1 }}>
          <h2>Shipping Address</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <button type="submit" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}

        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            padding: "25px",
          }}
        >
          <h2>Order Summary</h2>

          {items.map((item) => {
            const price = Number(
              item.product?.discountPrice ?? item.product?.price ?? 0,
            );

            return (
              <div
                key={`${item.product._id}-${item.size}`}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "15px 0",
                }}
              >
                <h3>{item.product.name}</h3>

                <p>Size: {item.size}</p>

                <p>Price: ₹{price}</p>

                <p>Quantity: {item.quantity}</p>

                <p>Subtotal: ₹{price * Number(item.quantity)}</p>
              </div>
            );
          })}

          <h2>Total: ₹{total}</h2>

          <p>
            Payment Method: <b>Cash on Delivery</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
