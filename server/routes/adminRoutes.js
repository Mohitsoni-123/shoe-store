import express from "express";

import { getAdminStats } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getAllUsers,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", authMiddleware, getAdminStats);

router.get("/users", getAllUsers);

router.delete("/users/:id", deleteUser);

export default router;