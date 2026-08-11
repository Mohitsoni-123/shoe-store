import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/stats");

        console.log("ADMIN STATS RESPONSE:", response.data);

        if (response.data.success) {
          setStats(response.data.stats || {});
          setRecentOrders(response.data.recentOrders || []);
        }
      } catch (error) {
        console.error("ADMIN STATS ERROR:", error);

        setError("Failed to load admin statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>

      <p>Welcome to ShoeStore Admin Panel 👋</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Main Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <h3>Total Products</h3>
          <h2>{stats.totalProducts || 0}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <h3>Total Users</h3>
          <h2>{stats.totalUsers || 0}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <h3>Total Orders</h3>
          <h2>{stats.totalOrders || 0}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <h3>Total Revenue</h3>
          <h2>₹{stats.totalRevenue || 0}</h2>
        </div>
      </div>

      {/* Order Status */}
      <h2 style={{ marginTop: "40px" }}>Order Status</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "15px",
        }}
      >
        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <h4>Pending</h4>
          <h2>{stats.pendingOrders || 0}</h2>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <h4>Confirmed</h4>
          <h2>{stats.confirmedOrders || 0}</h2>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <h4>Shipped</h4>
          <h2>{stats.shippedOrders || 0}</h2>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <h4>Delivered</h4>
          <h2>{stats.deliveredOrders || 0}</h2>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <h4>Cancelled</h4>
          <h2>{stats.cancelledOrders || 0}</h2>
        </div>
      </div>

      {/* Recent Orders */}
      <h2 style={{ marginTop: "40px" }}>Recent Orders</h2>

      {recentOrders.length === 0 ? (
        <p>No recent orders found.</p>
      ) : (
        <div>
          {recentOrders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
              }}
            >
              <h3>Order #{order._id?.slice(-6)}</h3>

              <p>Customer: {order.user?.name || "Unknown"}</p>

              <p>Email: {order.user?.email || "N/A"}</p>

              <p>Amount: ₹{order.totalAmount || 0}</p>

              <p>
                Status: <strong>{order.status}</strong>
              </p>

              <p>
                Date:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>

              <button
                onClick={() => navigate(`/admin/orders/${order._id}`)}
                style={{
                  marginTop: "10px",
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/admin/products")}
          style={{ marginRight: "15px" }}
        >
          Manage Products
        </button>

        <button
          onClick={() => navigate("/admin/users")}
          style={{ marginRight: "15px" }}
        >
          Manage Users
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          style={{ marginRight: "15px" }}
        >
          Manage Orders
        </button>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
