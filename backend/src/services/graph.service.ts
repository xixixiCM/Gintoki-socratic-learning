import { findAllKgNodes } from '../repositories/node.repository';
import { findAllKgRelations } from '../repositories/relation.repository';
import type { GraphData } from '../types/graph';

const mockGraphData: GraphData = {
  nodes: [
    { id: 1, name: 'Python基础', category: '编程基础', difficulty: 1, description: null },
    { id: 2, name: 'NumPy', category: '数据处理', difficulty: 2, description: null },
    { id: 3, name: '线性代数', category: '数学基础', difficulty: 3, description: null },
    { id: 4, name: '机器学习', category: '核心概念', difficulty: 3, description: null },
    { id: 5, name: '神经网络', category: '深度学习', difficulty: 4, description: null }
  ],
  links: [
    { source: 1, target: 2, relationType: '前置知识', description: null },
    { source: 2, target: 4, relationType: '前置知识', description: null },
    { source: 3, target: 4, relationType: '前置知识', description: null },
    { source: 4, target: 5, relationType: '前置知识', description: null }
  ]
};

/**
 * 获取图谱数据
 * 优先从 MySQL 读取，失败则返回 mock 数据
 */
export async function getGraphData(): Promise<GraphData> {
  try {
    const [nodeRows, relationRows] = await Promise.all([
      findAllKgNodes(),
      findAllKgRelations()
    ]);

    if (!nodeRows.length) {
      console.warn('[graph.service] No nodes found in database, fallback to mock data.');
      return mockGraphData;
    }

    const nodes = nodeRows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      difficulty: row.difficulty,
      description: row.description
    }));

    const links = relationRows.map(row => ({
      source: row.source_id,
      target: row.target_id,
      relationType: row.relation_type,
      description: row.description
    }));

    return { nodes, links };
  } catch (error) {
    console.warn('[graph.service] Failed to load graph data from MySQL, fallback to mock data.', error);
    return mockGraphData;
  }
}
