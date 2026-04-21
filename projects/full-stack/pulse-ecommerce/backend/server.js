import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import { initDB } from "./src/config/init.db.js";
import adminRoutes from "./src/routes/admin.routes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import { logger } from "./src/middleware/logger.middleware.js";

app.use(logger);

// 🔒 Headers seguros
app.use(helmet());

// 🔒 Prevención XSS
app.use(xss());

// 🔒 Previene parameter pollution
app.use(hpp());

// 🔒 Limitar tamaño de payload
app.use(express.json({ limit: "10kb" }));

// 🔒 Rate limit global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests",
});

app.use(limiter);
app.use("/api/admin", adminRoutes);

// antes de app.listen
await initDB();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
