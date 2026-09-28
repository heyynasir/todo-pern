// Express, CORS, Dotenv, aur Routes import kar rahe hain
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import todoRoutes from './routes/todo.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

// Express app instance
const app = express();

// -------------------------------------------------------------
// GLOBAL MIDDLEWARES
// -------------------------------------------------------------

// 1. CORS Configuration (Allows PC localhost + Mobile Wi-Fi Network IPs)
app.use(
  cors({
    origin: true, // Allow incoming requests from PC and Mobile Local Network IP
    credentials: true,
  })
);

// 2. Express Body Parser (JSON Requests handle karne ke liye)
app.use(express.json());

// -------------------------------------------------------------
// ROUTES MOUNTING
// -------------------------------------------------------------

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    message: 'Backend Server is healthy 🚀',
    timestamp: new Date().toISOString(),
  });
});

// Authentication Endpoints (/api/auth/register, /api/auth/login)
app.use('/api/auth', authRoutes);

// Todo CRUD Endpoints (/api/todos)
app.use('/api/todos', todoRoutes);

// -------------------------------------------------------------
// 404 UNHANDLED ROUTE HANDLER
// -------------------------------------------------------------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Requested Route '${req.originalUrl}' server par exist nahi karta`,
  });
});

// -------------------------------------------------------------
// GLOBAL ERROR HANDLER MIDDLEWARE (Must be mounted last)
// -------------------------------------------------------------
app.use(errorHandler as any);

export default app;
