import type { PreparationResult } from '../types/textbook.types';
import { findDefaultTextbook, updateTextbookStatus } from '../repositories/textbook.repository';
import { findCurrentLesson, countAllLessons } from '../repositories/lesson.repository';
import { countScriptLessons } from '../repositories/lessonScript.repository';
import { findAllKgNodes } from '../repositories/node.repository';
import { findAllKgRelations } from '../repositories/relation.repository';

// ========== mock fallback ==========

const mockPreparationResult: PreparationResult = {
  lessonCount: 4,
  nodeCount: 18,
  relationCount: 26,
  scriptCount: 4,
  currentLessonName: '第 4 课：损失函数'
};

// ========== V0.4: 数据库状态式备课 ==========

export async function prepareDefaultTextbook(): Promise<PreparationResult> {
  try {
    const textbook = await findDefaultTextbook();
    if (textbook) {
      await updateTextbookStatus(textbook.id, 'prepared');
    }

    let lessonCount = 0;
    let nodeCount = 0;
    let relationCount = 0;
    let scriptCount = 0;
    let currentLessonName = '暂无';

    try { lessonCount = await countAllLessons(); } catch { /* ignore */ }
    try {
      const nodes = await findAllKgNodes();
      nodeCount = nodes.length;
    } catch { /* ignore */ }
    try {
      const relations = await findAllKgRelations();
      relationCount = relations.length;
    } catch { /* ignore */ }
    try { scriptCount = await countScriptLessons(); } catch { /* ignore */ }
    try {
      const currentLesson = await findCurrentLesson();
      if (currentLesson) {
        currentLessonName = `第 ${currentLesson.lesson_order} 课：${currentLesson.title}`;
      }
    } catch { /* ignore */ }

    return {
      lessonCount,
      nodeCount,
      relationCount,
      scriptCount,
      currentLessonName
    };
  } catch (error) {
    console.warn('[preparation.service] Failed to load from MySQL, fallback to mock.', error);
    return mockPreparationResult;
  }
}
