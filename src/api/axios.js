import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mass-gym-backend.vercel.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mgToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;      
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mgToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
