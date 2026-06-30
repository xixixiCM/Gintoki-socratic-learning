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

export type PrepareStatus = 'idle' | 'preparing' | 'done';
