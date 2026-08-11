import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ALL ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders");

      console.log("ADMIN ORDERS RESPONSE:", response.data);

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("GET ADMIN ORDERS ERROR:", error);

      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      console.log("UPDATE STATUS RESPONSE:", response.data);

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order,
          ),
        );

        alert("Order status updated successfully");
      }
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);

      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Manage Orders</h1>

      <p>
        Total Orders: <strong>{orders.length}</strong>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* EMPTY ORDERS */}

      {orders.length === 0 ? (
        <h3>No orders found.</h3>
      ) : (
        <div style={{ marginTop: "30px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              {/* ORDER ID */}

              <h2>Order #{order._id?.slice(-6)}</h2>

              {/* CUSTOMER */}

              <p>
                <strong>Customer:</strong> {order.user?.name || "Unknown"}
              </p>

              <p>
                <strong>Email:</strong> {order.user?.email || "N/A"}
              </p>

              {/* AMOUNT */}

              <p>
                <strong>Total Amount:</strong> ₹{order.totalAmount || 0}
              </p>

              {/* DATE */}

              <p>
                <strong>Order Date:</strong>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* STATUS */}

              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <label>
                  <strong>Status: </strong>
                </label>

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  style={{
                    padding: "8px",
                    marginLeft: "10px",
                  }}
                >
                  <option value="Pending">Pending</option>

                  <option value="Confirmed">Confirmed</option>

                  <option value="Shipped">Shipped</option>

                  <option value="Delivered">Delivered</option>

                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/admin/orders/${order._id}`)}
                style={{
                  marginTop: "15px",
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* BACK BUTTON */}

      <div style={{ marginTop: "30px" }}>
        <button onClick={() => navigate("/admin")}>
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
