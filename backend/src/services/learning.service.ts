import type { LearningOverview } from '../types/textbook.types';
import { findDefaultTextbook } from '../repositories/textbook.repository';
import { findCurrentLesson, countCompletedLessons, countVisibleLessons } from '../repositories/lesson.repository';
import { countCompletedNodes } from '../repositories/graphProgress.repository';
import { findAllKgNodes } from '../repositories/node.repository';

// ========== mock fallback ==========

const mockLearningOverview: LearningOverview = {
  courseName: '机器学习入门',
  currentLessonName: '第 4 课：损失函数',
  completedLessonCount: 3,
  totalVisibleLessonCount: 4,
  illuminatedCount: 8,
  totalKnowledgeCount: 32
};

// ========== V0.4: MySQL 优先 + mock fallback ==========

export async function getLearningOverview(): Promise<LearningOverview> {
  try {
    const textbook = await findDefaultTextbook();
    const currentLesson = await findCurrentLesson();

    let completedLessonCount = 0;
    let totalVisibleLessonCount = 0;
    let illuminatedCount = 0;
    let totalKnowledgeCount = 0;

    try { completedLessonCount = await countCompletedLessons(); } catch { /* ignore */ }
    try { totalVisibleLessonCount = await countVisibleLessons(); } catch { /* ignore */ }
    try { illuminatedCount = await countCompletedNodes(); } catch { /* ignore */ }
    try {
      const nodes = await findAllKgNodes();
      totalKnowledgeCount = nodes.length;
    } catch { /* ignore */ }

    return {
      courseName: textbook?.course_name ?? mockLearningOverview.courseName,
      currentLessonName: currentLesson?.title ?? mockLearningOverview.currentLessonName,
      completedLessonCount,
      totalVisibleLessonCount,
      illuminatedCount,
      totalKnowledgeCount
    };
  } catch (error) {
    console.warn('[learning.service] Failed to load from MySQL, fallback to mock.', error);
    return mockLearningOverview;
  }
}
