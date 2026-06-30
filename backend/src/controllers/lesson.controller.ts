import type { Request, Response } from 'express';

import { success, fail } from '../utils/result';
import * as lessonService from '../services/lesson.service';

export const getLessonRecords = (_request: Request, response: Response): void => {
  const data = lessonService.getLessonRecords();
  response.json(success(data));
};

export const getLessonDetail = (request: Request, response: Response): void => {
  const lessonId = Number(request.params.lessonId);
  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('无效的课时 ID', 400));
    return;
  }

  const data = lessonService.getLessonDetail(lessonId);
  if (data === null) {
    response.status(404).json(fail('课时不存在', 404));
    return;
  }

  response.json(success(data));
};

export const getLessonGraph = (request: Request, response: Response): void => {
  const lessonId = Number(request.params.lessonId);
  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('无效的课时 ID', 400));
    return;
  }

  const data = lessonService.getLessonGraph(lessonId);
  if (data === null) {
    response.status(404).json(fail('课时图谱不存在', 404));
    return;
  }

  response.json(success(data));
};
