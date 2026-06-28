import type { GraphData } from '../types/graph';

const mockGraphData: GraphData = {
  nodes: [
    { id: 1, name: 'Python基础', category: '编程基础', difficulty: 1 },
    { id: 2, name: 'NumPy', category: '数据处理', difficulty: 2 },
    { id: 3, name: '线性代数', category: '数学基础', difficulty: 3 },
    { id: 4, name: '机器学习', category: '核心概念', difficulty: 3 },
    { id: 5, name: '神经网络', category: '深度学习', difficulty: 4 }
  ],
  links: [
    { source: 1, target: 2, relationType: '前置知识' },
    { source: 2, target: 4, relationType: '前置知识' },
    { source: 3, target: 4, relationType: '前置知识' },
    { source: 4, target: 5, relationType: '前置知识' }
  ]
};

export const getGraphData = (): GraphData => mockGraphData;
