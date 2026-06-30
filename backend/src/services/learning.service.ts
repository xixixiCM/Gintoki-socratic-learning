import type { LearningOverview } from '../types/textbook.types';

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
