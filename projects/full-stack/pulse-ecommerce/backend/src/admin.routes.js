import express from "express";
import { pool } from "../config/db.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

// SOLO ADMIN puede promover usuarios
router.put("/make-admin", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  const { email } = req.body;

  await pool.query(
    "UPDATE users SET role='admin' WHERE email=$1",
    [email]
  );

  res.json({ message: "User promoted to admin" });
});

export default router;
