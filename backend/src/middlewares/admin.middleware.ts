import type { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/result';

/**
 * 管理员权限校验中间件
 * 必须在 authMiddleware 之后使用（依赖 req.user）
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json(fail('无管理员权限', 403));
    return;
  }

  next();
};
