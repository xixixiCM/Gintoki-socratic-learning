import type { LessonAiContext } from '../types/ai.types';
import { findLessonById } from '../repositories/lesson.repository';
import { findDefaultTextbook } from '../repositories/textbook.repository';
import { findScriptsByLessonId } from '../repositories/lessonScript.repository';
import { findMappingsByLessonId } from '../repositories/lessonNodeMapping.repository';
import { findProgressByNodeIds } from '../repositories/graphProgress.repository';
import { findLatestSessionByLessonId, findCompletedSessionByLessonId } from '../repositories/lessonSession.repository';
import { findAllKgNodes } from '../repositories/node.repository';
import { findAllKgRelations } from '../repositories/relation.repository';
import { findRecentAiMessages } from '../repositories/aiChatRecord.repository';

function secondsToTimeStr(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * 构造课堂 AI 上下文
 * 仅读取当前课时局部图谱、脚本、会话历史
 */
export async function buildLessonAiContext(
  lessonId: number,
  sessionId?: number | null
): Promise<LessonAiContext> {
  // 并行查询基础数据
  const [lesson, textbook, mappings, scripts] = await Promise.all([
    findLessonById(lessonId),
    findDefaultTextbook(),
    findMappingsByLessonId(lessonId),
    findScriptsByLessonId(lessonId)
  ]);

  const courseName = textbook?.course_name ?? '机器学习入门';
  const lessonTitle = lesson
    ? `第 ${lesson.lesson_order} 课：${lesson.title}`
    : `课时 ${lessonId}`;
  const objective = lesson?.objective ?? '';
  const textbookPages = lesson?.textbook_pages ?? '';
  const maxDurationMinutes = lesson?.max_duration_minutes ?? 40;

  // 计算已用时间
  let usedTime = '00:00';
  if (lesson) {
    if (lesson.status === 'completed') {
      const session = await findCompletedSessionByLessonId(lessonId);
      usedTime = session ? secondsToTimeStr(session.duration_seconds) : '00:00';
    } else {
      const latestSession = await findLatestSessionByLessonId(lessonId);
      if (latestSession && latestSession.started_at) {
        const elapsed = Math.floor((Date.now() - new Date(latestSession.started_at).getTime()) / 1000);
        usedTime = secondsToTimeStr(elapsed);
      }
    }
  }

  // 局部图谱
  const nodeIds = mappings.map(m => m.node_id);
  const [allNodes, allRelations, progressRows] = await Promise.all([
    nodeIds.length > 0 ? findAllKgNodes() : Promise.resolve([]),
    nodeIds.length > 0 ? findAllKgRelations() : Promise.resolve([]),
    nodeIds.length > 0 ? findProgressByNodeIds(nodeIds) : Promise.resolve([])
  ]);

  const progressMap = new Map(progressRows.map(p => [p.node_id, p]));
  const nodeIdSet = new Set(nodeIds);

  const graphNodes = mappings.map(m => {
    const kgNode = allNodes.find(n => n.id === m.node_id);
    const progress = progressMap.get(m.node_id);

    let status: 'completed' | 'current' | 'review' | 'support';
    if (m.role === 'review') {
      status = 'review';
    } else if (m.role === 'support') {
      status = 'support';
    } else if (progress?.status === 'completed') {
      status = 'completed';
    } else if (m.role === 'main') {
      status = 'current';
    } else {
      status = 'support';
    }

    return {
      id: m.node_id,
      name: kgNode?.name ?? `节点${m.node_id}`,
      status
    };
  });

  const graphLinks = allRelations
    .filter(r => nodeIdSet.has(r.source_id) && nodeIdSet.has(r.target_id))
    .map(r => ({
      source: r.source_id,
      target: r.target_id,
      relationType: r.relation_type
    }));

  // 脚本消息
  const scriptMessages = scripts.map(s => ({
    role: (s.role === 'teacher' ? 'teacher' : 'student') as 'teacher' | 'student',
    speaker: s.speaker,
    content: s.content
  }));

  // 最近 AI 对话
  const recentRecords = await findRecentAiMessages(lessonId, sessionId, 10);
  const recentMessages = recentRecords.map(r => ({
    role: (r.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
    content: (r.role === 'assistant' ? r.ai_response : r.user_message) ?? ''
  }));

  return {
    lessonId,
    sessionId: sessionId ?? null,
    courseName,
    lessonTitle,
    objective,
    textbookPages,
    maxDurationMinutes,
    usedTime,
    graphNodes,
    graphLinks,
    scriptMessages,
    recentMessages
  };
}

/**
 * Fallback 上下文（数据库查询失败时使用）
 */
export function buildFallbackContext(lessonId: number, sessionId?: number | null): LessonAiContext {
  return {
    lessonId,
    sessionId: sessionId ?? null,
    courseName: '机器学习入门',
    lessonTitle: `课时 ${lessonId}`,
    objective: '理解机器学习核心概念',
    textbookPages: '',
    maxDurationMinutes: 40,
    usedTime: '00:00',
    graphNodes: [],
    graphLinks: [],
    scriptMessages: [],
    recentMessages: []
  };
}
