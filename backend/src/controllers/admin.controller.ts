import type { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import { success, fail } from '../utils/result';
import type { UserRole, UserStatus } from '../types/user.types';

/**
 * GET /api/admin/dashboard
 */
export const getAdminDashboardController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dashboard = await adminService.getAdminDashboard();
    res.json(success(dashboard));
  } catch (error) {
    console.error('[admin.controller] dashboard error:', error);
    res.status(500).json(fail('获取后台概览失败'));
  }
};

/**
 * GET /api/admin/users
 * 支持 query: keyword, role, status
 */
export const getAdminUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword, role, status } = req.query;

    const query = {
      keyword: typeof keyword === 'string' && keyword.trim() !== '' ? keyword.trim() : undefined,
      role: (role === 'STUDENT' || role === 'ADMIN') ? role as UserRole : undefined,
      status: (status === 'active' || status === 'disabled') ? status as UserStatus : undefined
    };

    const users = await adminService.getAdminUsers(query);
    res.json(success(users));
  } catch (error) {
    console.error('[admin.controller] getUsers error:', error);
    res.status(500).json(fail('获取用户列表失败'));
  }
};

/**
 * GET /api/admin/users/:id
 */
export const getAdminUserDetailController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
      res.status(400).json(fail('用户 ID 不合法', 400));
      return;
    }

    const user = await adminService.getAdminUserDetail(id);
    if (!user) {
      res.status(404).json(fail('用户不存在', 404));
      return;
    }

    res.json(success(user));
  } catch (error) {
    console.error('[admin.controller] getUserDetail error:', error);
    res.status(500).json(fail('获取用户详情失败'));
  }
};
