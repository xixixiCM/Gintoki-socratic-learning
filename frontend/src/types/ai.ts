export interface AiHealthResponse {
  provider: string;
  baseUrl: string;
  model: string;
  configured: boolean;
}

export interface AiMessageResponse {
  messageId: number;
  role: 'assistant';
  speaker: string;
  content: string;
  actionType: 'lesson_explain' | 'socratic_followup' | 'lesson_summary';
  model: string;
  fallback: boolean;
  latencyMs?: number;
}

export interface AiHistoryMessage {
  id: number;
  role: 'user' | 'assistant';
  speaker: string;
  content: string;
  actionType: string;
  createdAt: string;
}
