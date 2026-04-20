import { pool } from "../config/db.js";

export const getProducts = async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  const result = await pool.query(
    "INSERT INTO products(name, price, image) VALUES($1,$2,$3) RETURNING *",
    [name, price, image]
  );

  res.json(result.rows[0]);
};
