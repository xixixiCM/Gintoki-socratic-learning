import { pool } from '../db/pool';

export interface LessonRow {
  id: number;
  textbook_id: number;
  lesson_order: number;
  title: string;
  objective: string | null;
  status: string;
  textbook_pages: string | null;
  max_duration_minutes: number;
  estimated_duration_minutes: number | null;
  summary: string | null;
}

/**
 * 查询当前课时 (status = current)
 */
export async function findCurrentLesson(): Promise<LessonRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson WHERE status = ? ORDER BY lesson_order ASC LIMIT 1',
      ['current']
    );
    return rows.length > 0 ? (rows[0] as LessonRow) : null;
  } finally {
    connection.release();
  }
}

/**
 * 根据 ID 查课时
 */
export async function findLessonById(lessonId: number): Promise<LessonRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson WHERE id = ?',
      [lessonId]
    );
    return rows.length > 0 ? (rows[0] as LessonRow) : null;
  } finally {
    connection.release();
  }
}

/**
 * 查询可见课时 (completed + current)，按 lesson_order ASC
 */
export async function findVisibleLessons(): Promise<LessonRow[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson WHERE status IN (?, ?) ORDER BY lesson_order ASC',
      ['completed', 'current']
    );
    return rows as LessonRow[];
  } finally {
    connection.release();
  }
}

/**
 * 统计已完成课时数
 */
export async function countCompletedLessons(): Promise<number> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>('SELECT COUNT(*) AS cnt FROM lesson WHERE status = ?', ['completed']);
    return rows[0]?.cnt ?? 0;
  } finally {
    connection.release();
  }
}

/**
 * 统计可见课时数
 */
export async function countVisibleLessons(): Promise<number> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>('SELECT COUNT(*) AS cnt FROM lesson WHERE status IN (?, ?)', ['completed', 'current']);
    return rows[0]?.cnt ?? 0;
  } finally {
    connection.release();
  }
}

/**
 * 统计全部课时数
 */
export async function countAllLessons(): Promise<number> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>('SELECT COUNT(*) AS cnt FROM lesson');
    return rows[0]?.cnt ?? 0;
  } finally {
    connection.release();
  }
}

/**
 * 查找下一个课时 (lesson_order > currentLessonOrder, order ASC, limit 1)
 */
export async function findNextLesson(currentLessonOrder: number): Promise<LessonRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson WHERE lesson_order > ? ORDER BY lesson_order ASC LIMIT 1',
      [currentLessonOrder]
    );
    return rows.length > 0 ? (rows[0] as LessonRow) : null;
  } finally {
    connection.release();
  }
}

/**
 * 更新课时状态
 */
export async function updateLessonStatus(lessonId: number, status: string): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE lesson SET status = ? WHERE id = ?', [status, lessonId]);
  } finally {
    connection.release();
  }
}
