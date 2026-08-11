import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "../components/AdminRoute";
import AdminProducts from "../pages/AdminProducts";
import AdminAddProduct from "../pages/AdminAddProduct";
import AdminEditProduct from "../pages/AdminEditProduct";
import AdminOrders from "../pages/AdminOrders";

import AdminUsers from "../pages/AdminUsers";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/products" element={<Products />} />

      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products/add"
        element={
          <AdminRoute>
            <AdminAddProduct />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products/edit/:id"
        element={
          <ProtectedRoute>
            <AdminEditProduct />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/orders" element={<AdminOrders />} />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
