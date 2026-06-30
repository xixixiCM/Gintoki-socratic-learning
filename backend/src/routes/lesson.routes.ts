import { Router } from 'express';

import { getLessonRecords, getLessonDetail, getLessonGraph } from '../controllers/lesson.controller';

export const lessonRouter = Router();

lessonRouter.get('/lessons/records', getLessonRecords);
lessonRouter.get('/lessons/:lessonId', getLessonDetail);
lessonRouter.get('/lessons/:lessonId/graph', getLessonGraph);
