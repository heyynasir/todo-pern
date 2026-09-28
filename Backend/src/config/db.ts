// 1. Official 'pg' (node-postgres) driver import kar rahe hain
import pg from 'pg';

// 2. Environment variables load karne ke liye 'dotenv' import kar rahe hain
import dotenv from 'dotenv';

// 3. .env file load kar rahe hain
dotenv.config();

// 4. pg module se Pool class destructure kar rahe hain
const { Pool } = pg;

// Check if connecting to Cloud PostgreSQL (Neon.tech requires SSL)
const isCloudDB = process.env.DB_HOST?.includes('neon.tech');

// 5. PostgreSQL Connection Pool Config initialize kar rahe hain
const pool = new Pool({
  user: String(process.env.DB_USER || 'postgres'),
  password: String(process.env.DB_PASSWORD || '9980761940'),
  host: String(process.env.DB_HOST || 'localhost'),
  port: Number(process.env.DB_PORT || 5432),
  database: String(process.env.DB_NAME || 'todo'),
  ssl: isCloudDB ? { rejectUnauthorized: false } : false, // Neon SSL Enabled
  max: 10, // Recommended pool size for Neon Cloud
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10s timeout for Neon auto-resume compute
  keepAlive: true, // TCP keepAlive to prevent idle socket drop
});

// 6. Server start hote hi DB Connection test karne ka async function
export const testDBConnection = async () => {
  try {
    const client = await pool.connect();
    console.log(
      `🐘 PostgreSQL Database (${isCloudDB ? 'Neon Cloud' : 'Localhost'}) successfully connected via Connection Pool!`
    );
    client.release();
  } catch (error) {
    console.error('🔥 PostgreSQL DB Connection Failed:', error);
    process.exit(1);
  }
};

// 7. Pool default export kar rahe hain
export default pool;
