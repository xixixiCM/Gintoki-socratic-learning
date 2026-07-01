import type { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { success, fail } from '../utils/result';

/**
 * POST /api/auth/register
 * 公开接口，不需要登录
 * 注册用户固定 role=STUDENT, status=active
 */
export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 忽略前端可能传入的 role / status 等字段

    if (!username || typeof username !== 'string' || username.trim() === '') {
      res.status(400).json(fail('用户名不能为空', 400));
      return;
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      res.status(400).json(fail('密码不能为空', 400));
      return;
    }

    const result = await authService.register(username.trim(), password);

    res.json(success(result, '注册成功，请登录'));
  } catch (error) {
    if (error instanceof authService.RegisterError) {
      res.status(409).json(fail(error.message, 409));
      return;
    }
    console.error('[auth.controller] register error:', error);
    res.status(500).json(fail('注册失败，请稍后重试'));
  }
};

/**
 * POST /api/auth/login
 */
export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || typeof username !== 'string' || username.trim() === '') {
      res.status(400).json(fail('用户名不能为空', 400));
      return;
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      res.status(400).json(fail('密码不能为空', 400));
      return;
    }

    const result = await authService.login(username.trim(), password);

    res.json(success(result));
  } catch (error) {
    if (error instanceof authService.LoginError) {
      res.status(401).json(fail(error.message, 401));
      return;
    }
    console.error('[auth.controller] login error:', error);
    res.status(500).json(fail('登录失败，请稍后重试'));
  }
};

/**
 * GET /api/auth/me
 * 需要 authMiddleware
 */
export const meController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await authService.getCurrentUser(userId);

    res.json(success(user));
  } catch (error) {
    if (error instanceof authService.LoginError) {
      res.status(401).json(fail(error.message, 401));
      return;
    }
    console.error('[auth.controller] me error:', error);
    res.status(500).json(fail('获取用户信息失败'));
  }
};

/**
 * POST /api/auth/logout
 * 基础版：前端清除 token 即可，后端只返回成功
 */
export const logoutController = async (_req: Request, res: Response): Promise<void> => {
  res.json(success(true, '已退出登录'));
};
