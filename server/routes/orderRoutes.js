import express from "express";

import {
  createOrder,
  getMyOrders,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  // existing functions...
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  createOrder
);

router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

router.get(
  "/admin",
  authMiddleware,
  getAllOrders
);

router.put(
  "/admin/:id/status",
  authMiddleware,
  updateOrderStatus
);

export default router;