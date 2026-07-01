import { env } from '../config/env';
import type { AiPromptMessages } from '../types/ai.types';

interface DeepSeekResult {
  content: string;
  model: string;
}

/**
 * 调用 DeepSeek API（仅负责 HTTP 调用，不拼接业务 Prompt）
 */
export async function callDeepSeek(messages: AiPromptMessages): Promise<DeepSeekResult> {
  const apiKey = env.deepseekApiKey;
  const baseUrl = env.deepseekBaseUrl.replace(/\/$/, '');
  const model = env.deepseekModel;
  const timeoutMs = env.deepseekTimeoutMs;

  if (!apiKey || apiKey === 'your_deepseek_api_key') {
    throw new DeepSeekError('DEEPSEEK_API_KEY not configured', 'config_error');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const statusText = response.statusText;
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch { /* ignore */ }

      if (response.status === 401) {
        throw new DeepSeekError('DeepSeek API 401 Unauthorized — check API Key', 'unauthorized');
      }
      if (response.status === 429) {
        throw new DeepSeekError('DeepSeek API 429 Too Many Requests', 'rate_limited');
      }
      if (response.status >= 500) {
        throw new DeepSeekError(`DeepSeek API ${response.status} Server Error: ${errorBody.slice(0, 200)}`, 'server_error');
      }
      throw new DeepSeekError(`DeepSeek API ${response.status} ${statusText}: ${errorBody.slice(0, 200)}`, 'api_error');
    }

    const data = await response.json() as any;
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      throw new DeepSeekError('DeepSeek returned empty content', 'empty_response');
    }

    return {
      content: content.trim(),
      model: data.model ?? model
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DeepSeekError) {
      throw error;
    }

    // AbortError from timeout (Node fetch uses name-based detection)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new DeepSeekError(`DeepSeek request timed out after ${timeoutMs}ms`, 'timeout');
    }

    // Network or other fetch errors
    const message = error instanceof Error ? error.message : String(error);
    throw new DeepSeekError(`DeepSeek network error: ${message}`, 'network_error');
  }
}

export class DeepSeekError extends Error {
  public readonly errorType: string;

  constructor(message: string, errorType: string) {
    super(message);
    this.name = 'DeepSeekError';
    this.errorType = errorType;
  }
}
