import type { Request, Response } from 'express';

import { success } from '../utils/result';
import * as preparationService from '../services/preparation.service';

export const prepareDefaultTextbook = (_request: Request, response: Response): void => {
  const data = preparationService.prepareDefaultTextbook();
  response.json(success(data, 'AI 备课完成'));
};
