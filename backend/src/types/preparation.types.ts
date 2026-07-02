// ========== V0.7 备课类型 ==========

export interface GeneratedNode {
  tempId: string;
  name: string;
  category: string;
  difficulty: number;
  description: string;
  content: string;
}

export interface GeneratedRelation {
  sourceTempId: string;
  targetTempId: string;
  relationType: string;
  description?: string;
}

export interface GeneratedLesson {
  tempId: string;
  lessonOrder: number;
  title: string;
  objective: string;
  textbookPages: string;
  status: 'locked' | 'current' | 'completed';
  maxDurationMinutes: number;
  estimatedDurationMinutes?: number;
  summary?: string;
  nodeMappings: GeneratedNodeMapping[];
}

export interface GeneratedNodeMapping {
  nodeTempId: string;
  role: 'main' | 'review' | 'support' | 'preview';
  displayOrder: number;
}

export interface GeneratedLessonScript {
  lessonTempId: string;
  messages: GeneratedScriptMessage[];
}

export interface GeneratedScriptMessage {
  scriptOrder: number;
  role: 'teacher' | 'student';
  speaker: string;
  messageType: 'opening' | 'explanation' | 'question' | 'answer' | 'summary';
  content: string;
}

// ========== 最终组装结果 ==========

export interface PreparationGeneratedResult {
  textbook: {
    title: string;
    courseName: string;
    totalPages: number;
    status: 'prepared';
  };
  nodes: GeneratedNode[];
  relations: GeneratedRelation[];
  lessons: GeneratedLesson[];
  scripts: GeneratedLessonScript[];
}

// ========== 入库统计 ==========

export interface PreparationPersistSummary {
  textbookId: number;
  lessonCount: number;
  nodeCount: number;
  relationCount: number;
  scriptCount: number;
  currentLessonName: string;
}

// ========== 备课响应 ==========

export interface PreparationGenerateResponse {
  taskId: number;
  textbookId: number;
  lessonCount: number;
  nodeCount: number;
  relationCount: number;
  scriptCount: number;
  currentLessonName: string;
  status: 'success' | 'failed';
}

// ========== 任务状态 ==========

export type PreparationTaskStatus = 'pending' | 'running' | 'success' | 'failed';

// ========== Artifact 类型 ==========

export type PreparationArtifactType =
  | 'nodes'
  | 'relations'
  | 'lessons'
  | 'scripts'
  | 'final_result'
  | 'error';
