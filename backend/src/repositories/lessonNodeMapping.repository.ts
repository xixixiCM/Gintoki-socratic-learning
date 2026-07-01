import { pool } from '../db/pool';

export interface LessonNodeMappingRow {
  id: number;
  lesson_id: number;
  node_id: number;
  role: string;
  display_order: number;
}

/**
 * 查询某课全部节点映射
 */
export async function findMappingsByLessonId(lessonId: number): Promise<LessonNodeMappingRow[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM lesson_node_mapping WHERE lesson_id = ? ORDER BY display_order ASC',
      [lessonId]
    );
    return rows as LessonNodeMappingRow[];
  } finally {
    connection.release();
  }
}

/**
 * 查询某课 main 节点的 node_id 列表
 */
export async function findMainNodeIdsByLessonId(lessonId: number): Promise<number[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT node_id FROM lesson_node_mapping WHERE lesson_id = ? AND role = ?',
      [lessonId, 'main']
    );
    return rows.map((r: any) => r.node_id);
  } finally {
    connection.release();
  }
}

/**
 * 查询某课全部 node_id 列表
 */
export async function findNodeIdsByLessonId(lessonId: number): Promise<number[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT node_id FROM lesson_node_mapping WHERE lesson_id = ?',
      [lessonId]
    );
    return rows.map((r: any) => r.node_id);
  } finally {
    connection.release();
  }
}
