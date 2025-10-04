// src/config/db.js
import { Sequelize } from "sequelize";

// This function will create and return the sequelize instance
export const initializeSequelize = () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
    }
  );
  return sequelize;
};