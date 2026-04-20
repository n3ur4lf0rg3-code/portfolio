import express from "express";
import { getProducts, createProduct } from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", authMiddleware, createProduct);

export default router;
