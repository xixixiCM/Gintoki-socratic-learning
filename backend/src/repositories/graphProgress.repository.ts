import { pool } from '../db/pool';

export interface GraphProgressRow {
  id: number;
  node_id: number;
  status: string;
  completed_lesson_id: number | null;
  completed_at: string | null;
}

/**
 * 统计已点亮节点数
 */
export async function countCompletedNodes(): Promise<number> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT COUNT(*) AS cnt FROM graph_progress WHERE status = ?',
      ['completed']
    );
    return rows[0]?.cnt ?? 0;
  } finally {
    connection.release();
  }
}

/**
 * 按 node_id 列表查询图谱进度
 */
export async function findProgressByNodeIds(nodeIds: number[]): Promise<GraphProgressRow[]> {
  if (nodeIds.length === 0) return [];
  const connection = await pool.getConnection();
  try {
    const placeholders = nodeIds.map(() => '?').join(', ');
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM graph_progress WHERE node_id IN (${placeholders})`,
      nodeIds
    );
    return rows as GraphProgressRow[];
  } finally {
    connection.release();
  }
}

/**
 * 更新节点状态
 */
export async function updateNodesStatus(nodeIds: number[], status: string, completedLessonId?: number): Promise<void> {
  if (nodeIds.length === 0) return;
  const connection = await pool.getConnection();
  try {
    const placeholders = nodeIds.map(() => '?').join(', ');
    if (completedLessonId !== undefined) {
      await connection.query(
        `UPDATE graph_progress SET status = ?, completed_lesson_id = ?, completed_at = NOW() WHERE node_id IN (${placeholders})`,
        [status, completedLessonId, ...nodeIds]
      );
    } else {
      await connection.query(
        `UPDATE graph_progress SET status = ? WHERE node_id IN (${placeholders})`,
        [status, ...nodeIds]
      );
    }
  } finally {
    connection.release();
  }
}

/**
 * 标记节点为已完成
 */
export async function markNodesCompleted(nodeIds: number[], completedLessonId: number): Promise<void> {
  await updateNodesStatus(nodeIds, 'completed', completedLessonId);
}
