import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const cartCount =
    cart?.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ) || 0;

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");

    window.location.reload();
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Logo */}

      <Link
        to="/"
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "black",
        }}
      >
        ShoeStore
      </Link>

      {/* Navigation */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
        }}
      >
        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/cart">🛒 Cart ({cartCount})</Link>

        {token && <Link to="/orders">My Orders</Link>}

        {!token ? (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        ) : (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
