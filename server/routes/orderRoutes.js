import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==============================
// USER ORDERS
// ==============================

// Create new order
router.post(
  "/create",
  authMiddleware,
  createOrder
);

// Get logged-in user's orders
router.get(
  "/",
  authMiddleware,
  getMyOrders
);

// Optional alternative endpoint
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);


// ==============================
// ADMIN ORDERS
// ==============================

// Get all orders
router.get(
  "/admin",
  authMiddleware,
  getAllOrders
);

// Update order status
router.put(
  "/admin/:id/status",
  authMiddleware,
  updateOrderStatus
);

export default router;