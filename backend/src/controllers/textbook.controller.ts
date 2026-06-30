import type { Request, Response } from 'express';

import { success } from '../utils/result';
import * as textbookService from '../services/textbook.service';

export const getDefaultTextbook = (_request: Request, response: Response): void => {
  const data = textbookService.getDefaultTextbook();
  response.json(success(data));
};
