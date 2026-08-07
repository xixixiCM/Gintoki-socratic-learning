import { extractJsonText } from './jsonExtract';

function getNextNonWhitespaceChar(text: string, startIndex: number): string {
  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];
    if (!/\s/.test(char)) {
      return char;
    }
  }
  return '';
}

function repairJsonText(raw: string): string {
  const normalized = raw
    .trim()
    .replace(/^\uFEFF/, '')
    .replace(/,\s*([}\]])/g, '$1');

  let repaired = '';
  let inString = false;
  let escaped = false;

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];

    if (!inString) {
      repaired += char;
      if (char === '"') {
        inString = true;
      }
      continue;
    }

    if (escaped) {
      repaired += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      repaired += char;
      escaped = true;
      continue;
    }

    if (char === '\n') {
      repaired += '\\n';
      continue;
    }

    if (char === '\r') {
      continue;
    }

    if (char === '\t') {
      repaired += '\\t';
      continue;
    }

    if (char === '"') {
      const nextChar = getNextNonWhitespaceChar(normalized, index + 1);
      if (nextChar === '' || nextChar === ',' || nextChar === '}' || nextChar === ']' || nextChar === ':') {
        repaired += char;
        inString = false;
      } else {
        repaired += '\\"';
      }
      continue;
    }

    repaired += char;
  }

  return repaired;
}

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
    const repaired = repairJsonText(extracted);

    try {
      const data = JSON.parse(repaired) as T;
      return { data, rawContent };
    } catch (repairErr) {
      const message = repairErr instanceof Error ? repairErr.message : String(repairErr);
      throw new Error(`JSON 解析失败：${message}`);
    }
  }
}
