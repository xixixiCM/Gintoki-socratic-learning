import { pool } from '../db/pool';

export interface LessonSessionRow {
  id: number;
  lesson_id: number;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number;
  status: string;
  end_type: string | null;
}

/**
 * 创建课堂会话
 */
export async function createLessonSession(lessonId: number): Promise<LessonSessionRow> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<any>(
      'INSERT INTO lesson_session (lesson_id, status, started_at) VALUES (?, ?, NOW())',
      [lessonId, 'in_progress']
    );
    const sessionId = (result as any).insertId;
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson_session WHERE id = ?',
      [sessionId]
    );
    return rows[0] as LessonSessionRow;
  } finally {
    connection.release();
  }
}

/**
 * 查询某课最近一次会话
 */
export async function findLatestSessionByLessonId(lessonId: number): Promise<LessonSessionRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson_session WHERE lesson_id = ? ORDER BY created_at DESC LIMIT 1',
      [lessonId]
    );
    return rows.length > 0 ? (rows[0] as LessonSessionRow) : null;
  } finally {
    connection.release();
  }
}

/**
 * 根据 ID 查会话
 */
export async function findSessionById(sessionId: number): Promise<LessonSessionRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson_session WHERE id = ?',
      [sessionId]
    );
    return rows.length > 0 ? (rows[0] as LessonSessionRow) : null;
  } finally {
    connection.release();
  }
}

/**
 * 完成会话
 */
export async function completeLessonSession(
  sessionId: number,
  endType: string,
  durationSeconds: number
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'UPDATE lesson_session SET status = ?, end_type = ?, ended_at = NOW(), duration_seconds = ? WHERE id = ?',
      ['completed', endType, durationSeconds, sessionId]
    );
  } finally {
    connection.release();
  }
}

/**
 * 查询某课已完成的 session
 */
export async function findCompletedSessionByLessonId(lessonId: number): Promise<LessonSessionRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson_session WHERE lesson_id = ? AND status = ? ORDER BY created_at DESC LIMIT 1',
      [lessonId, 'completed']
    );
    return rows.length > 0 ? (rows[0] as LessonSessionRow) : null;
  } finally {
    connection.release();
  }
}
