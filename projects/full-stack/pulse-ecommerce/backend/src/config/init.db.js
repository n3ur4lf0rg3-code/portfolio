import { pool } from "./db.js";

export const initDB = async () => {
  try {
    // Crear tabla si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'user'
      );
    `);

    // Asegurar columna role (por si ya existía tabla vieja)
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
    `);

    console.log("DB initialized");
  } catch (err) {
    console.error("DB init error:", err);
  }
};
