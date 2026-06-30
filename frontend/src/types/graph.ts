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
