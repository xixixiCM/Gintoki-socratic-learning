import { request } from './request';
import type { LessonRecord, LessonDetail } from '../types/lesson';
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
