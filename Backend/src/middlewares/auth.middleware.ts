// Express Types aur JWT library import kar rahe hain
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Express Request Interface extend kar rahe hain logged-in user details ke liye
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// -------------------------------------------------------------
// JWT AUTHENTICATION GUARD MIDDLEWARE
// -------------------------------------------------------------
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Clean try...catch block
  try {
    // 1. Request Headers se Authorization Header extract kar rahe hain
    const authHeader = req.headers.authorization;

    // 2. Header format: "Bearer <TOKEN>" -> space se split karke index 1 par token milta hai
    const token = authHeader && authHeader.split(' ')[1];

    // 3. Agar Token nahi bheja gaya, to 401 Unauthorized Error return karo
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access Denied: Is action ke liye Login karna zaroori hai (Token missing)',
      });
      return;
    }

    // 4. Environment variable se JWT Secret Key fetch kar rahe hain
    const secret = process.env.JWT_SECRET || 'company_production_super_secret_jwt_key_2026_pern_todo';

    // 5. Token verify aur decode kar rahe hain
    const decoded = jwt.verify(token, secret) as { userId: string; email: string };

    // 6. Decoded user payload ko Request object me attach kar rahe hain
    req.user = decoded;

    // 7. Agle middleware ya controller par pass karo
    next();
  } catch (error) {
    // Token invalid ya expire hone par catch block me handle hoga
    res.status(403).json({
      success: false,
      message: 'Invalid ya Expired Token! Kripya firse login karein.',
    });
  }
};
