// Express Router aur Auth Controller methods import kar rahe hain
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

// Express Router instance
const router = Router();

// Route: POST /api/auth/register (User Registration)
router.post('/register', registerUser as any);

// Route: POST /api/auth/login (User Login)
router.post('/login', loginUser as any);

export default router;
