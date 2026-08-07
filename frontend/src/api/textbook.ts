import { request } from './request';
import type { DefaultTextbook, LearningOverview, PreparationResult, PreparationGenerateResponse, PreparationTaskDetail } from '../types/textbook';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 获取默认教材信息 */
export const getDefaultTextbook = async (): Promise<DefaultTextbook> => {
  const response = await request.get<ApiResponse<DefaultTextbook>>('/textbooks/default');
  return response.data.data;
};

/** 获取学习概览 */
export const getLearningOverview = async (): Promise<LearningOverview> => {
  const response = await request.get<ApiResponse<LearningOverview>>('/learning/overview');
  return response.data.data;
};

/** 模拟 AI 备课（旧接口，保留兼容） */
export const prepareDefaultTextbook = async (): Promise<PreparationResult> => {
  const response = await request.post<ApiResponse<PreparationResult>>('/preparation/default-textbook');
  return response.data.data;
};

/** V0.7 真实 AI 备课 */
export const generateDefaultTextbookPreparation = async (): Promise<PreparationGenerateResponse> => {
  const response = await request.post<ApiResponse<PreparationGenerateResponse>>(
    '/preparation/default-textbook/generate',
    undefined,
    { timeout: 300000 }
  );
  return response.data.data;
};

/** 查询最近备课任务 */
export const getLatestPreparationTask = async () => {
  const response = await request.get<ApiResponse<any>>('/preparation/latest');
  return response.data.data;
};

/** 按 taskId 查询备课任务详情（用于轮询） */
export const getPreparationTask = async (taskId: number): Promise<PreparationTaskDetail> => {
  const response = await request.get<ApiResponse<PreparationTaskDetail>>(`/preparation/tasks/${taskId}`);
  return response.data.data;
};
