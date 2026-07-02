import { callDeepSeek, DeepSeekError } from './deepseek.service';
import { renderPreparationPrompt } from './preparationPrompt.service';
import { safeParseJson } from '../utils/safeParseJson';
import type {
  GeneratedNode,
  GeneratedRelation,
  GeneratedLesson,
  GeneratedLessonScript
} from '../types/preparation.types';
import type { AiPromptMessages } from '../types/ai.types';

// ========== Helpers ==========

async function callAiWithPrompt(systemPrompt: string, taskLabel: string): Promise<string> {
  const messages: AiPromptMessages = [
    { role: 'system', content: systemPrompt }
  ];

  try {
    const result = await callDeepSeek(messages);
    console.log(`[preparationAi] ${taskLabel} 调用成功，模型：${result.model}`);
    return result.content;
  } catch (error) {
    if (error instanceof DeepSeekError) {
      throw new Error(`AI 调用失败 (${taskLabel}): ${error.errorType}: ${error.message}`);
    }
    throw error;
  }
}

// ========== Public API ==========

/**
 * 从教材中抽取知识点
 */
export async function generateNodes(textbookContent: string): Promise<GeneratedNode[]> {
  const prompt = renderPreparationPrompt('extract_nodes', {
    textbookContent
  });

  const raw = await callAiWithPrompt(prompt, '抽取知识点');
  const { data } = safeParseJson<{ nodes: GeneratedNode[] }>(raw);

  if (!data.nodes || !Array.isArray(data.nodes)) {
    throw new Error('AI 返回的知识点数据缺少 nodes 数组');
  }

  return data.nodes;
}

/**
 * 根据教材和知识点生成知识关系
 */
export async function generateRelations(
  textbookContent: string,
  nodes: GeneratedNode[]
): Promise<GeneratedRelation[]> {
  const prompt = renderPreparationPrompt('extract_relations', {
    textbookContent,
    nodesJson: JSON.stringify(nodes, null, 2)
  });

  const raw = await callAiWithPrompt(prompt, '抽取知识关系');
  const { data } = safeParseJson<{ relations: GeneratedRelation[] }>(raw);

  if (!data.relations || !Array.isArray(data.relations)) {
    throw new Error('AI 返回的知识关系数据缺少 relations 数组');
  }

  return data.relations;
}

/**
 * 根据教材、知识点、关系拆分课时
 */
export async function generateLessons(
  textbookContent: string,
  nodes: GeneratedNode[],
  relations: GeneratedRelation[]
): Promise<GeneratedLesson[]> {
  const prompt = renderPreparationPrompt('split_lessons', {
    textbookContent,
    nodesJson: JSON.stringify(nodes, null, 2),
    relationsJson: JSON.stringify(relations, null, 2)
  });

  const raw = await callAiWithPrompt(prompt, '拆分课时');
  const { data } = safeParseJson<{ lessons: GeneratedLesson[] }>(raw);

  if (!data.lessons || !Array.isArray(data.lessons)) {
    throw new Error('AI 返回的课时数据缺少 lessons 数组');
  }

  return data.lessons;
}

/**
 * 为单个课时生成课堂脚本
 */
export async function generateScriptForLesson(
  textbookContent: string,
  lesson: GeneratedLesson,
  lessonNodes: GeneratedNode[],
  lessonRelations: GeneratedRelation[]
): Promise<GeneratedLessonScript> {
  const prompt = renderPreparationPrompt('generate_lesson_script', {
    textbookContent,
    lessonJson: JSON.stringify(lesson, null, 2),
    lessonNodesJson: JSON.stringify(lessonNodes, null, 2),
    lessonRelationsJson: JSON.stringify(lessonRelations, null, 2)
  });

  const raw = await callAiWithPrompt(prompt, `生成课堂脚本 (${lesson.tempId})`);
  const { data } = safeParseJson<GeneratedLessonScript>(raw);

  if (!data.lessonTempId || !Array.isArray(data.messages)) {
    throw new Error(`AI 返回的课堂脚本数据格式不正确 (${lesson.tempId})`);
  }

  // 确保 lessonTempId 正确
  data.lessonTempId = lesson.tempId;

  return data;
}

/**
 * 为所有课时生成课堂脚本
 */
export async function generateAllScripts(
  textbookContent: string,
  lessons: GeneratedLesson[],
  nodes: GeneratedNode[],
  relations: GeneratedRelation[]
): Promise<GeneratedLessonScript[]> {
  const scripts: GeneratedLessonScript[] = [];

  for (const lesson of lessons) {
    // 获取本课知识点
    const lessonNodeTempIds = new Set(lesson.nodeMappings.map(m => m.nodeTempId));
    const lessonNodes = nodes.filter(n => lessonNodeTempIds.has(n.tempId));

    // 获取本课知识关系
    const lessonRelations = relations.filter(
      r => lessonNodeTempIds.has(r.sourceTempId) || lessonNodeTempIds.has(r.targetTempId)
    );

    const script = await generateScriptForLesson(
      textbookContent,
      lesson,
      lessonNodes,
      lessonRelations
    );
    scripts.push(script);
  }

  return scripts;
}
