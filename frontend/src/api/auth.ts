import { request } from './request';
import type { LoginResponse, SafeUser, RegisterResult } from '../types/user';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * POST /auth/register
 * 注册普通用户，不传 role/status/email
 */
export const registerApi = async (username: string, password: string): Promise<RegisterResult> => {
  const response = await request.post<ApiResponse<RegisterResult>>('/auth/register', {
    username,
    password
  });
  return response.data.data;
};

/**
 * POST /auth/login
 */
export const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await request.post<ApiResponse<LoginResponse>>('/auth/login', {
    username,
    password
  });
  return response.data.data;
};

/**
 * GET /auth/me
 */
export const getMeApi = async (): Promise<SafeUser> => {
  const response = await request.get<ApiResponse<SafeUser>>('/auth/me');
  return response.data.data;
};

/**
 * POST /auth/logout
 */
export const logoutApi = async (): Promise<boolean> => {
  const response = await request.post<ApiResponse<boolean>>('/auth/logout');
  return response.data.data;
};
