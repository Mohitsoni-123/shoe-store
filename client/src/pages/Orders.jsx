import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("MY ORDERS RESPONSE:", data);

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading orders...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <h3>No orders found</h3>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "25px",
              marginBottom: "20px",
            }}
          >
            <h2>Order #{order._id}</h2>

            <p>
              Status: <b>{order.status}</b>
            </p>

            <p>Payment: {order.paymentMethod}</p>

            <p>Payment Status: {order.paymentStatus}</p>

            <hr />

            {order.items.map((item, index) => (
              <div key={index}>
                <h3>{item.name}</h3>

                <p>Size: {item.size}</p>

                <p>Price: ₹{item.price}</p>

                <p>Quantity: {item.quantity}</p>

                <p>Subtotal: ₹{item.price * item.quantity}</p>
              </div>
            ))}

            <hr />

            <h2>Total: ₹{order.totalAmount}</h2>

            <p>
              Delivery Address: {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
