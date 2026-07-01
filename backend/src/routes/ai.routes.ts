import { Router } from 'express';

import {
  health,
  lessonExplain,
  socraticFollowup,
  lessonSummary,
  history
} from '../controllers/ai.controller';

export const aiRouter = Router();

aiRouter.get('/ai/health', health);
aiRouter.post('/ai/lesson-explain', lessonExplain);
aiRouter.post('/ai/socratic-followup', socraticFollowup);
aiRouter.post('/ai/lesson-summary', lessonSummary);
aiRouter.get('/ai/history', history);
