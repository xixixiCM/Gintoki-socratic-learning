export type TextbookStatus = 'not_prepared' | 'preparing' | 'prepared';

export interface DefaultTextbook {
  id: number;
  title: string;
  courseName: string;
  currentLessonName: string;
  illuminatedCount: number;
  totalKnowledgeCount: number;
  totalPages: number;
  status: TextbookStatus;
}

export interface LearningOverview {
  courseName: string;
  currentLessonName: string;
  completedLessonCount: number;
  totalVisibleLessonCount: number;
  illuminatedCount: number;
  totalKnowledgeCount: number;
}

export interface PreparationResult {
  lessonCount: number;
  nodeCount: number;
  relationCount: number;
  scriptCount: number;
  currentLessonName: string;
}

/** V0.7 真实 AI 备课返回 */
export interface PreparationGenerateResponse {
  taskId: number;
  textbookId: number;
  lessonCount: number;
  nodeCount: number;
  relationCount: number;
  scriptCount: number;
  currentLessonName: string;
  status: 'success' | 'failed';
}

export type PrepareStatus = 'idle' | 'preparing' | 'done';
