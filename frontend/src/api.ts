import axios from 'axios';

console.log("ENV =", import.meta.env);
console.log("API URL =", import.meta.env.VITE_API_URL);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://prosperdesign17.onrender.com/api';

const API = axios.create({ 
  baseURL: API_BASE_URL,
  withCredentials: true 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const getBackendUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'https://prosperdesign17.onrender.com/api';
  return url.replace(/\/api$/, '');
};

export default API;

