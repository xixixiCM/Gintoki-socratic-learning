import { request } from './request';
import type { DefaultTextbook, LearningOverview, PreparationResult } from '../types/textbook';

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

/** 模拟 AI 备课 */
export const prepareDefaultTextbook = async (): Promise<PreparationResult> => {
  const response = await request.post<ApiResponse<PreparationResult>>('/preparation/default-textbook');
  return response.data.data;
};
