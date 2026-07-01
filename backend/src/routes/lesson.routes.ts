import { Router } from 'express';

import { getLessonRecords, getLessonDetail, getLessonGraph, startLesson, completeLesson } from '../controllers/lesson.controller';

export const lessonRouter = Router();

lessonRouter.get('/lessons/records', getLessonRecords);
lessonRouter.get('/lessons/:lessonId', getLessonDetail);
lessonRouter.get('/lessons/:lessonId/graph', getLessonGraph);

// V0.4 新增
lessonRouter.post('/lessons/:lessonId/start', startLesson);
lessonRouter.post('/lessons/:lessonId/complete', completeLesson);
