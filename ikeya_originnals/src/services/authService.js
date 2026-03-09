import api from './api';

// REGISTER
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

// LOGIN
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const response = await api.post("/users/forgot-password", { email });
  return response.data;
};

// RESET PASSWORD
export const resetPassword = async (token, password, confirmPassword) => {
  const response = await api.post(`/users/reset-password?token=${token}`, { 
    password,
    confirmPassword
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth';
};