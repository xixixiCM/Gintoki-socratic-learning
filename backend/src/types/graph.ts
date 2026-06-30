export interface GraphNode {
  id: number;
  name: string;
  category: string;
  difficulty: number;
  description?: string | null;
}

export interface GraphLink {
  source: number;
  target: number;
  relationType: string;
  description?: string | null;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// ========== V0.3 课时局部知识图谱类型 ==========

export type LessonGraphNodeStatus = 'completed' | 'current' | 'review' | 'support';

export interface LessonGraphNode {
  id: number;
  name: string;
  status: LessonGraphNodeStatus;
}

export interface LessonGraphLink {
  source: number;
  target: number;
  relationType: string;
}

export interface LessonGraphData {
  nodes: LessonGraphNode[];
  links: LessonGraphLink[];
}
