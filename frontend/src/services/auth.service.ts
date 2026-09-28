// Axios Instance aur Types import kar rahe hain
import api from './api';
import { ApiResponse, User } from '../types';

// -------------------------------------------------------------
// AUTHENTICATION SERVICE METHOD FUNCTIONS
// -------------------------------------------------------------

// 1. REGISTER USER SERVICE (`POST /api/auth/register`)
export const registerApi = async (data: { name: string; email: string; password: string }): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/register', data);
  return response.data;
};

// 2. LOGIN USER SERVICE (`POST /api/auth/login`)
export const loginApi = async (data: { email: string; password: string }): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/login', data);
  
  // Login Success hone par JWT Token aur User info LocalStorage me Save kar rahe hain
  if (response.data.success && response.data.token) {
    localStorage.setItem('token', response.data.token);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  
  return response.data;
};

// 3. LOGOUT USER SERVICE
export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

// 4. GET CURRENT LOGGED IN USER FROM LOCALSTORAGE
export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};
