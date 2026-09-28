import type { Response, NextFunction } from 'express';
import pool from '../config/db.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema.js';

// Helper function to safely parse date string to Date object or null
const parseSafeDate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

// -------------------------------------------------------------
// 1. GET ALL TODOS FOR LOGGED-IN USER (GET /api/todos)
// -------------------------------------------------------------
export const getTodos = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { search, isCompleted, priority, category, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let queryText = 'SELECT * FROM todos WHERE user_id = $1';
    let countQueryText = 'SELECT COUNT(*) FROM todos WHERE user_id = $1';
    const queryParams: any[] = [userId];
    let paramIndex = 2;

    if (search && typeof search === 'string') {
      queryText += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      countQueryText += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (isCompleted !== undefined) {
      queryText += ` AND is_completed = $${paramIndex}`;
      countQueryText += ` AND is_completed = $${paramIndex}`;
      queryParams.push(isCompleted === 'true');
      paramIndex++;
    }

    if (priority && typeof priority === 'string') {
      queryText += ` AND priority = $${paramIndex}`;
      countQueryText += ` AND priority = $${paramIndex}`;
      queryParams.push(priority);
      paramIndex++;
    }

    if (category && typeof category === 'string') {
      queryText += ` AND category = $${paramIndex}`;
      countQueryText += ` AND category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const paginatedParams = [...queryParams, limitNum, offset];

    const [todosResult, countResult] = await Promise.all([
      pool.query(queryText, paginatedParams),
      pool.query(countQueryText, queryParams),
    ]);

    const totalCount = parseInt(countResult.rows[0].count, 10);

    res.status(200).json({
      success: true,
      data: todosResult.rows,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// 2. CREATE NEW TODO (POST /api/todos)
// -------------------------------------------------------------
export const createTodo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const validatedData = createTodoSchema.parse(req.body);
    const { title, description, priority, category, dueDate } = validatedData;

    const insertQuery = `
      INSERT INTO todos (title, description, priority, category, due_date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      title,
      description || null,
      priority || 'MEDIUM',
      category || 'General',
      parseSafeDate(dueDate),
      userId,
    ];

    const result = await pool.query(insertQuery, values);
    const newTodo = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Todo task created successfully!',
      data: newTodo,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// 3. UPDATE TODO (PUT /api/todos/:id)
// -------------------------------------------------------------
export const updateTodo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const validatedData = updateTodoSchema.parse(req.body);

    const checkQuery = 'SELECT id FROM todos WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Todo task not found or access denied',
      });
      return;
    }

    const { title, description, isCompleted, priority, category, dueDate } = validatedData;

    const updateQuery = `
      UPDATE todos
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        is_completed = COALESCE($3, is_completed),
        priority = COALESCE($4, priority),
        category = COALESCE($5, category),
        due_date = COALESCE($6, due_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING *;
    `;

    const values = [
      title !== undefined ? title : null,
      description !== undefined ? description : null,
      isCompleted !== undefined ? isCompleted : null,
      priority !== undefined ? priority : null,
      category !== undefined ? category : null,
      dueDate !== undefined ? parseSafeDate(dueDate) : null,
      id,
      userId,
    ];

    const updateResult = await pool.query(updateQuery, values);

    res.status(200).json({
      success: true,
      message: 'Todo task updated successfully!',
      data: updateResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// 4. TOGGLE TODO COMPLETION STATUS (PATCH /api/todos/:id/toggle)
// -------------------------------------------------------------
export const toggleTodoStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const toggleQuery = `
      UPDATE todos
      SET is_completed = NOT is_completed, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await pool.query(toggleQuery, [id, userId]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Todo task not found or access denied',
      });
      return;
    }

    const updatedTodo = result.rows[0];

    res.status(200).json({
      success: true,
      message: `Todo status changed to ${updatedTodo.is_completed ? 'Completed' : 'Pending'}`,
      data: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// 5. DELETE TODO (DELETE /api/todos/:id)
// -------------------------------------------------------------
export const deleteTodo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id;';
    const result = await pool.query(deleteQuery, [id, userId]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Todo task not found or access denied',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Todo task deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
