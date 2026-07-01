import type { Request, Response } from 'express';

import { success } from '../utils/result';
import * as preparationService from '../services/preparation.service';

export const prepareDefaultTextbook = async (_request: Request, response: Response): Promise<void> => {
  const data = await preparationService.prepareDefaultTextbook();
  response.json(success(data, 'AI 备课完成'));
};
