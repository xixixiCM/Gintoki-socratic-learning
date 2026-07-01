import type { Request, Response } from 'express';

import { success } from '../utils/result';
import * as learningService from '../services/learning.service';

export const getLearningOverview = async (_request: Request, response: Response): Promise<void> => {
  const data = await learningService.getLearningOverview();
  response.json(success(data));
};
