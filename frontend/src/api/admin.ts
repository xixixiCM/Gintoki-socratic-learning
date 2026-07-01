import { request } from './request';
import type { AdminDashboard, SafeUser, AdminUserQuery } from '../types/user';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * GET /admin/dashboard
 */
export const getAdminDashboardApi = async (): Promise<AdminDashboard> => {
  const response = await request.get<ApiResponse<AdminDashboard>>('/admin/dashboard');
  return response.data.data;
};

/**
 * GET /admin/users
 */
export const getAdminUsersApi = async (query: AdminUserQuery = {}): Promise<SafeUser[]> => {
  const params: Record<string, string> = {};
  if (query.keyword) params.keyword = query.keyword;
  if (query.role) params.role = query.role;
  if (query.status) params.status = query.status;

  const response = await request.get<ApiResponse<SafeUser[]>>('/admin/users', { params });
  return response.data.data;
};

/**
 * GET /admin/users/:id
 */
export const getAdminUserDetailApi = async (id: number): Promise<SafeUser> => {
  const response = await request.get<ApiResponse<SafeUser>>(`/admin/users/${id}`);
  return response.data.data;
};
