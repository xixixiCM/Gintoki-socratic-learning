export interface GraphNode {
  id: number;
  name: string;
  category: string;
  difficulty: number;
}

export interface GraphLink {
  source: number;
  target: number;
  relationType: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
