import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/", authMiddleware, createProduct);

export default router;