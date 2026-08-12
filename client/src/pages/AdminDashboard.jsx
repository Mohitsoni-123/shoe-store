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

  // =========================
  // FETCH ADMIN STATS
  // =========================

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/stats");

      console.log("ADMIN STATS RESPONSE:", response.data);

      if (response.data.success) {
        setStats((prevStats) => ({
          ...prevStats,
          ...(response.data.stats || {}),
        }));

        setRecentOrders(response.data.recentOrders || []);
      } else {
        setError(response.data.message || "Failed to load admin statistics");
      }
    } catch (error) {
      console.error("ADMIN STATS ERROR:", error);

      setError(
        error.response?.data?.message || "Failed to load admin statistics",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>Admin Dashboard</h1>

          <p>Welcome to ShoeStore Admin Panel 👋</p>
        </div>

        <button onClick={fetchStats} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Stats"}
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <p
          style={{
            color: "red",
            marginTop: "20px",
          }}
        >
          {error}
        </p>
      )}

      {/* =========================
          MAIN STATISTICS
      ========================= */}

      <h2
        style={{
          marginTop: "35px",
        }}
      >
        Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* PRODUCTS */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Total Products</h3>

          <h2>{stats.totalProducts || 0}</h2>

          <button onClick={() => navigate("/admin/products")}>
            Manage Products
          </button>
        </div>

        {/* USERS */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Total Users</h3>

          <h2>{stats.totalUsers || 0}</h2>

          <button onClick={() => navigate("/admin/users")}>Manage Users</button>
        </div>

        {/* ORDERS */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Total Orders</h3>

          <h2>{stats.totalOrders || 0}</h2>

          <button onClick={() => navigate("/admin/orders")}>
            Manage Orders
          </button>
        </div>

        {/* REVENUE */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Total Revenue</h3>

          <h2>₹{stats.totalRevenue || 0}</h2>

          <p>Excluding cancelled orders</p>
        </div>
      </div>

      {/* =========================
          ORDER STATUS
      ========================= */}

      <h2
        style={{
          marginTop: "45px",
        }}
      >
        Order Status
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {/* PENDING */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h4>Pending</h4>

          <h2>{stats.pendingOrders || 0}</h2>
        </div>

        {/* CONFIRMED */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h4>Confirmed</h4>

          <h2>{stats.confirmedOrders || 0}</h2>
        </div>

        {/* SHIPPED */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h4>Shipped</h4>

          <h2>{stats.shippedOrders || 0}</h2>
        </div>

        {/* DELIVERED */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h4>Delivered</h4>

          <h2>{stats.deliveredOrders || 0}</h2>
        </div>

        {/* CANCELLED */}

        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h4>Cancelled</h4>

          <h2>{stats.cancelledOrders || 0}</h2>
        </div>
      </div>

      {/* =========================
          RECENT ORDERS
      ========================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "45px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <h2>Recent Orders</h2>

        <button onClick={() => navigate("/admin/orders")}>
          View All Orders
        </button>
      </div>

      {recentOrders.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "25px",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        >
          <p>No recent orders found.</p>
        </div>
      ) : (
        <div
          style={{
            marginTop: "20px",
          }}
        >
          {recentOrders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>Order #{order._id?.slice(-6)}</h3>

              <p>
                <strong>Customer:</strong> {order.user?.name || "Unknown"}
              </p>

              <p>
                <strong>Email:</strong> {order.user?.email || "N/A"}
              </p>

              <p>
                <strong>Amount:</strong> ₹{order.totalAmount || 0}
              </p>

              <p>
                <strong>Status:</strong> {order.status || "Pending"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>

              <select
                value={order.status || "Pending"}
                onChange={async (e) => {
                  const newStatus = e.target.value;

                  try {
                    await api.put(`/admin/orders/${order._id}/status`, {
                      status: newStatus,
                    });

                    setRecentOrders((prevOrders) =>
                      prevOrders.map((item) =>
                        item._id === order._id
                          ? {
                              ...item,
                              status: newStatus,
                            }
                          : item,
                      ),
                    );

                    fetchStats();
                  } catch (error) {
                    console.error("UPDATE STATUS ERROR:", error);

                    alert(
                      error.response?.data?.message ||
                        "Failed to update order status",
                    );
                  }
                }}
                style={{
                  padding: "8px",
                  marginRight: "10px",
                }}
              >
                <option value="Pending">Pending</option>

                <option value="Confirmed">Confirmed</option>

                <option value="Shipped">Shipped</option>

                <option value="Delivered">Delivered</option>

                <option value="Cancelled">Cancelled</option>
              </select>

              <button onClick={() => navigate(`/admin/orders/${order._id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <h2
        style={{
          marginTop: "45px",
        }}
      >
        Quick Actions
      </h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <button onClick={() => navigate("/admin/products/add")}>
          + Add Product
        </button>

        <button onClick={() => navigate("/admin/products")}>
          Manage Products
        </button>

        <button onClick={() => navigate("/admin/users")}>Manage Users</button>

        <button onClick={() => navigate("/admin/orders")}>Manage Orders</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
