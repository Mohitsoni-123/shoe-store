import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("ADMIN ORDERS RESPONSE:", data);

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("FETCH ADMIN ORDERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      console.log("UPDATE ORDER RESPONSE:", data);

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? data.order : order,
          ),
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
    }
  };

  if (loading) {
    return <h2>Loading orders...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Orders</h1>

      {orders.length === 0 ? (
        <h3>No orders found</h3>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h2>Order #{order._id.slice(-6)}</h2>

            <p>Customer: {order.user?.name || "Unknown"}</p>

            <p>Email: {order.user?.email || "N/A"}</p>

            <p>Total: ₹{order.totalAmount}</p>

            <p>
              Current Status: <strong>{order.status}</strong>
            </p>

            <h3>Products</h3>

            {order.items?.map((item, index) => (
              <div key={index}>
                <p>
                  {item.product?.name} × {item.quantity}
                </p>

                <p>Size: {item.size}</p>
              </div>
            ))}

            <label>Update Status:</label>

            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
              }}
            >
              <option value="Pending">Pending</option>

              <option value="Confirmed">Confirmed</option>

              <option value="Shipped">Shipped</option>

              <option value="Delivered">Delivered</option>

              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
