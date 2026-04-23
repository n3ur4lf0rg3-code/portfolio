import { pool } from "../config/db.js";
import { emitToCart } from "../socket/socket.js";
import { emitGlobal } from "../socket/socket.js"; // NUEVO

emitGlobal("new_order", {
  total,
  createdAt: new Date(),
});

export const createOrder = async (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    "INSERT INTO orders(user_id, items, total) VALUES($1,$2,$3) RETURNING *",
    [userId, JSON.stringify(items), total]
  );

  res.json(result.rows[0]);
};
