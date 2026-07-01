import type { Request, Response } from 'express';

import { success, fail } from '../utils/result';
import * as lessonService from '../services/lesson.service';

export const getLessonRecords = async (_request: Request, response: Response): Promise<void> => {
  const data = await lessonService.getLessonRecords();
  response.json(success(data));
};

export const getLessonDetail = async (request: Request, response: Response): Promise<void> => {
  const lessonId = Number(request.params.lessonId);
  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('无效的课时 ID', 400));
    return;
  }

  const data = await lessonService.getLessonDetail(lessonId);
  if (data === null) {
    response.status(404).json(fail('课时不存在', 404));
    return;
  }

  response.json(success(data));
};

export const getLessonGraph = async (request: Request, response: Response): Promise<void> => {
  const lessonId = Number(request.params.lessonId);
  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('无效的课时 ID', 400));
    return;
  }

  const data = await lessonService.getLessonGraph(lessonId);
  if (data === null) {
    response.status(404).json(fail('课时图谱不存在', 404));
    return;
  }

  response.json(success(data));
};

// ========== V0.4 新增 ==========

export const startLesson = async (request: Request, response: Response): Promise<void> => {
  const lessonId = Number(request.params.lessonId);
  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('无效的课时 ID', 400));
    return;
  }

  const data = await lessonService.startLesson(lessonId);
  if (data === null) {
    response.status(403).json(fail('课时不可开始（可能被锁定或不存在）', 403));
    return;
  }

  response.json(success(data, '课堂已开始'));
};

const VALID_END_TYPES = ['early_finish', 'normal_finish', 'timeout_finish', 'manual_exit'];

export const completeLesson = async (request: Request, response: Response): Promise<void> => {
  const lessonId = Number(request.params.lessonId);
  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('无效的课时 ID', 400));
    return;
  }

  const { sessionId, endType } = request.body ?? {};
  if (!sessionId || typeof sessionId !== 'number') {
    response.status(400).json(fail('缺少 sessionId', 400));
    return;
  }

  const effectiveEndType = (typeof endType === 'string' && VALID_END_TYPES.includes(endType))
    ? endType
    : 'early_finish';

  try {
    const data = await lessonService.completeLesson(lessonId, sessionId, effectiveEndType);
    if (data === null) {
      response.status(404).json(fail('课时或会话不存在', 404));
      return;
    }
    response.json(success(data, '课时已完成'));
  } catch (error) {
    console.error('[lesson.controller] completeLesson error:', error);
    response.status(500).json(fail('完成课时失败', 500));
  }
};
