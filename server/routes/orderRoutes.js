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

// USER ROUTES
router.post("/create", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);

// ADMIN ROUTES
router.get("/admin", authMiddleware, getAllOrders);
router.put("/admin/:id/status", authMiddleware, updateOrderStatus);

// SINGLE ORDER
router.get("/:id", authMiddleware, getOrderById);

export default router;