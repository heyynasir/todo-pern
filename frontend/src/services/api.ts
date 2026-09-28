// Axios HTTP client library import kar rahe hain
import axios from 'axios';

// Dynamic API Base URL helper (Localhost + Local IP + Production Cloud Fallback)
const getApiBaseUrl = (): string => {
  // 1. Explicit Environment Variable (if configured)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Client-side dynamic environment detection
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Local development (PC localhost or Mobile Wi-Fi IP)
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('10.') || host.startsWith('192.168.')) {
      return `http://${host}:8080/api`;
    }
  }

  // 3. Production Live Render Backend URL Default Fallback
  return 'https://todo-pern-1ozp.onrender.com/api';
};

// Axios Custom Instance create kar rahe hain
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update baseURL dynamically on each request
api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Unauthorized token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
