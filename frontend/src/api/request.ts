import axios from 'axios';
import { getToken, clearToken, clearCurrentUser } from '../store/authStore';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

export const request = axios.create({
  baseURL,
  timeout: 10000
});

// 请求拦截器：自动携带 token
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：401 时清除登录状态并跳转登录页
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      clearCurrentUser();
      // 避免在登录页死循环跳转
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
