import type { DefaultTextbook, LearningOverview, PreparationResult } from '../types/textbook.types';

const mockTextbook: DefaultTextbook = {
  id: 1,
  title: '机器学习入门体验教材',
  courseName: '机器学习入门',
  currentLessonName: '第 4 课：损失函数',
  illuminatedCount: 8,
  totalKnowledgeCount: 32,
  totalPages: 15,
  status: 'not_prepared'
};

export function getDefaultTextbook(): DefaultTextbook {
  return mockTextbook;
}

export function getLearningOverview(): LearningOverview {
  return {
    courseName: '机器学习入门',
    currentLessonName: '第 4 课：损失函数',
    completedLessonCount: 3,
    totalVisibleLessonCount: 4,
    illuminatedCount: 8,
    totalKnowledgeCount: 32
  };
}

export function getPreparationResult(): PreparationResult {
  return {
    lessonCount: 4,
    nodeCount: 18,
    relationCount: 26,
    scriptCount: 4,
    currentLessonName: '第 4 课：损失函数'
  };
}
