import { Router } from 'express';

import {
  prepareDefaultTextbook,
  generateDefaultTextbookPreparationController,
  getLatestPreparationTaskController,
  getPreparationTaskDetailController
} from '../controllers/preparation.controller';

export const preparationRouter = Router();

// 旧接口（保留兼容）
preparationRouter.post('/preparation/default-textbook', prepareDefaultTextbook);

// V0.7 新接口
preparationRouter.post('/preparation/default-textbook/generate', generateDefaultTextbookPreparationController);
preparationRouter.get('/preparation/latest', getLatestPreparationTaskController);
preparationRouter.get('/preparation/tasks/:taskId', getPreparationTaskDetailController);
