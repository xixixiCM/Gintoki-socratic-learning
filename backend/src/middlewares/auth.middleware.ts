import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { fail } from '../utils/result';

/**
 * JWT 鉴权中间件
 * 从 Authorization header 读取 Bearer token，校验并挂载用户信息到 req.user
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(fail('未登录，请先登录', 401));
      return;
    }

    const token = authHeader.slice(7); // 去掉 "Bearer "

    const payload = verifyToken(token);

    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role
    };

    next();
  } catch (error) {
    res.status(401).json(fail('登录已过期，请重新登录', 401));
  }
};
