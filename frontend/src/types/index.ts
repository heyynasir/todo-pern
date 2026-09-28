// -------------------------------------------------------------
// TYPESCRIPT INTERFACES FOR PERN TODO FRONTEND
// -------------------------------------------------------------

// Todo Priority Enum Level
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

// User Account Interface
export interface User {
  id: string;
  name: string;
  email: string;
}

// Todo Task Item Interface (Matches PostgreSQL Table structure)
export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  is_completed: boolean;
  priority: PriorityLevel;
  category: string;
  due_date?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// API Server Standard Response Format
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  token?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Todo Filter Parameters State
export interface TodoFilterParams {
  search?: string;
  isCompleted?: boolean;
  priority?: PriorityLevel | '';
  category?: string;
  page?: number;
  limit?: number;
}
