// src/config/db.js
import { Sequelize } from "sequelize";

// This function will create and return the sequelize instance
export const initializeSequelize = () => {
  const sequelize = new Sequelize(
  // Use the single URI if it exists (for deployment)
  process.env.DATABASE_URL || {
    // Or fall back to individual variables (for local development)
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    // ... rest of local config
  },
  {
    dialect: 'postgres',
    // CRITICAL for cloud providers: Force SSL or disable it based on internal network
    // For internal Render connections, often SSL is not required or handled automatically.
    // However, if the connection fails, adding this is the typical fix:
    dialectOptions: {
      ssl: {
        // Render often requires this for external connection, but not internal.
        // If internal fails, you might need to try forcing it off/on.
        require: false, // Start by assuming SSL is not needed internally
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);
  return sequelize;
};