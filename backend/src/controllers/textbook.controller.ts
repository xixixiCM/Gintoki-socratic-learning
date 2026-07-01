import type { Request, Response } from 'express';

import { success } from '../utils/result';
import * as textbookService from '../services/textbook.service';

export const getDefaultTextbook = async (_request: Request, response: Response): Promise<void> => {
  const data = await textbookService.getDefaultTextbook();
  response.json(success(data));
};
