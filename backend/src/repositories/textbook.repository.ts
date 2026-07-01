import { pool } from '../db/pool';

export interface TextbookRow {
  id: number;
  title: string;
  course_name: string;
  total_pages: number;
  status: string;
}

/**
 * 查询默认教材（取第一条）
 */
export async function findDefaultTextbook(): Promise<TextbookRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT id, title, course_name, total_pages, status FROM textbook ORDER BY id ASC LIMIT 1'
    );
    return rows.length > 0 ? (rows[0] as TextbookRow) : null;
  } finally {
    connection.release();
  }
}

/**
 * 更新教材状态
 */
export async function updateTextbookStatus(textbookId: number, status: string): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE textbook SET status = ? WHERE id = ?', [status, textbookId]);
  } finally {
    connection.release();
  }
}
