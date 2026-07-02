import { pool } from '../db/pool';
import type {
  PreparationGeneratedResult,
  PreparationPersistSummary,
  GeneratedNode,
  GeneratedRelation,
  GeneratedLesson,
  GeneratedLessonScript
} from '../types/preparation.types';

/**
 * 将 AI 备课结果写入数据库（事务）。
 *
 * 流程：
 * 1. 清理旧默认教材数据
 * 2. 写入 textbook
 * 3. 写入 kg_node
 * 4. 写入 kg_relation
 * 5. 写入 lesson
 * 6. 写入 lesson_node_mapping
 * 7. 写入 lesson_script
 * 8. 写入 graph_progress
 */
export async function persistPreparationResult(
  result: PreparationGeneratedResult,
  taskId: number
): Promise<PreparationPersistSummary> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ===== 1. 清理旧默认教材数据 =====
    // 按依赖顺序清理（先清理子表，再清理父表）
    await connection.query('DELETE FROM lesson_session');
    await connection.query('DELETE FROM lesson_node_mapping');
    await connection.query('DELETE FROM lesson_script');
    await connection.query('DELETE FROM graph_progress');
    await connection.query('DELETE FROM kg_relation');
    await connection.query('DELETE FROM kg_node');
    await connection.query('DELETE FROM lesson');
    await connection.query('DELETE FROM textbook');
    // 清理与旧 lesson 相关的 ai_chat_record
    await connection.query('DELETE FROM ai_chat_record');

    // ===== 2. 写入 textbook =====
    const textbook = result.textbook;
    const [textbookResult] = await connection.query<any>(
      `INSERT INTO textbook (title, course_name, total_pages, status)
       VALUES (?, ?, ?, ?)`,
      [textbook.title, textbook.courseName, textbook.totalPages, 'prepared']
    );
    const textbookId = (textbookResult as any).insertId;

    // ===== 3. 写入 kg_node =====
    const tempIdToNodeId = new Map<string, number>();

    for (const node of result.nodes) {
      const [nodeResult] = await connection.query<any>(
        `INSERT INTO kg_node (name, category, difficulty, description, content)
         VALUES (?, ?, ?, ?, ?)`,
        [node.name, node.category, node.difficulty, node.description, node.content || '']
      );
      const nodeId = (nodeResult as any).insertId;
      tempIdToNodeId.set(node.tempId, nodeId);
    }

    // ===== 4. 写入 kg_relation =====
    for (const rel of result.relations) {
      const sourceId = tempIdToNodeId.get(rel.sourceTempId);
      const targetId = tempIdToNodeId.get(rel.targetTempId);

      if (!sourceId || !targetId) {
        throw new Error(
          `关系写入失败：找不到 tempId 映射 (${rel.sourceTempId} -> ${sourceId}, ${rel.targetTempId} -> ${targetId})`
        );
      }

      await connection.query(
        `INSERT INTO kg_relation (source_id, target_id, relation_type, description)
         VALUES (?, ?, ?, ?)`,
        [sourceId, targetId, rel.relationType, rel.description || null]
      );
    }

    // ===== 5. 写入 lesson =====
    const tempIdToLessonId = new Map<string, number>();

    for (const lesson of result.lessons) {
      const [lessonResult] = await connection.query<any>(
        `INSERT INTO lesson (textbook_id, lesson_order, title, objective, status,
          textbook_pages, max_duration_minutes, estimated_duration_minutes, summary)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          textbookId,
          lesson.lessonOrder,
          lesson.title,
          lesson.objective,
          lesson.status,
          lesson.textbookPages || '',
          lesson.maxDurationMinutes || 40,
          lesson.estimatedDurationMinutes || null,
          lesson.summary || null
        ]
      );
      const lessonId = (lessonResult as any).insertId;
      tempIdToLessonId.set(lesson.tempId, lessonId);
    }

    // ===== 6. 写入 lesson_node_mapping =====
    for (const lesson of result.lessons) {
      const lessonId = tempIdToLessonId.get(lesson.tempId);
      if (!lessonId) continue;

      for (const mapping of lesson.nodeMappings) {
        const nodeId = tempIdToNodeId.get(mapping.nodeTempId);
        if (!nodeId) {
          throw new Error(
            `课时映射写入失败：找不到节点 tempId ${mapping.nodeTempId}（课时 ${lesson.tempId}）`
          );
        }

        await connection.query(
          `INSERT INTO lesson_node_mapping (lesson_id, node_id, role, display_order)
           VALUES (?, ?, ?, ?)`,
          [lessonId, nodeId, mapping.role, mapping.displayOrder]
        );
      }
    }

    // ===== 7. 写入 lesson_script =====
    let scriptCount = 0;

    for (const script of result.scripts) {
      const lessonId = tempIdToLessonId.get(script.lessonTempId);
      if (!lessonId) {
        throw new Error(`脚本写入失败：找不到课时 tempId ${script.lessonTempId}`);
      }

      for (const msg of script.messages) {
        await connection.query(
          `INSERT INTO lesson_script (lesson_id, script_order, role, speaker, content, message_type)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [lessonId, msg.scriptOrder, msg.role, msg.speaker, msg.content, msg.messageType]
        );
      }
      scriptCount++;
    }

    // ===== 8. 写入 graph_progress =====
    for (const lesson of result.lessons) {
      const lessonId = tempIdToLessonId.get(lesson.tempId);
      if (!lessonId) continue;

      for (const mapping of lesson.nodeMappings) {
        const nodeId = tempIdToNodeId.get(mapping.nodeTempId);
        if (!nodeId) continue;

        let progressStatus: string;

        if (mapping.role === 'main') {
          // main 节点根据课时状态决定
          if (lesson.status === 'completed') {
            progressStatus = 'completed';
          } else if (lesson.status === 'current') {
            progressStatus = 'current';
          } else {
            progressStatus = 'locked';
          }
        } else {
          // 非 main 节点默认 locked
          progressStatus = 'locked';
        }

        const completedLessonId = progressStatus === 'completed' ? lessonId : null;

        await connection.query(
          `INSERT INTO graph_progress (node_id, status, completed_lesson_id)
           VALUES (?, ?, ?)`,
          [nodeId, progressStatus, completedLessonId]
        );
      }
    }

    // ===== 提交事务 =====
    await connection.commit();

    // 找当前课时名称
    const currentLesson = result.lessons.find(l => l.status === 'current');
    const currentLessonName = currentLesson
      ? `第 ${currentLesson.lessonOrder} 课：${currentLesson.title}`
      : '暂无';

    return {
      textbookId,
      lessonCount: result.lessons.length,
      nodeCount: result.nodes.length,
      relationCount: result.relations.length,
      scriptCount,
      currentLessonName
    };
  } catch (error) {
    // 回滚
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
