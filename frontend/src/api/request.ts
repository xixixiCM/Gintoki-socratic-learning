import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

export const request = axios.create({
  baseURL,
  timeout: 10000
});
