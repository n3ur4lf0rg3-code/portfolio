import { pool } from "../config/db.js";

export const getRevenueByDay = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(total) as revenue
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Chart data error" });
  }
};

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
