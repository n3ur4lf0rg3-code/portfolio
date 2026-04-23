import express from "express";
import { getStats } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

// 🔒 SOLO ADMIN
router.get("/", authMiddleware, roleMiddleware(["admin"]), getStats);

export default router;
