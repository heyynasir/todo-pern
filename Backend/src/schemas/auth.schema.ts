import { z } from 'zod';

// -------------------------------------------------------------
// USER REGISTER VALIDATION SCHEMA (ENGLISH MESSAGES)
// -------------------------------------------------------------
export const registerSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
  email: z.string({ required_error: 'Email is required' }).email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
});

// -------------------------------------------------------------
// USER LOGIN VALIDATION SCHEMA (ENGLISH MESSAGES)
// -------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
