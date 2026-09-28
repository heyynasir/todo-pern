// Axios API instance aur Types import kar rahe hain
import api from './api';
import { ApiResponse, Todo, TodoFilterParams, PriorityLevel } from '../types';

// -------------------------------------------------------------
// TODO CRUD SERVICE METHOD FUNCTIONS
// -------------------------------------------------------------

// 1. FETCH ALL TODOS WITH SEARCH & FILTERS (`GET /api/todos`)
export const getTodosApi = async (params?: TodoFilterParams): Promise<ApiResponse<Todo[]>> => {
  const response = await api.get<ApiResponse<Todo[]>>('/todos', { params });
  return response.data;
};

// 2. CREATE A NEW TODO TASK (`POST /api/todos`)
export const createTodoApi = async (data: {
  title: string;
  description?: string;
  priority?: PriorityLevel;
  category?: string;
  dueDate?: string;
}): Promise<ApiResponse<Todo>> => {
  const response = await api.post<ApiResponse<Todo>>('/todos', data);
  return response.data;
};

// 3. UPDATE AN EXISTING TODO TASK (`PUT /api/todos/:id`)
export const updateTodoApi = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    priority?: PriorityLevel;
    category?: string;
    dueDate?: string | null;
  }
): Promise<ApiResponse<Todo>> => {
  const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, data);
  return response.data;
};

// 4. TOGGLE TODO COMPLETION STATUS (`PATCH /api/todos/:id/toggle`)
export const toggleTodoStatusApi = async (id: string): Promise<ApiResponse<Todo>> => {
  const response = await api.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`);
  return response.data;
};

// 5. DELETE A TODO TASK (`DELETE /api/todos/:id`)
export const deleteTodoApi = async (id: string): Promise<ApiResponse> => {
  const response = await api.delete<ApiResponse>(`/todos/${id}`);
  return response.data;
};
