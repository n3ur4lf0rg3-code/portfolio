import { pool } from "../config/db.js";

export const createOrder = async (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    "INSERT INTO orders(user_id, items, total) VALUES($1,$2,$3) RETURNING *",
    [userId, JSON.stringify(items), total]
  );

  res.json(result.rows[0]);
};
