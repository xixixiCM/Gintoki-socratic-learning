import { Router } from 'express';

import { getGraph } from '../controllers/graph.controller';

export const graphRouter = Router();

graphRouter.get('/graph', getGraph);
