import axios from 'axios';

const api = axios.create({
  // Use the Render link as the fallback
  baseURL: import.meta.env.VITE_API_URL || 'https://ikeya-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the token is invalid or expired, clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we aren't already on the auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;