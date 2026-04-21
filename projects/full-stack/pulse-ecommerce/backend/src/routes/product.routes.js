import express from "express";
import { getProducts, createProduct } from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateProduct } from "../middleware/validateProduct.middleware.js";

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  validateProduct,
  createProduct
);

const router = express.Router();

router.get("/", getProducts);

// 🔒 SOLO ADMIN
router.post("/", authMiddleware, roleMiddleware(["admin"]), createProduct);

export default router;
