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
          setStats({
            totalProducts: response.data.stats?.totalProducts || 0,
            totalUsers: response.data.stats?.totalUsers || 0,
            totalOrders: response.data.stats?.totalOrders || 0,
            totalRevenue: response.data.stats?.totalRevenue || 0,
            pendingOrders: response.data.stats?.pendingOrders || 0,
            confirmedOrders: response.data.stats?.confirmedOrders || 0,
            shippedOrders: response.data.stats?.shippedOrders || 0,
            deliveredOrders: response.data.stats?.deliveredOrders || 0,
            cancelledOrders: response.data.stats?.cancelledOrders || 0,
          });

          setRecentOrders(response.data.recentOrders || []);
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
      }}
    >
      {/* ================= SIDEBAR ================= */}

      <aside
        style={{
          width: "230px",
          background: "#111827",
          color: "white",
          padding: "25px 15px",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          👟 ShoeStore
        </h2>

        <button onClick={() => navigate("/admin")} style={sidebarButton}>
          📊 Dashboard
        </button>

        <button
          onClick={() => navigate("/admin/products")}
          style={sidebarButton}
        >
          👟 Products
        </button>

        <button onClick={() => navigate("/admin/orders")} style={sidebarButton}>
          📦 Orders
        </button>

        <button onClick={() => navigate("/admin/users")} style={sidebarButton}>
          👥 Users
        </button>

        <button onClick={() => navigate("/products")} style={sidebarButton}>
          🛍️ View Store
        </button>

        <button
          onClick={handleLogout}
          style={{
            ...sidebarButton,
            marginTop: "30px",
            background: "#dc2626",
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main
        style={{
          flex: 1,
          padding: "30px",
          overflowX: "auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Admin Dashboard</h1>

            <p style={{ color: "#6b7280" }}>
              Welcome back to ShoeStore Admin Panel 👋
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/products/add")}
            style={{
              padding: "12px 18px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
            }}
          >
            + Add Product
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* ================= STATISTICS ================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="👟"
          />

          <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />

          <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" />

          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue}`}
            icon="💰"
          />
        </div>

        {/* ================= ORDER STATUS ================= */}

        <h2 style={{ marginTop: "40px" }}>Order Status</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "15px",
          }}
        >
          <StatusCard title="Pending" value={stats.pendingOrders} />

          <StatusCard title="Confirmed" value={stats.confirmedOrders} />

          <StatusCard title="Shipped" value={stats.shippedOrders} />

          <StatusCard title="Delivered" value={stats.deliveredOrders} />

          <StatusCard title="Cancelled" value={stats.cancelledOrders} />
        </div>

        {/* ================= RECENT ORDERS ================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "40px",
          }}
        >
          <h2>Recent Orders</h2>

          <button
            onClick={() => navigate("/admin/orders")}
            style={{
              padding: "8px 14px",
              border: "1px solid #2563eb",
              background: "white",
              color: "#2563eb",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            View All
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p>No recent orders found.</p>
          </div>
        ) : (
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              overflowX: "auto",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "700px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f9fafb",
                    textAlign: "left",
                  }}
                >
                  <th style={tableHeader}>Order</th>
                  <th style={tableHeader}>Customer</th>
                  <th style={tableHeader}>Amount</th>
                  <th style={tableHeader}>Status</th>
                  <th style={tableHeader}>Date</th>
                  <th style={tableHeader}>Action</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={tableCell}>#{order._id?.slice(-6)}</td>

                    <td style={tableCell}>
                      <strong>{order.user?.name || "Unknown"}</strong>
                      <br />
                      <small>{order.user?.email || "N/A"}</small>
                    </td>

                    <td style={tableCell}>₹{order.totalAmount || 0}</td>

                    <td style={tableCell}>
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: "20px",
                          background: getStatusBackground(order.status),
                          color: getStatusColor(order.status),
                          fontSize: "13px",
                          fontWeight: "bold",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td style={tableCell}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td style={tableCell}>
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        style={{
                          padding: "7px 12px",
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#6b7280",
          margin: 0,
        }}
      >
        {title}
      </p>

      <h2 style={{ marginTop: "8px" }}>{value}</h2>
    </div>
  );
};

const StatusCard = ({ title, value }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "18px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#6b7280",
        }}
      >
        {title}
      </p>

      <h2 style={{ margin: "8px 0 0" }}>{value}</h2>
    </div>
  );
};

/* ================= STYLES ================= */

const sidebarButton = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  background: "transparent",
  color: "white",
  border: "none",
  borderRadius: "6px",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "15px",
};

const tableHeader = {
  padding: "15px",
  borderBottom: "1px solid #eee",
};

const tableCell = {
  padding: "15px",
  borderBottom: "1px solid #eee",
};

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "#15803d";

    case "Cancelled":
      return "#b91c1c";

    case "Shipped":
      return "#1d4ed8";

    case "Confirmed":
      return "#7c3aed";

    default:
      return "#a16207";
  }
};

const getStatusBackground = (status) => {
  switch (status) {
    case "Delivered":
      return "#dcfce7";

    case "Cancelled":
      return "#fee2e2";

    case "Shipped":
      return "#dbeafe";

    case "Confirmed":
      return "#ede9fe";

    default:
      return "#fef3c7";
  }
};

export default AdminDashboard;
