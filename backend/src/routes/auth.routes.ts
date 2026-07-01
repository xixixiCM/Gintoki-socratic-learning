import { Router } from 'express';
import { registerController, loginController, meController, logoutController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRouter = Router();

authRouter.post('/auth/register', registerController);
authRouter.post('/auth/login', loginController);
authRouter.get('/auth/me', authMiddleware, meController);
authRouter.post('/auth/logout', authMiddleware, logoutController);
