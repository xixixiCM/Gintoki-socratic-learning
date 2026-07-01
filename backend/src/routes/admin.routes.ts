import { Router } from 'express';
import {
  getAdminDashboardController,
  getAdminUsersController,
  getAdminUserDetailController
} from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

export const adminRouter = Router();

// 所有管理员路由都需要登录 + 管理员权限
adminRouter.get('/admin/dashboard', authMiddleware, adminMiddleware, getAdminDashboardController);
adminRouter.get('/admin/users', authMiddleware, adminMiddleware, getAdminUsersController);
adminRouter.get('/admin/users/:id', authMiddleware, adminMiddleware, getAdminUserDetailController);
