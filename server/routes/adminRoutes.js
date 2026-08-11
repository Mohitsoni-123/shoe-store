import express from "express";

import { getAdminStats } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", authMiddleware, getAdminStats);

router.get("/users", getAllUsers);

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);
router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);

router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus,
);

router.get(
  "/orders/:id",
  authMiddleware,
  adminMiddleware,
  getOrderById
);

export default router;
