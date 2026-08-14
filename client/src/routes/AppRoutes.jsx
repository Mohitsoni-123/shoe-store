import React from "react";
import { Routes, Route } from "react-router-dom";

// AUTH / USER PAGES
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

// ROUTE PROTECTION
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

// USER PAGES
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";

// ADMIN PAGES
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminAddProduct from "../pages/AdminAddProduct";
import AdminEditProduct from "../pages/AdminEditProduct";
import AdminOrders from "../pages/AdminOrders";
import AdminUsers from "../pages/AdminUsers";
import AdminOrderDetails from "../pages/AdminOrderDetails";
import OrderDetails from "../pages/OrderDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER ROUTES */}
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

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* ADMIN PRODUCTS */}
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
          <AdminRoute>
            <AdminEditProduct />
          </AdminRoute>
        }
      />

      {/* ADMIN ORDERS */}
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders/:id"
        element={
          <AdminRoute>
            <AdminOrderDetails />
          </AdminRoute>
        }
      />

      {/* ADMIN USERS */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* FIXED: now wrapped in ProtectedRoute, consistent with other order pages */}
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;