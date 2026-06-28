import type { Request, Response } from 'express';

import { success } from '../utils/result';

export const getHealth = (_request: Request, response: Response): void => {
  response.json(
    success(
      {
        status: 'running',
        service: 'ai-socratic-learning-backend'
      },
      'ok'
    )
  );
};
