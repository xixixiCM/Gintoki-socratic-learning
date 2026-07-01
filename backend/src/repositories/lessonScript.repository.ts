import { pool } from '../db/pool';

export interface LessonScriptRow {
  id: number;
  lesson_id: number;
  script_order: number;
  role: string;
  speaker: string;
  content: string;
  message_type: string | null;
}

/**
 * 查询某课全部脚本，按 script_order ASC
 */
export async function findScriptsByLessonId(lessonId: number): Promise<LessonScriptRow[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson_script WHERE lesson_id = ? ORDER BY script_order ASC',
      [lessonId]
    );
    return rows as LessonScriptRow[];
  } finally {
    connection.release();
  }
}

/**
 * 统计有脚本的课时数
 */
export async function countScriptLessons(): Promise<number> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT COUNT(DISTINCT lesson_id) AS cnt FROM lesson_script'
    );
    return rows[0]?.cnt ?? 0;
  } finally {
    connection.release();
  }
}
