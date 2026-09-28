// App, Dotenv, DB Connection Test, aur Setup Script import kar rahe hain
import app from './app.js';
import dotenv from 'dotenv';
import { testDBConnection } from './config/db.js';
import { initializeDatabase } from './db/setupDb.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

// Server Startup Bootstrap Function with async/await & clean try...catch
const startServer = async () => {
  try {
    console.log('⏳ Connecting to PostgreSQL Database...');
    
    // 1. Test PostgreSQL DB Connection Pool
    await testDBConnection();

    // 2. Initialize Raw SQL Database Tables (users & todos)
    await initializeDatabase();

    // 3. Start Express HTTP Listener
    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🚀 PERN Raw SQL Todo Backend Server Online!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`==================================================`);
    });
  } catch (error) {
    console.error('🔥 Failed to Start Backend Server:', error);
    process.exit(1);
  }
};

// Bootstrap function execute kar rahe hain
startServer();
