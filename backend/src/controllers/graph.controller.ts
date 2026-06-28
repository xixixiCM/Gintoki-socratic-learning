import type { Request, Response } from 'express';

import { success } from '../utils/result';
import { getGraphData } from '../services/graph.service';

export const getGraph = (_request: Request, response: Response): void => {
  response.json(success(getGraphData()));
};
