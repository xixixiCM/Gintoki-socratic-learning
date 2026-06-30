import { Router } from 'express';

import { getLearningOverview } from '../controllers/learning.controller';

export const learningRouter = Router();

learningRouter.get('/learning/overview', getLearningOverview);
