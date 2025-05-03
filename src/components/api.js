import axios from 'axios';

const api = axios.create({
  baseURL: 'https://merrbio-backend.onrender.com',
});

// Interceptor që shton token-in në header automatikisht
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

export default api;
