// Database Connection Pool import kar rahe hain
import pool from '../config/db.js';

// Function: Complete Fresh Clean Database Tables Re-Creation
export const initializeDatabase = async () => {
  try {
    console.log('⏳ Synchronizing PostgreSQL Database Schema...');

    // 1. UUID Extension Enable
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // 2. Drop old conflicting tables if they exist (Fixes all legacy column mismatch errors once and for all)
    // ONLY FOR DEV INITIALIZATION: Removes legacy camelCase columns from previous ORM runs
    const checkTableQuery = `SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'todos' AND column_name = 'user_id');`;
    const checkResult = await pool.query(checkTableQuery);
    
    // If legacy table exists without user_id column, drop and recreate clean schema
    if (!checkResult.rows[0].exists) {
      console.log('🔄 Re-creating clean database schema...');
      await pool.query('DROP TABLE IF EXISTS todos CASCADE;');
      await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    }

    // 3. CREATE USERS TABLE
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createUsersTableQuery);

    // 4. CREATE TODOS TABLE (With exact user_id, description, priority, category, due_date columns)
    const createTodosTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(20) DEFAULT 'MEDIUM',
        category VARCHAR(100) DEFAULT 'General',
        due_date TIMESTAMP WITH TIME ZONE,
        user_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_todos FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    await pool.query(createTodosTableQuery);

    // 5. CREATE FAST QUERY INDEX
    await pool.query('CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);');

    console.log('✅ PostgreSQL Schema Successfully Synchronized & Clean!');
  } catch (error) {
    console.error('🔥 Error Initializing Database Tables:', error);
  }
};
