// Express Types aur ZodError import kar rahe hain
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// -------------------------------------------------------------
// GLOBAL CENTRALIZED ERROR HANDLER MIDDLEWARE
// -------------------------------------------------------------
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Agar error Zod Input Validation Error hai
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation Failure: Request Data Invalid hai',
      errors: formattedErrors,
    });
    return;
  }

  // 2. Terminal console me stack trace print karo (For Debugging)
  console.error('🔥 Server Error Stack Trace:', err);

  // 3. Clean 500 Internal Server Error Response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error: Kuch error aayi hai server me',
  });
};
