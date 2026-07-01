import type { LessonAiContext, AiPromptMessages } from '../types/ai.types';

// ========== helpers ==========

function formatGraphNodes(ctx: LessonAiContext): string {
  if (!ctx.graphNodes.length) return '（无知识点数据）';
  return ctx.graphNodes
    .map(n => `- ${n.name}：${n.status}`)
    .join('\n');
}

function formatGraphLinks(ctx: LessonAiContext): string {
  if (!ctx.graphLinks.length) return '（无关系数据）';
  return ctx.graphLinks
    .map(l => `- ${l.source} -> ${l.target}：${l.relationType}`)
    .join('\n');
}

function formatScriptMessages(ctx: LessonAiContext): string {
  if (!ctx.scriptMessages.length) return '（无预设脚本）';
  return ctx.scriptMessages
    .map(m => `${m.speaker}：${m.content}`)
    .join('\n');
}

function formatRecentMessages(ctx: LessonAiContext): string {
  if (!ctx.recentMessages.length) return '（暂无对话记录）';
  return ctx.recentMessages
    .map(m => `${m.role === 'assistant' ? '银发导师' : '学生'}：${m.content}`)
    .join('\n');
}

// ========== system prompt ==========

const SYSTEM_PROMPT = `你是"银发导师"，一个用于机器学习入门课程的 AI 虚拟导师。
你采用苏格拉底式教学法：不要直接灌输完整答案，而是通过解释、类比和追问帮助学生自己理解。
你的语气可以轻微吐槽，但不能攻击学生，不能使用不礼貌表达。
当前系统是课时制课堂，每节课最多 40 分钟。
你必须围绕当前课时目标和当前课时局部知识图谱讲解。
不要跳到 locked 后续课程。
不要展示教材原文。
不要说"根据教材原文"。
不要生成小测题。
回答必须简洁，适合大学生初学者。`;

// ========== prompt builders ==========

/**
 * AI 继续讲解 Prompt
 */
export function buildLessonExplainPrompt(ctx: LessonAiContext): AiPromptMessages {
  const userPrompt = `当前课程：${ctx.courseName}
当前课时：${ctx.lessonTitle}
课时目标：${ctx.objective}
教材页码范围：${ctx.textbookPages}
已用时间：${ctx.usedTime}
最长时间：${ctx.maxDurationMinutes} 分钟

当前课时局部知识图谱节点：
${formatGraphNodes(ctx)}

当前课时知识关系：
${formatGraphLinks(ctx)}

预设课堂脚本片段：
${formatScriptMessages(ctx)}

最近课堂对话：
${formatRecentMessages(ctx)}

请你作为银发导师继续讲解本课。
要求：
1. 围绕当前课时目标；
2. 用通俗例子解释；
3. 不要直接跳到未解锁课程；
4. 不要展示教材原文；
5. 结尾提出一个引导性问题；
6. 控制在 300 字以内。`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];
}

/**
 * 苏格拉底式追问 Prompt
 */
export function buildSocraticFollowupPrompt(
  ctx: LessonAiContext,
  studentAnswer: string
): AiPromptMessages {
  const userPrompt = `当前课程：${ctx.courseName}
当前课时：${ctx.lessonTitle}
课时目标：${ctx.objective}

学生刚才的回答：
${studentAnswer}

当前课时局部知识图谱节点：
${formatGraphNodes(ctx)}

当前课时知识关系：
${formatGraphLinks(ctx)}

最近课堂对话：
${formatRecentMessages(ctx)}

请你根据学生回答继续追问。
要求：
1. 先用一句话简短评价学生回答；
2. 不要直接给完整标准答案；
3. 提出一个更深入的问题；
4. 问题必须服务于当前课时目标；
5. 不要跳到未解锁课程；
6. 语气轻松，但不要过度玩梗；
7. 控制在 200 字以内。`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];
}

/**
 * 课堂总结 Prompt
 */
export function buildLessonSummaryPrompt(ctx: LessonAiContext): AiPromptMessages {
  const userPrompt = `当前课程：${ctx.courseName}
当前课时：${ctx.lessonTitle}
课时目标：${ctx.objective}

本节课涉及知识点：
${formatGraphNodes(ctx)}

本节课知识关系：
${formatGraphLinks(ctx)}

本节课堂对话：
${formatRecentMessages(ctx)}

请生成课堂总结。
要求：
1. 总结学生本节课理解了什么；
2. 点明本节课最重要的 2-3 个知识点；
3. 说明这些知识和下一课的关系；
4. 不要生成小测题；
5. 不要展示教材原文；
6. 控制在 300 字以内。`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];
}
