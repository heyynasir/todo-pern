import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

// -------------------------------------------------------------
// 1. REGISTER USER CONTROLLER (POST /api/auth/register)
// -------------------------------------------------------------
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Check if user already exists
    const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUserResult = await pool.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      res.status(400).json({
        success: false,
        message: 'This email is already registered. Please log in.',
      });
      return;
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Raw SQL Insert
    const insertUserQuery = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at;
    `;
    const insertResult = await pool.query(insertUserQuery, [name, email, hashedPassword]);
    const newUser = insertResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'User account registered successfully!',
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// 2. LOGIN USER CONTROLLER (POST /api/auth/login)
// -------------------------------------------------------------
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const findUserQuery = 'SELECT id, name, email, password FROM users WHERE email = $1';
    const userResult = await pool.query(findUserQuery, [email]);

    if (userResult.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
      return;
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'company_production_super_secret_jwt_key_2026_pern_todo';
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
