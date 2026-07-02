import { extractJsonText } from './jsonExtract';

/**
 * 安全地将 AI 返回文本解析为 JSON。
 * 先尝试直接 JSON.parse，失败后尝试 extractJsonText 后再 parse。
 * 返回解析结果和原始内容（用于失败时保存 artifact）。
 */
export function safeParseJson<T>(raw: string): { data: T; rawContent: string } {
  const rawContent = raw;

  // 尝试直接解析
  try {
    const data = JSON.parse(raw) as T;
    return { data, rawContent };
  } catch {
    // 尝试提取后解析
  }

  // 尝试提取 JSON 后再解析
  const extracted = extractJsonText(raw);
  try {
    const data = JSON.parse(extracted) as T;
    return { data, rawContent };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`JSON 解析失败：${message}`);
  }
}
