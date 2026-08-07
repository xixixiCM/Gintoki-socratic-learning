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

export type PrepareStatus = 'idle' | 'preparing' | 'done' | 'failed';

/** 备课任务轮询状态 */
export interface PreparationTaskDetail {
  task: {
    taskId: number;
    textbookId: number | null;
    status: string;
    currentStep: string | null;
    errorMessage: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    createdAt: string;
  };
  artifacts: Array<{
    id: number;
    artifactType: string;
    createdAt: string;
    hasContent: boolean;
  }>;
}
