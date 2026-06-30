import { pool } from '../db/pool';

export interface KgRelationRow {
  id: number;
  source_id: number;
  target_id: number;
  relation_type: string;
  description: string | null;
}

/**
 * 查询所有知识图谱关系
 */
export async function findAllKgRelations(): Promise<KgRelationRow[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT id, source_id, target_id, relation_type, description FROM kg_relation ORDER BY id ASC'
    );
    return rows as KgRelationRow[];
  } finally {
    connection.release();
  }
}
