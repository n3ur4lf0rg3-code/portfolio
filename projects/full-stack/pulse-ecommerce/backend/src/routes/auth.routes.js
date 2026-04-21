import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5, // solo 5 intentos
  message: "Too many login attempts",
});

router.post("/login", authLimiter, login);

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
