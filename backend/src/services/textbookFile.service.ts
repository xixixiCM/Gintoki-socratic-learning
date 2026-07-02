import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

/**
 * 读取默认教材文件内容。
 * 教材文件路径：workspace/materials/default_textbook.md
 */
export function readDefaultTextbookContent(): string {
  const workspaceDir = env.workspaceDir;
  const filePath = path.resolve(workspaceDir, 'materials', 'default_textbook.md');

  if (!fs.existsSync(filePath)) {
    throw new Error(`默认教材文件不存在：${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8').trim();

  if (!content) {
    throw new Error(`默认教材文件为空：${filePath}`);
  }

  return content;
}
