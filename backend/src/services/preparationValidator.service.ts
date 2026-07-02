import type {
  GeneratedNode,
  GeneratedRelation,
  GeneratedLesson,
  GeneratedLessonScript,
  PreparationGeneratedResult
} from '../types/preparation.types';

const ALLOWED_RELATION_TYPES = ['前置知识', '包含', '相关', '引出', '应用于'];
const ALLOWED_LESSON_STATUSES = ['locked', 'current', 'completed'] as const;
const ALLOWED_MAPPING_ROLES = ['main', 'review', 'support', 'preview'] as const;
const ALLOWED_SCRIPT_ROLES = ['teacher', 'student'] as const;
const ALLOWED_MESSAGE_TYPES = ['opening', 'explanation', 'question', 'answer', 'summary'] as const;

// ========== Nodes ==========

export function validateGeneratedNodes(nodes: unknown): GeneratedNode[] {
  if (!Array.isArray(nodes)) {
    throw new Error('知识点列表必须是数组');
  }

  if (nodes.length === 0) {
    throw new Error('知识点列表不能为空');
  }

  if (nodes.length > 50) {
    throw new Error(`知识点数量过多（${nodes.length}），最多 50 个`);
  }

  const tempIds = new Set<string>();

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const prefix = `nodes[${i}]`;

    if (!node.tempId || typeof node.tempId !== 'string') {
      throw new Error(`${prefix}.tempId 缺失或不是字符串`);
    }
    if (!/^N\d+$/.test(node.tempId)) {
      throw new Error(`${prefix}.tempId 格式不正确：${node.tempId}（期望格式 N1、N2...）`);
    }
    if (tempIds.has(node.tempId)) {
      throw new Error(`${prefix}.tempId 重复：${node.tempId}`);
    }
    tempIds.add(node.tempId);

    if (!node.name || typeof node.name !== 'string') {
      throw new Error(`${prefix}.name 缺失或不是字符串`);
    }
    if (!node.category || typeof node.category !== 'string') {
      throw new Error(`${prefix}.category 缺失或不是字符串`);
    }
    if (typeof node.difficulty !== 'number' || node.difficulty < 1 || node.difficulty > 5) {
      throw new Error(`${prefix}.difficulty 必须是 1-5 的数字`);
    }
    if (!node.description || typeof node.description !== 'string') {
      throw new Error(`${prefix}.description 缺失或不是字符串`);
    }
  }

  return nodes as GeneratedNode[];
}

// ========== Relations ==========

export function validateGeneratedRelations(
  relations: unknown,
  nodes: GeneratedNode[]
): GeneratedRelation[] {
  if (!Array.isArray(relations)) {
    throw new Error('知识关系列表必须是数组');
  }

  const nodeTempIds = new Set(nodes.map(n => n.tempId));

  for (let i = 0; i < relations.length; i++) {
    const rel = relations[i];
    const prefix = `relations[${i}]`;

    if (!rel.sourceTempId || typeof rel.sourceTempId !== 'string') {
      throw new Error(`${prefix}.sourceTempId 缺失或不是字符串`);
    }
    if (!nodeTempIds.has(rel.sourceTempId)) {
      throw new Error(`${prefix}.sourceTempId 不存在：${rel.sourceTempId}`);
    }

    if (!rel.targetTempId || typeof rel.targetTempId !== 'string') {
      throw new Error(`${prefix}.targetTempId 缺失或不是字符串`);
    }
    if (!nodeTempIds.has(rel.targetTempId)) {
      throw new Error(`${prefix}.targetTempId 不存在：${rel.targetTempId}`);
    }

    // 不允许自环
    if (rel.sourceTempId === rel.targetTempId) {
      throw new Error(`${prefix} 不允许自环关系：${rel.sourceTempId} -> ${rel.targetTempId}`);
    }

    if (!rel.relationType || !ALLOWED_RELATION_TYPES.includes(rel.relationType)) {
      throw new Error(
        `${prefix}.relationType 无效：${rel.relationType}，允许值：${ALLOWED_RELATION_TYPES.join(', ')}`
      );
    }
  }

  return relations as GeneratedRelation[];
}

// ========== Lessons ==========

export function validateGeneratedLessons(
  lessons: unknown,
  nodes: GeneratedNode[]
): GeneratedLesson[] {
  if (!Array.isArray(lessons)) {
    throw new Error('课时列表必须是数组');
  }

  if (lessons.length === 0) {
    throw new Error('课时列表不能为空');
  }

  const nodeTempIds = new Set(nodes.map(n => n.tempId));
  const lessonTempIds = new Set<string>();
  let currentCount = 0;

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const prefix = `lessons[${i}]`;

    if (!lesson.tempId || typeof lesson.tempId !== 'string') {
      throw new Error(`${prefix}.tempId 缺失或不是字符串`);
    }
    if (!/^L\d+$/.test(lesson.tempId)) {
      throw new Error(`${prefix}.tempId 格式不正确：${lesson.tempId}（期望格式 L1、L2...）`);
    }
    if (lessonTempIds.has(lesson.tempId)) {
      throw new Error(`${prefix}.tempId 重复：${lesson.tempId}`);
    }
    lessonTempIds.add(lesson.tempId);

    if (typeof lesson.lessonOrder !== 'number' || lesson.lessonOrder < 1) {
      throw new Error(`${prefix}.lessonOrder 缺失或不是正整数`);
    }

    if (!lesson.title || typeof lesson.title !== 'string') {
      throw new Error(`${prefix}.title 缺失或不是字符串`);
    }

    if (!lesson.objective || typeof lesson.objective !== 'string') {
      throw new Error(`${prefix}.objective 缺失或不是字符串`);
    }

    if (!lesson.status || !ALLOWED_LESSON_STATUSES.includes(lesson.status)) {
      throw new Error(
        `${prefix}.status 无效：${lesson.status}，允许值：${ALLOWED_LESSON_STATUSES.join(', ')}`
      );
    }

    if (lesson.status === 'current') {
      currentCount++;
    }

    // 检查 nodeMappings
    if (!Array.isArray(lesson.nodeMappings)) {
      throw new Error(`${prefix}.nodeMappings 缺失或不是数组`);
    }

    for (let j = 0; j < lesson.nodeMappings.length; j++) {
      const mapping = lesson.nodeMappings[j];
      const mPrefix = `${prefix}.nodeMappings[${j}]`;

      if (!mapping.nodeTempId || typeof mapping.nodeTempId !== 'string') {
        throw new Error(`${mPrefix}.nodeTempId 缺失或不是字符串`);
      }
      if (!nodeTempIds.has(mapping.nodeTempId)) {
        throw new Error(`${mPrefix}.nodeTempId 不存在：${mapping.nodeTempId}`);
      }

      if (!mapping.role || !ALLOWED_MAPPING_ROLES.includes(mapping.role)) {
        throw new Error(
          `${mPrefix}.role 无效：${mapping.role}，允许值：${ALLOWED_MAPPING_ROLES.join(', ')}`
        );
      }

      if (typeof mapping.displayOrder !== 'number') {
        throw new Error(`${mPrefix}.displayOrder 缺失或不是数字`);
      }
    }
  }

  // 最多只有一个 current
  if (currentCount > 1) {
    throw new Error(`存在 ${currentCount} 个 current 状态的课时，最多只能有 1 个`);
  }
  if (currentCount === 0) {
    throw new Error('至少需要一个 current 状态的课时');
  }

  return lessons as GeneratedLesson[];
}

// ========== Scripts ==========

export function validateGeneratedScripts(
  scripts: unknown,
  lessons: GeneratedLesson[]
): GeneratedLessonScript[] {
  if (!Array.isArray(scripts)) {
    throw new Error('课堂脚本列表必须是数组');
  }

  const lessonTempIds = new Set(lessons.map(l => l.tempId));

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const prefix = `scripts[${i}]`;

    if (!script.lessonTempId || typeof script.lessonTempId !== 'string') {
      throw new Error(`${prefix}.lessonTempId 缺失或不是字符串`);
    }
    if (!lessonTempIds.has(script.lessonTempId)) {
      throw new Error(`${prefix}.lessonTempId 不存在：${script.lessonTempId}`);
    }

    if (!Array.isArray(script.messages)) {
      throw new Error(`${prefix}.messages 缺失或不是数组`);
    }

    if (script.messages.length === 0) {
      throw new Error(`${prefix}.messages 不能为空`);
    }

    for (let j = 0; j < script.messages.length; j++) {
      const msg = script.messages[j];
      const mPrefix = `${prefix}.messages[${j}]`;

      if (typeof msg.scriptOrder !== 'number') {
        throw new Error(`${mPrefix}.scriptOrder 缺失或不是数字`);
      }

      if (!msg.role || !ALLOWED_SCRIPT_ROLES.includes(msg.role)) {
        throw new Error(
          `${mPrefix}.role 无效：${msg.role}，允许值：${ALLOWED_SCRIPT_ROLES.join(', ')}`
        );
      }

      if (!msg.speaker || typeof msg.speaker !== 'string') {
        throw new Error(`${mPrefix}.speaker 缺失或不是字符串`);
      }

      if (!msg.messageType || !ALLOWED_MESSAGE_TYPES.includes(msg.messageType)) {
        throw new Error(
          `${mPrefix}.messageType 无效：${msg.messageType}，允许值：${ALLOWED_MESSAGE_TYPES.join(', ')}`
        );
      }

      if (!msg.content || typeof msg.content !== 'string' || msg.content.trim() === '') {
        throw new Error(`${mPrefix}.content 缺失或为空`);
      }
    }
  }

  return scripts as GeneratedLessonScript[];
}

// ========== Final Result ==========

export function validateFinalPreparationResult(
  result: PreparationGeneratedResult
): PreparationGeneratedResult {
  // 所有字段必须存在
  if (!result.textbook || !result.textbook.title) {
    throw new Error('缺少 textbook 信息');
  }
  if (!result.nodes || !result.relations || !result.lessons || !result.scripts) {
    throw new Error('缺少必要的备课结果字段（nodes/relations/lessons/scripts）');
  }

  return result;
}
