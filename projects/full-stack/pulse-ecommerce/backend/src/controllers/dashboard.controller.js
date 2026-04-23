import { pool } from "../config/db.js";

export const getStats = async (req, res) => {
  try {
    const totalOrders = await pool.query(
      "SELECT COUNT(*) FROM orders"
    );

    const totalRevenue = await pool.query(
      "SELECT COALESCE(SUM(total),0) FROM orders"
    );

    res.json({
      orders: parseInt(totalOrders.rows[0].count),
      revenue: parseFloat(totalRevenue.rows[0].coalesce),
    });
  } catch (err) {
    res.status(500).json({ message: "Stats error" });
  }
};
