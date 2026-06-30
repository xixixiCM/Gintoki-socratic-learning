import type { PreparationResult } from '../types/textbook.types';

export function prepareDefaultTextbook(): PreparationResult {
  return {
    lessonCount: 4,
    nodeCount: 18,
    relationCount: 26,
    scriptCount: 4,
    currentLessonName: '第 4 课：损失函数'
  };
}
