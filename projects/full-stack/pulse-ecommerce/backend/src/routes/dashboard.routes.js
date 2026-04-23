import express from "express";
import { getStats } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { getStats, getRevenueByDay } from "../controllers/dashboard.controller.js";

router.get("/", authMiddleware, roleMiddleware(["admin"]), getStats);

// 📊 NUEVO endpoint
router.get("/revenue", authMiddleware, roleMiddleware(["admin"]), getRevenueByDay);

const router = express.Router();

// 🔒 SOLO ADMIN
router.get("/", authMiddleware, roleMiddleware(["admin"]), getStats);

export default router;
