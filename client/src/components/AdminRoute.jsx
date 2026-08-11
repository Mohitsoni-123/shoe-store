import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error(
      "USER DATA PARSE ERROR:",
      error
    );

    localStorage.removeItem("user");
  }

  // No token
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Not admin
  if (user?.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // Admin
  return children;
};

export default AdminRoute;