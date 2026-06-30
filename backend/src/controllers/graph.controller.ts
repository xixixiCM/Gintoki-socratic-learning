import type { Request, Response } from 'express';

import { success } from '../utils/result';
import { getGraphData } from '../services/graph.service';

export const getGraph = async (_request: Request, response: Response): Promise<void> => {
  const graphData = await getGraphData();
  response.json(success(graphData));
};
