import { pool } from '../db/pool';
import type { CreateAiChatRecordInput, AiChatRecordRow } from '../types/ai.types';

/**
 * 创建 AI 对话记录
 */
export async function createAiChatRecord(input: CreateAiChatRecordInput): Promise<AiChatRecordRow> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<any>(
      `INSERT INTO ai_chat_record
        (lesson_id, lesson_session_id, node_id, action_type, role, speaker,
         user_message, ai_response, prompt_snapshot, model_name,
         success, fallback_used, latency_ms, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.lessonId ?? null,
        input.lessonSessionId ?? null,
        input.nodeId ?? null,
        input.actionType,
        input.role,
        input.speaker ?? null,
        input.userMessage ?? null,
        input.aiResponse ?? null,
        input.promptSnapshot ?? null,
        input.modelName ?? null,
        input.success ? 1 : 0,
        input.fallbackUsed ? 1 : 0,
        input.latencyMs ?? null,
        input.errorMessage ?? null
      ]
    );

    const insertId = (result as any).insertId;
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM ai_chat_record WHERE id = ?',
      [insertId]
    );
    return rows[0] as AiChatRecordRow;
  } finally {
    connection.release();
  }
}

/**
 * 查询 AI 对话历史（按 lessonId + 可选 sessionId）
 */
export async function findAiHistoryByLesson(
  lessonId: number,
  sessionId?: number | null,
  limit: number = 100
): Promise<AiChatRecordRow[]> {
  const connection = await pool.getConnection();
  try {
    let sql = 'SELECT * FROM ai_chat_record WHERE lesson_id = ?';
    const params: any[] = [lessonId];

    if (sessionId != null) {
      sql += ' AND lesson_session_id = ?';
      params.push(sessionId);
    }

    sql += ' ORDER BY created_at ASC LIMIT ?';
    params.push(limit);

    const [rows] = await connection.query<any[]>(sql, params);
    return rows as AiChatRecordRow[];
  } finally {
    connection.release();
  }
}

/**
 * 查询最近的 AI 对话消息（用于构建上下文）
 */
export async function findRecentAiMessages(
  lessonId: number,
  sessionId?: number | null,
  limit: number = 10
): Promise<AiChatRecordRow[]> {
  const connection = await pool.getConnection();
  try {
    let sql = 'SELECT * FROM ai_chat_record WHERE lesson_id = ?';
    const params: any[] = [lessonId];

    if (sessionId != null) {
      sql += ' AND lesson_session_id = ?';
      params.push(sessionId);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const [rows] = await connection.query<any[]>(sql, params);
    // Reverse to chronological order
    return (rows as AiChatRecordRow[]).reverse();
  } finally {
    connection.release();
  }
}
