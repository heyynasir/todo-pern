# 🚀 TODO APP - Production Full-Stack Application

A high-performance, enterprise-ready **Full-Stack Todo Web Application** built with **Next.js 16 (App Router)**, **Node.js**, **Express**, and **PostgreSQL (Raw SQL & Connection Pooling)**.

---

## 🌐 Live Production Deployments

- **Frontend (Vercel)**: [https://todo-pern.vercel.app](https://todo-pern.vercel.app)
- **Backend API (Render)**: [https://todo-pern-1ozp.onrender.com](https://todo-pern-1ozp.onrender.com)
- **Health Check**: [https://todo-pern-1ozp.onrender.com/api/health](https://todo-pern-1ozp.onrender.com/api/health)
- **Database**: [Neon.tech Serverless PostgreSQL](https://neon.tech)

---

## 🛠️ Tech Stack & Architecture

### **Frontend (Client)**
- **Framework**: Next.js 16 (App Router with Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Glassmorphism & Custom Color Schemes
- **Icons**: React Icons (`react-icons/hi2`)
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with automated JWT Bearer Request/Response Interceptors

### **Backend (REST API)**
- **Runtime**: Node.js v24 (ES Modules)
- **Framework**: Express.js
- **Language**: TypeScript
- **Architecture**: MVC Pattern (Model-View-Controller)
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing (10 salt rounds)
- **Input Validation**: Zod Schemas
- **Security**: CORS, Environment Variable Isolation, Global Error Handling

### **Database (Data Layer)**
- **Engine**: PostgreSQL 18 on Neon.tech Cloud
- **Driver**: Raw SQL with `pg` (node-postgres) Connection Pool
- **Indexes**: Indexed `user_id` Foreign Key for O(1) query time under scale
- **Cascade Rules**: `ON DELETE CASCADE` for clean relational integrity

---

## 📋 Features

- 🔐 **User Authentication**: Secure Sign-up and Login with email and hashed passwords.
- ⚡ **Instant Task Management**: Create, Read, Update, and Delete (CRUD) tasks.
- 🎯 **Priority Levels**: Dynamic Color-coded Priority Badges (`LOW`, `MEDIUM`, `HIGH`).
- 🏷️ **Category Tags**: Tag tasks (Work, Personal, Shopping, etc.).
- 📅 **Interactive Date Picker**: Native calendar date selection.
- 🔍 **Live Search & Filters**: Search tasks by title/description and filter by completion status or priority.
- 📊 **Stats Dashboard**: Real-time summary cards for Total, Completed, Pending, and High Priority tasks.
- 📱 **Mobile & Desktop Responsive**: Cross-device optimized layout and dark mode theme.

---

## 📡 REST API Endpoints

### **Authentication**
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user & return JWT token

### **Todos (Protected by JWT)**
- `GET /api/todos` - Get all todos (with `search`, `isCompleted`, `priority`, `category`, and pagination)
- `POST /api/todos` - Create a new task
- `PUT /api/todos/:id` - Update task details
- `PATCH /api/todos/:id/toggle` - Toggle completion status
- `DELETE /api/todos/:id` - Delete task

### **System**
- `GET /api/health` - Health check status

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/heyynasir/todo-pern.git
cd todo-pern
```

### 2. Backend Setup
```bash
cd Backend
npm install
# Configure your .env file with PostgreSQL credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
