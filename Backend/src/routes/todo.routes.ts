// Express Router, Todo Controllers, aur JWT Auth Middleware import kar rahe hain
import { Router } from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
} from '../controllers/todo.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// SECURITY RULE: Saari Todo Routes par JWT Token Authentication Guard lagaya hai
router.use(authenticateToken as any);

// Route: GET /api/todos (Fetch all todos with search & filters)
router.get('/', getTodos as any);

// Route: POST /api/todos (Create a new todo)
router.post('/', createTodo as any);

// Route: PUT /api/todos/:id (Update existing todo)
router.put('/:id', updateTodo as any);

// Route: PATCH /api/todos/:id/toggle (Toggle complete/pending)
router.patch('/:id/toggle', toggleTodoStatus as any);

// Route: DELETE /api/todos/:id (Delete a todo)
router.delete('/:id', deleteTodo as any);

export default router;
