/**
 * 从 AI 返回文本中提取 JSON 字符串。
 * 兼容以下格式：
 * 1. AI 直接返回 JSON；
 * 2. AI 返回 ```json ... ``` 包裹；
 * 3. AI 前后带少量解释文字。
 */
export function extractJsonText(raw: string): string {
  let text = raw.trim();

  // 去除 ```json 和 ``` 包裹
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch) {
    text = codeBlockMatch[1].trim();
  }

  // 找到第一个 { 和最后一个 }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    throw new Error('无法从 AI 返回内容中提取 JSON：未找到有效的 { } 结构');
  }

  return text.slice(firstBrace, lastBrace + 1);
}
