import type { Request, Response } from 'express';

import { success, fail } from '../utils/result';
import {
  checkAiHealth,
  generateLessonExplain,
  generateSocraticFollowup,
  generateLessonSummary,
  getAiHistory
} from '../services/ai.service';

/**
 * GET /api/ai/health
 */
export const health = async (_request: Request, response: Response): Promise<void> => {
  const data = checkAiHealth();
  response.json(success(data));
};

/**
 * POST /api/ai/lesson-explain
 */
export const lessonExplain = async (request: Request, response: Response): Promise<void> => {
  const lessonId = Number(request.body.lessonId);
  const sessionId = request.body.sessionId ? Number(request.body.sessionId) : undefined;

  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('lessonId is invalid', 400));
    return;
  }

  try {
    const data = await generateLessonExplain(lessonId, sessionId);
    response.json(success(data));
  } catch (error) {
    console.error('[ai.controller] lessonExplain error:', error);
    response.status(500).json(fail('AI 讲解生成失败', 500));
  }
};

/**
 * POST /api/ai/socratic-followup
 */
export const socraticFollowup = async (request: Request, response: Response): Promise<void> => {
  const lessonId = Number(request.body.lessonId);
  const sessionId = request.body.sessionId ? Number(request.body.sessionId) : undefined;
  const studentAnswer = String(request.body.studentAnswer ?? '').trim();

  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('lessonId is invalid', 400));
    return;
  }

  if (!studentAnswer) {
    response.status(400).json(fail('studentAnswer is required', 400));
    return;
  }

  try {
    const data = await generateSocraticFollowup(lessonId, sessionId, studentAnswer);
    response.json(success(data));
  } catch (error) {
    console.error('[ai.controller] socraticFollowup error:', error);
    response.status(500).json(fail('AI 追问生成失败', 500));
  }
};

/**
 * POST /api/ai/lesson-summary
 */
export const lessonSummary = async (request: Request, response: Response): Promise<void> => {
  const lessonId = Number(request.body.lessonId);
  const sessionId = request.body.sessionId ? Number(request.body.sessionId) : undefined;

  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('lessonId is invalid', 400));
    return;
  }

  try {
    const data = await generateLessonSummary(lessonId, sessionId);
    response.json(success(data));
  } catch (error) {
    console.error('[ai.controller] lessonSummary error:', error);
    response.status(500).json(fail('AI 总结生成失败', 500));
  }
};

/**
 * GET /api/ai/history
 */
export const history = async (request: Request, response: Response): Promise<void> => {
  const lessonId = Number(request.query.lessonId);
  const sessionId = request.query.sessionId ? Number(request.query.sessionId) : undefined;

  if (Number.isNaN(lessonId)) {
    response.status(400).json(fail('lessonId is invalid', 400));
    return;
  }

  try {
    const data = await getAiHistory(lessonId, sessionId);
    response.json(success(data));
  } catch (error) {
    console.error('[ai.controller] history error:', error);
    response.status(500).json(fail('查询对话历史失败', 500));
  }
};
