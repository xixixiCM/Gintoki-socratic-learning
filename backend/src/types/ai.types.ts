// ========== AI Context ==========

export interface GraphNodeContext {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'review' | 'support';
}

export interface GraphLinkContext {
  source: number;
  target: number;
  relationType: string;
}

export interface ScriptMessageContext {
  role: 'teacher' | 'student';
  speaker: string;
  content: string;
}

export interface RecentMessageContext {
  role: 'user' | 'assistant';
  content: string;
}

export interface LessonAiContext {
  lessonId: number;
  sessionId?: number | null;
  courseName: string;
  lessonTitle: string;
  objective: string;
  textbookPages: string;
  maxDurationMinutes: number;
  usedTime: string;
  graphNodes: GraphNodeContext[];
  graphLinks: GraphLinkContext[];
  scriptMessages: ScriptMessageContext[];
  recentMessages: RecentMessageContext[];
}

// ========== AI Prompt ==========

export type AiPromptMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AiPromptMessages = AiPromptMessage[];

// ========== AI Chat Record ==========

export type AiActionType = 'lesson_explain' | 'socratic_followup' | 'lesson_summary' | 'student_message';

export type AiChatRole = 'user' | 'assistant' | 'system';

export interface CreateAiChatRecordInput {
  lessonId?: number | null;
  lessonSessionId?: number | null;
  nodeId?: number | null;
  actionType: AiActionType;
  role: AiChatRole;
  speaker?: string | null;
  userMessage?: string | null;
  aiResponse?: string | null;
  promptSnapshot?: string | null;
  modelName?: string | null;
  success: boolean;
  fallbackUsed: boolean;
  latencyMs?: number | null;
  errorMessage?: string | null;
}

export interface AiChatRecordRow {
  id: number;
  lesson_id: number | null;
  lesson_session_id: number | null;
  node_id: number | null;
  action_type: string;
  role: string;
  speaker: string | null;
  user_message: string | null;
  ai_response: string | null;
  prompt_snapshot: string | null;
  model_name: string | null;
  success: number;
  fallback_used: number;
  latency_ms: number | null;
  error_message: string | null;
  created_at: string;
}

// ========== AI Response ==========

export interface AiMessageResponse {
  messageId: number;
  role: 'assistant';
  speaker: string;
  content: string;
  actionType: AiActionType;
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

export interface AiHealthData {
  provider: string;
  baseUrl: string;
  model: string;
  configured: boolean;
}
