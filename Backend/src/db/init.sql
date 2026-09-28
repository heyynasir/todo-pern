-- 1. UUID Extension Enable kar rahe hain (Unique Random String IDs generator)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom ENUM Create kar rahe hain Todo Priority Level ke liye ('LOW', 'MEDIUM', 'HIGH')
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_level') THEN
        CREATE TYPE priority_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
    END IF;
END $$;

-- 3. USERS TABLE (User Accounts Metadata)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Random UUID string primary key
    name VARCHAR(255) NOT NULL,                     -- User Name
    email VARCHAR(255) UNIQUE NOT NULL,              -- Unique Email (Duplicate accounts not allowed)
    password VARCHAR(255) NOT NULL,                  -- Encrypted Bcrypt Password Hash
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Created Time
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Updated Time
);

-- 4. TODOS TABLE (Tasks Metadata)
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Todo Unique ID
    title VARCHAR(255) NOT NULL,                    -- Todo Title
    description TEXT,                               -- Todo Optional Description
    is_completed BOOLEAN DEFAULT FALSE,             -- Status (Pending: false, Completed: true)
    priority priority_level DEFAULT 'MEDIUM',       -- Priority ('LOW', 'MEDIUM', 'HIGH')
    category VARCHAR(100) DEFAULT 'General',        -- Category Tag ('Work', 'Personal')
    due_date TIMESTAMP WITH TIME ZONE,              -- Optional Task Due Date
    user_id UUID NOT NULL,                          -- Foreign Key (Owner User ID)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Relationship Constraint
    -- ON DELETE CASCADE: Agar main User Delete karunga, to uske saare Todos PostgreSQL auto-delete kar dega!
    CONSTRAINT fk_user_todos FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. INDEXING FOR HIGH PERFORMANCE QUERY (Fast Search)
-- jab 100,000 todos bhi honge, user_id index query ko instant fast bana ke dega
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
