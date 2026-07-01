import { request } from './request';
import type { LessonRecord, LessonDetail, LessonStartResult, LessonCompleteResult } from '../types/lesson';
import type { LessonGraphData } from '../types/graph';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 获取课程记录 (只返回 completed + current) */
export const getLessonRecords = async (): Promise<LessonRecord[]> => {
  const response = await request.get<ApiResponse<LessonRecord[]>>('/lessons/records');
  return response.data.data;
};

/** 获取某节课详情 */
export const getLessonDetail = async (lessonId: number): Promise<LessonDetail> => {
  const response = await request.get<ApiResponse<LessonDetail>>(`/lessons/${lessonId}`);
  return response.data.data;
};

/** 获取某节课局部知识图谱 */
export const getLessonGraph = async (lessonId: number): Promise<LessonGraphData> => {
  const response = await request.get<ApiResponse<LessonGraphData>>(`/lessons/${lessonId}/graph`);
  return response.data.data;
};

// ========== V0.4 新增 ==========

/** 开始课堂 */
export const startLesson = async (lessonId: number): Promise<LessonStartResult> => {
  const response = await request.post<ApiResponse<LessonStartResult>>(`/lessons/${lessonId}/start`);
  return response.data.data;
};

/** 完成课堂 */
export const completeLesson = async (
  lessonId: number,
  payload: { sessionId: number; endType: string }
): Promise<LessonCompleteResult> => {
  const response = await request.post<ApiResponse<LessonCompleteResult>>(`/lessons/${lessonId}/complete`, payload);
  return response.data.data;
};
