import type { Request, Response } from 'express';

import { success } from '../utils/result';
import * as learningService from '../services/learning.service';

export const getLearningOverview = (_request: Request, response: Response): void => {
  const data = learningService.getLearningOverview();
  response.json(success(data));
};
