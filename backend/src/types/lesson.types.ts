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
