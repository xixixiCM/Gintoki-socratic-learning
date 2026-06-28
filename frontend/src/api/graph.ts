import { request } from './request';
import type { GraphData } from '../types/graph';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const getGraphData = async (): Promise<GraphData> => {
  const response = await request.get<ApiResponse<GraphData>>('/graph');
  return response.data.data;
};
