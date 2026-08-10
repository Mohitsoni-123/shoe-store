import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>

      <p>Welcome to ShoeStore Admin Panel 👋</p>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/admin/products")}
          style={{ marginRight: "15px" }}
        >
          Manage Products
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          style={{ marginRight: "15px" }}
        >
          Manage Orders
        </button>
      </div>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;