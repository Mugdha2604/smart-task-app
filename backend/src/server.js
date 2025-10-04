// src/server.js
import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect DB
    await sequelize.authenticate();
    console.log("✅ Database connected...");

    // Sync models (dev only, don’t use { force: true } in prod!)
    await sequelize.sync();
    console.log("✅ Models synchronized...");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
  }
}

startServer();
