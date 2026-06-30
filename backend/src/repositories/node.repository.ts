import { pool } from '../db/pool';

export interface KgNodeRow {
  id: number;
  name: string;
  category: string;
  difficulty: number;
  description: string | null;
}

/**
 * 查询所有知识图谱节点
 */
export async function findAllKgNodes(): Promise<KgNodeRow[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT id, name, category, difficulty, description FROM kg_node ORDER BY id ASC'
    );
    return rows as KgNodeRow[];
  } finally {
    connection.release();
  }
}
