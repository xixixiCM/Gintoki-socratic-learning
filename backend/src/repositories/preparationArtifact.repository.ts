import { pool } from '../db/pool';
import type { PreparationArtifactType } from '../types/preparation.types';

export interface PreparationArtifactRow {
  id: number;
  task_id: number;
  artifact_type: PreparationArtifactType;
  content_json: string;
  created_at: string;
}

/**
 * 创建备课中间产物
 */
export async function createPreparationArtifact(
  taskId: number,
  artifactType: PreparationArtifactType,
  content: unknown
): Promise<PreparationArtifactRow> {
  const connection = await pool.getConnection();
  try {
    const contentJson = typeof content === 'string' ? content : JSON.stringify(content);
    const [result] = await connection.query<any>(
      'INSERT INTO preparation_artifact (task_id, artifact_type, content_json) VALUES (?, ?, ?)',
      [taskId, artifactType, contentJson]
    );
    const artifactId = (result as any).insertId;
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM preparation_artifact WHERE id = ?',
      [artifactId]
    );
    return rows[0] as PreparationArtifactRow;
  } finally {
    connection.release();
  }
}

/**
 * 查询某任务的全部中间产物
 */
export async function findArtifactsByTaskId(taskId: number): Promise<PreparationArtifactRow[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM preparation_artifact WHERE task_id = ? ORDER BY created_at ASC',
      [taskId]
    );
    return rows as PreparationArtifactRow[];
  } finally {
    connection.release();
  }
}
