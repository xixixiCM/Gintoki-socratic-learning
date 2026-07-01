import { env } from '../config/env';
import type { AiMessageResponse, AiHistoryMessage } from '../types/ai.types';
import { buildLessonAiContext, buildFallbackContext } from './aiContext.service';
import {
  buildLessonExplainPrompt,
  buildSocraticFollowupPrompt,
  buildLessonSummaryPrompt
} from './aiPrompt.service';
import { callDeepSeek, DeepSeekError } from './deepseek.service';
import {
  createAiChatRecord,
  findAiHistoryByLesson
} from '../repositories/aiChatRecord.repository';

const ASSISTANT_SPEAKER = '银发导师';
const STUDENT_SPEAKER = '学生';

// ========== Helpers ==========

function toAiMessageResponse(
  recordId: number,
  content: string,
  actionType: 'lesson_explain' | 'socratic_followup' | 'lesson_summary',
  model: string,
  fallback: boolean,
  latencyMs?: number
): AiMessageResponse {
  return {
    messageId: recordId,
    role: 'assistant',
    speaker: ASSISTANT_SPEAKER,
    content,
    actionType,
    model,
    fallback,
    latencyMs
  };
}

function formatErrorSummary(error: unknown): string {
  if (error instanceof DeepSeekError) {
    return `${error.errorType}: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message.slice(0, 300);
  }
  return String(error).slice(0, 300);
}

// ========== Fallback content generators ==========

function fallbackExplain(ctx: ReturnType<typeof buildFallbackContext>): string {
  const currentNodes = ctx.graphNodes
    .filter(n => n.status === 'current')
    .map(n => n.name)
    .join('、');
  return `当前 AI 服务暂时不可用。先按本节课目标继续学习：${ctx.lessonTitle} 的重点是 ${ctx.objective || '理解核心概念'}。
你可以先观察右侧局部知识图谱，重点关注 current 状态的节点：${currentNodes || '请查看右侧图谱'}。
思考一个问题：这些 current 节点和已经 completed/review 的节点之间有什么联系？`;
}

function fallbackFollowup(): string {
  return `当前 AI 服务暂时不可用。根据你的回答，可以继续思考：
如果预测误差有正有负，为什么直接相加可能会让模型误以为自己没有犯错？

提示：请结合右侧局部知识图谱中的 current 节点和 review 节点来回答。`;
}

function fallbackSummary(ctx: ReturnType<typeof buildFallbackContext>): string {
  const currentNodes = ctx.graphNodes
    .filter(n => n.status === 'current')
    .map(n => n.name)
    .join('、');
  const reviewNodes = ctx.graphNodes
    .filter(n => n.status === 'review')
    .map(n => n.name)
    .join('、');
  return `当前 AI 服务暂时不可用。系统根据本节课结构生成基础总结：
本节课围绕 ${ctx.lessonTitle} 展开，重点理解 ${currentNodes || '核心概念'}。
这些知识与已学内容 ${reviewNodes || '前置知识'} 有直接联系，并为后续学习继续打基础。`;
}

// ========== Public API ==========

/**
 * AI 健康检查
 */
export function checkAiHealth() {
  const apiKey = env.deepseekApiKey;
  return {
    provider: 'deepseek',
    baseUrl: env.deepseekBaseUrl,
    model: env.deepseekModel,
    configured: !!(apiKey && apiKey !== 'your_deepseek_api_key')
  };
}

/**
 * AI 继续讲解
 */
export async function generateLessonExplain(
  lessonId: number,
  sessionId?: number
): Promise<AiMessageResponse> {
  const startTime = Date.now();
  let context;

  try {
    context = await buildLessonAiContext(lessonId, sessionId);
  } catch (err) {
    console.warn('[ai.service] buildLessonAiContext failed, using fallback context:', formatErrorSummary(err));
    context = buildFallbackContext(lessonId, sessionId);
  }

  const prompts = buildLessonExplainPrompt(context);
  const promptSnapshot = JSON.stringify(prompts);

  try {
    const result = await callDeepSeek(prompts);
    const latencyMs = Date.now() - startTime;

    const record = await createAiChatRecord({
      lessonId,
      lessonSessionId: sessionId ?? null,
      actionType: 'lesson_explain',
      role: 'assistant',
      speaker: ASSISTANT_SPEAKER,
      aiResponse: result.content,
      promptSnapshot,
      modelName: result.model,
      success: true,
      fallbackUsed: false,
      latencyMs
    });

    return toAiMessageResponse(record.id, result.content, 'lesson_explain', result.model, false, latencyMs);
  } catch (err) {
    console.warn('[ai.service] DeepSeek call failed, fallback used.');
    const latencyMs = Date.now() - startTime;
    const errorMsg = formatErrorSummary(err);
    const fallbackContent = fallbackExplain(context);

    const record = await createAiChatRecord({
      lessonId,
      lessonSessionId: sessionId ?? null,
      actionType: 'lesson_explain',
      role: 'assistant',
      speaker: ASSISTANT_SPEAKER,
      aiResponse: fallbackContent,
      promptSnapshot,
      modelName: env.deepseekModel,
      success: false,
      fallbackUsed: true,
      latencyMs,
      errorMessage: errorMsg
    });

    return toAiMessageResponse(record.id, fallbackContent, 'lesson_explain', env.deepseekModel, true, latencyMs);
  }
}

/**
 * 苏格拉底式追问
 */
export async function generateSocraticFollowup(
  lessonId: number,
  sessionId: number | undefined,
  studentAnswer: string
): Promise<AiMessageResponse> {
  const startTime = Date.now();

  // Step 1: Save student message
  await createAiChatRecord({
    lessonId,
    lessonSessionId: sessionId ?? null,
    actionType: 'student_message',
    role: 'user',
    speaker: STUDENT_SPEAKER,
    userMessage: studentAnswer,
    success: true,
    fallbackUsed: false
  });

  // Step 2: Build context
  let context;
  try {
    context = await buildLessonAiContext(lessonId, sessionId);
  } catch (err) {
    console.warn('[ai.service] buildLessonAiContext failed, using fallback context:', formatErrorSummary(err));
    context = buildFallbackContext(lessonId, sessionId);
  }

  const prompts = buildSocraticFollowupPrompt(context, studentAnswer);
  const promptSnapshot = JSON.stringify(prompts);

  // Step 3: Call DeepSeek
  try {
    const result = await callDeepSeek(prompts);
    const latencyMs = Date.now() - startTime;

    const record = await createAiChatRecord({
      lessonId,
      lessonSessionId: sessionId ?? null,
      actionType: 'socratic_followup',
      role: 'assistant',
      speaker: ASSISTANT_SPEAKER,
      aiResponse: result.content,
      promptSnapshot,
      modelName: result.model,
      success: true,
      fallbackUsed: false,
      latencyMs
    });

    return toAiMessageResponse(record.id, result.content, 'socratic_followup', result.model, false, latencyMs);
  } catch (err) {
    console.warn('[ai.service] DeepSeek call failed, fallback used.');
    const latencyMs = Date.now() - startTime;
    const errorMsg = formatErrorSummary(err);
    const fallbackContent = fallbackFollowup();

    const record = await createAiChatRecord({
      lessonId,
      lessonSessionId: sessionId ?? null,
      actionType: 'socratic_followup',
      role: 'assistant',
      speaker: ASSISTANT_SPEAKER,
      aiResponse: fallbackContent,
      promptSnapshot,
      modelName: env.deepseekModel,
      success: false,
      fallbackUsed: true,
      latencyMs,
      errorMessage: errorMsg
    });

    return toAiMessageResponse(record.id, fallbackContent, 'socratic_followup', env.deepseekModel, true, latencyMs);
  }
}

/**
 * 生成课堂总结
 */
export async function generateLessonSummary(
  lessonId: number,
  sessionId?: number
): Promise<AiMessageResponse> {
  const startTime = Date.now();
  let context;

  try {
    context = await buildLessonAiContext(lessonId, sessionId);
  } catch (err) {
    console.warn('[ai.service] buildLessonAiContext failed, using fallback context:', formatErrorSummary(err));
    context = buildFallbackContext(lessonId, sessionId);
  }

  const prompts = buildLessonSummaryPrompt(context);
  const promptSnapshot = JSON.stringify(prompts);

  try {
    const result = await callDeepSeek(prompts);
    const latencyMs = Date.now() - startTime;

    const record = await createAiChatRecord({
      lessonId,
      lessonSessionId: sessionId ?? null,
      actionType: 'lesson_summary',
      role: 'assistant',
      speaker: ASSISTANT_SPEAKER,
      aiResponse: result.content,
      promptSnapshot,
      modelName: result.model,
      success: true,
      fallbackUsed: false,
      latencyMs
    });

    return toAiMessageResponse(record.id, result.content, 'lesson_summary', result.model, false, latencyMs);
  } catch (err) {
    console.warn('[ai.service] DeepSeek call failed, fallback used.');
    const latencyMs = Date.now() - startTime;
    const errorMsg = formatErrorSummary(err);
    const fallbackContent = fallbackSummary(context);

    const record = await createAiChatRecord({
      lessonId,
      lessonSessionId: sessionId ?? null,
      actionType: 'lesson_summary',
      role: 'assistant',
      speaker: ASSISTANT_SPEAKER,
      aiResponse: fallbackContent,
      promptSnapshot,
      modelName: env.deepseekModel,
      success: false,
      fallbackUsed: true,
      latencyMs,
      errorMessage: errorMsg
    });

    return toAiMessageResponse(record.id, fallbackContent, 'lesson_summary', env.deepseekModel, true, latencyMs);
  }
}

/**
 * 查询 AI 对话历史
 */
export async function getAiHistory(
  lessonId: number,
  sessionId?: number
): Promise<AiHistoryMessage[]> {
  const records = await findAiHistoryByLesson(lessonId, sessionId ?? null, 100);

  return records.map(r => ({
    id: r.id,
    role: r.role === 'assistant' ? 'assistant' : 'user',
    speaker: r.speaker ?? (r.role === 'assistant' ? ASSISTANT_SPEAKER : STUDENT_SPEAKER),
    content: (r.role === 'assistant' ? r.ai_response : r.user_message) ?? '',
    actionType: r.action_type,
    createdAt: r.created_at
  }));
}
