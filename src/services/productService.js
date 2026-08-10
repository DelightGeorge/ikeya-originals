import api from './api';

export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductsByType = (type) => api.get(`/products/type/${type}`);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ✅ NEW: Update stock without page refresh
export const updateProductStock = (id, stock) => 
  api.patch(`/products/${id}/stock`, { stock });

// ✅ NEW: Full product edit (name, description, price, category, type, stock, image)
export const updateProduct = (id, formData) =>
  api.patch(`/products/${id}`, formData);