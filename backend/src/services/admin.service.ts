import { findUsers, countUsers, countUsersByRole, findUserById } from '../repositories/user.repository';
import type { SafeUser, AdminUserQuery } from '../types/user.types';

export interface AdminDashboard {
  totalUserCount: number;
  studentCount: number;
  adminCount: number;
}

/**
 * 获取管理员后台概览（仅用户统计，不含学习统计）
 */
export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const [total, studentCount, adminCount] = await Promise.all([
    countUsers(),
    countUsersByRole('STUDENT'),
    countUsersByRole('ADMIN')
  ]);

  return {
    totalUserCount: total,
    studentCount,
    adminCount
  };
};

/**
 * 获取管理员用户列表（支持筛选）
 */
export const getAdminUsers = async (query: AdminUserQuery): Promise<SafeUser[]> => {
  return findUsers(query);
};

/**
 * 获取单个用户基础信息（管理员视角，不含学习记录）
 */
export const getAdminUserDetail = async (userId: number): Promise<SafeUser | null> => {
  const user = await findUserById(userId);
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    role: user.role,
    status: user.status,
    createdAt: user.create_time instanceof Date
      ? user.create_time.toISOString()
      : String(user.create_time),
    updatedAt: user.update_time instanceof Date
      ? user.update_time.toISOString()
      : String(user.update_time)
  };
};
