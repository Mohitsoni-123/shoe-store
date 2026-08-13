import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// USER ROUTES
// ===============================

// Create Order
router.post(
  "/create",
  authMiddleware,
  createOrder
);

// Get My Orders
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

// ===============================
// ADMIN ROUTES
// ===============================

// Get All Orders
router.get(
  "/admin",
  authMiddleware,
  getAllOrders
);

// Update Order Status
router.put(
  "/admin/:id/status",
  authMiddleware,
  updateOrderStatus
);

// ===============================
// SINGLE ORDER
// ===============================

// Get Single Order
router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

export default router;