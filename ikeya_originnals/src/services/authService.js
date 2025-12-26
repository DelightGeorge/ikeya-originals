import api from './api';

// REGISTER USER
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

// LOGIN USER
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  
  // If your backend returns a token immediately (not using magic links only)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth'; // Adjusted to /auth to match your component
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  // Consistently use the 'api' instance and removed '/api' prefix
  const response = await api.post("/users/forgot-password", { email });
  return response.data;
};

// RESET PASSWORD
export const resetPassword = async (token, password, confirmPassword) => {
  // Using query params as defined in your controller logic
  const response = await api.post(`/users/reset-password?token=${token}`, { 
    password, 
    confirmPassword 
  });
  return response.data;
};