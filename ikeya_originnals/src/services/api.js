import axios from 'axios';

/**
 * API Instance configuration
 * Priority: 
 * 1. Environment variable (VITE_API_URL set in Vercel)
 * 2. Hardcoded Render fallback
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ikeya-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// Injects the JWT token into every outgoing request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Watches for 401 (Unauthorized) errors to handle expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 error or if the token is explicitly rejected by the backend
    if (error.response && error.response.status === 401) {
      
      // Clear expired credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Prevent infinite redirect loops if the user is already on the login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth' && currentPath !== '/login') {
        // Redirect to the auth page
        window.location.href = '/auth';
      }
    }
    
    // Pass the error back to the calling function (like Auth.jsx) to show a toast/message
    return Promise.reject(error);
  }
);

export default api;