import { z } from 'zod';

// -------------------------------------------------------------
// CREATE TODO VALIDATION SCHEMA (PRODUCTION TS COMPLIANT)
// -------------------------------------------------------------
export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
  category: z.string().optional().default('General'),
  dueDate: z.string().optional().nullable(),
});

// -------------------------------------------------------------
// UPDATE TODO VALIDATION SCHEMA
// -------------------------------------------------------------
export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().optional().nullable(),
  isCompleted: z.boolean().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  category: z.string().optional(),
  dueDate: z.string().optional().nullable(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
