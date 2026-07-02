import type { Request, Response } from 'express';

import { success, fail } from '../utils/result';
import * as preparationService from '../services/preparation.service';
import { generateDefaultTextbookPreparation } from '../services/preparationPipeline.service';
import {
  findLatestPreparationTask,
  findPreparationTaskById
} from '../repositories/preparationTask.repository';
import {
  findArtifactsByTaskId
} from '../repositories/preparationArtifact.repository';

/**
 * 旧接口：模拟备课（保留兼容）
 */
export const prepareDefaultTextbook = async (_request: Request, response: Response): Promise<void> => {
  const data = await preparationService.prepareDefaultTextbook();
  response.json(success(data, 'AI 备课完成'));
};

/**
 * V0.7 新接口：真实 AI 备课
 * POST /api/preparation/default-textbook/generate
 */
export const generateDefaultTextbookPreparationController = async (
  _request: Request,
  response: Response
): Promise<void> => {
  try {
    const result = await generateDefaultTextbookPreparation();

    if (result.status === 'failed') {
      response.json(fail('AI 备课失败，请稍后重试', 500));
      return;
    }

    response.json(success(result, 'AI 备课完成'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[preparation.controller] generate failed:', message);
    response.status(500).json(fail(`AI 备课失败：${message}`, 500));
  }
};

/**
 * 查询最近一次备课任务
 * GET /api/preparation/latest
 */
export const getLatestPreparationTaskController = async (
  _request: Request,
  response: Response
): Promise<void> => {
  try {
    const task = await findLatestPreparationTask();

    if (!task) {
      response.json(success(null, '暂无备课记录'));
      return;
    }

    response.json(success({
      taskId: task.id,
      status: task.status,
      currentStep: task.current_step,
      sourceFile: task.source_file,
      modelName: task.model_name,
      errorMessage: task.error_message,
      createdAt: task.created_at
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(500).json(fail(`查询备课任务失败：${message}`, 500));
  }
};

/**
 * 查询备课任务详情
 * GET /api/preparation/tasks/:taskId
 */
export const getPreparationTaskDetailController = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const taskId = parseInt(String(request.params.taskId), 10);

    if (isNaN(taskId) || taskId <= 0) {
      response.status(400).json(fail('无效的 taskId', 400));
      return;
    }

    const task = await findPreparationTaskById(taskId);

    if (!task) {
      response.status(404).json(fail('备课任务不存在', 404));
      return;
    }

    const artifacts = await findArtifactsByTaskId(taskId);

    response.json(success({
      task: {
        taskId: task.id,
        textbookId: task.textbook_id,
        status: task.status,
        currentStep: task.current_step,
        sourceFile: task.source_file,
        modelName: task.model_name,
        errorMessage: task.error_message,
        startedAt: task.started_at,
        finishedAt: task.finished_at,
        createdAt: task.created_at
      },
      artifacts: artifacts.map(a => ({
        id: a.id,
        artifactType: a.artifact_type,
        createdAt: a.created_at,
        // 不返回 content_json（太大），前端不需要
        hasContent: !!a.content_json
      }))
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(500).json(fail(`查询备课任务详情失败：${message}`, 500));
  }
};
