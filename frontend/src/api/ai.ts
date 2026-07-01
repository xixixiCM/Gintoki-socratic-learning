import { request } from './request';
import type { AiHealthResponse, AiMessageResponse, AiHistoryMessage } from '../types/ai';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** AI 请求的 timeout（毫秒），比普通请求更长 */
const AI_TIMEOUT = 35000;

/** 检查 DeepSeek 配置状态 */
export const getAiHealth = async (): Promise<AiHealthResponse> => {
  const response = await request.get<ApiResponse<AiHealthResponse>>('/ai/health');
  return response.data.data;
};

/** AI 继续讲解 */
export const explainLesson = async (payload: {
  lessonId: number;
  sessionId?: number | null;
}): Promise<AiMessageResponse> => {
  const response = await request.post<ApiResponse<AiMessageResponse>>('/ai/lesson-explain', payload, {
    timeout: AI_TIMEOUT
  });
  return response.data.data;
};

/** 苏格拉底式追问 */
export const socraticFollowup = async (payload: {
  lessonId: number;
  sessionId?: number | null;
  studentAnswer: string;
}): Promise<AiMessageResponse> => {
  const response = await request.post<ApiResponse<AiMessageResponse>>('/ai/socratic-followup', payload, {
    timeout: AI_TIMEOUT
  });
  return response.data.data;
};

/** 生成课堂总结 */
export const generateLessonSummary = async (payload: {
  lessonId: number;
  sessionId?: number | null;
}): Promise<AiMessageResponse> => {
  const response = await request.post<ApiResponse<AiMessageResponse>>('/ai/lesson-summary', payload, {
    timeout: AI_TIMEOUT
  });
  return response.data.data;
};

/** 查询 AI 对话历史 */
export const getAiHistory = async (params: {
  lessonId: number;
  sessionId?: number | null;
}): Promise<AiHistoryMessage[]> => {
  const response = await request.get<ApiResponse<AiHistoryMessage[]>>('/ai/history', { params });
  return response.data.data;
};
