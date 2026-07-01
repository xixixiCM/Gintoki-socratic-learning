export type LessonStatus = 'completed' | 'current';

export type LessonMessageRole = 'teacher' | 'student';

export interface LessonRecord {
  id: number;
  lessonOrder: number;
  title: string;
  status: LessonStatus;
  usedTime: string;
  textbookPages: string;
  summary: string;
}

export interface LessonMessage {
  id: number;
  role: LessonMessageRole;
  speaker: string;
  content: string;
}

export interface LessonDetail {
  id: number;
  courseName: string;
  title: string;
  objective: string;
  usedTime: string;
  maxTime: string;
  textbookPages: string;
  messages: LessonMessage[];
}

// ========== V0.4 新增 ==========

export interface LessonStartResult {
  sessionId: number;
  lessonId: number;
  startedAt: string;
  maxDurationMinutes: number;
}

export interface LessonCompleteResult {
  lessonId: number;
  title: string;
  summary: string;
  completedNodes: Array<{
    id: number;
    name: string;
  }>;
  nextLesson: {
    id: number;
    lessonOrder: number;
    title: string;
    status: 'current';
  } | null;
}
