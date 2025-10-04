// src/server.js
import dotenv from 'dotenv';
dotenv.config({ override: true }); // 1. Load Environment

import app from './app.js';
import { initializeSequelize } from './config/db.js';
import { initializeModels } from './models/index.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 2. Create the database connection
    const sequelize = initializeSequelize();
    await sequelize.authenticate();
    console.log("✅ Database connected...");

    // 3. Initialize models using the connection
    const { User, Task } = initializeModels(sequelize);
    console.log("✅ Models initialized...");

    // 4. Sync models to the database
    await sequelize.sync({alter: true});
    console.log("✅ Models synchronized...");

    // 5. Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error)
  {
    console.error("❌ Unable to start server:", error);
  }
}

startServer();