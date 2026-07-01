import type { DefaultTextbook, LearningOverview, PreparationResult } from '../types/textbook.types';
import { findDefaultTextbook } from '../repositories/textbook.repository';
import { findCurrentLesson, countCompletedLessons, countVisibleLessons } from '../repositories/lesson.repository';
import { countCompletedNodes } from '../repositories/graphProgress.repository';
import { findAllKgNodes } from '../repositories/node.repository';

// ========== mock fallback（保留原样） ==========

const mockTextbook: DefaultTextbook = {
  id: 1,
  title: '机器学习入门体验教材',
  courseName: '机器学习入门',
  currentLessonName: '第 4 课：损失函数',
  illuminatedCount: 8,
  totalKnowledgeCount: 32,
  totalPages: 15,
  status: 'prepared'
};

const mockLearningOverview: LearningOverview = {
  courseName: '机器学习入门',
  currentLessonName: '第 4 课：损失函数',
  completedLessonCount: 3,
  totalVisibleLessonCount: 4,
  illuminatedCount: 8,
  totalKnowledgeCount: 32
};

const mockPreparationResult: PreparationResult = {
  lessonCount: 4,
  nodeCount: 18,
  relationCount: 26,
  scriptCount: 4,
  currentLessonName: '第 4 课：损失函数'
};

// ========== V0.4: MySQL 优先 + mock fallback ==========

export async function getDefaultTextbook(): Promise<DefaultTextbook> {
  try {
    const textbook = await findDefaultTextbook();
    if (!textbook) {
      console.warn('[textbook.service] No textbook found in DB, fallback to mock.');
      return mockTextbook;
    }

    const currentLesson = await findCurrentLesson();

    let illuminatedCount = 0;
    let totalKnowledgeCount = 0;
    try {
      illuminatedCount = await countCompletedNodes();
    } catch { /* ignore */ }
    try {
      const nodes = await findAllKgNodes();
      totalKnowledgeCount = nodes.length;
    } catch { /* ignore */ }

    return {
      id: textbook.id,
      title: textbook.title,
      courseName: textbook.course_name,
      currentLessonName: currentLesson?.title ?? '暂无',
      illuminatedCount,
      totalKnowledgeCount,
      totalPages: textbook.total_pages,
      status: textbook.status as DefaultTextbook['status']
    };
  } catch (error) {
    console.warn('[textbook.service] Failed to load from MySQL, fallback to mock.', error);
    return mockTextbook;
  }
}

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
    console.warn('[textbook.service] getLearningOverview failed, fallback to mock.', error);
    return mockLearningOverview;
  }
}

export async function getPreparationResult(): Promise<PreparationResult> {
  try {
    return mockPreparationResult;
  } catch (error) {
    console.warn('[textbook.service] getPreparationResult failed, fallback to mock.', error);
    return mockPreparationResult;
  }
}
