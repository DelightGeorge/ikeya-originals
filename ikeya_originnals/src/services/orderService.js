import axios from "axios";

const API_URL = "http://localhost:5000/api/orders"; // Update with your actual URL

export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserOrders = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};