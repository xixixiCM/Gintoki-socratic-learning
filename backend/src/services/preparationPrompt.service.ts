import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

/**
 * 读取备课 Prompt 模板文件并替换变量。
 *
 * 支持的模板名称：
 * - extract_nodes
 * - extract_relations
 * - split_lessons
 * - generate_lesson_script
 *
 * 支持的变量：
 * - {{textbookContent}}
 * - {{nodesJson}}
 * - {{relationsJson}}
 * - {{lessonJson}}
 * - {{lessonNodesJson}}
 * - {{lessonRelationsJson}}
 */
export function renderPreparationPrompt(
  templateName: string,
  variables: Record<string, string>
): string {
  const workspaceDir = env.workspaceDir;
  const filePath = path.resolve(workspaceDir, 'templates', 'preparation', `${templateName}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`备课 Prompt 模板不存在：${filePath}`);
  }

  let template = fs.readFileSync(filePath, 'utf-8');

  // 替换所有 {{variable}} 占位符
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    template = template.split(placeholder).join(value);
  }

  // 检查是否有未替换的占位符
  const unresolved = template.match(/\{\{\w+\}\}/g);
  if (unresolved) {
    console.warn(`[preparationPrompt] 模板 ${templateName} 存在未替换的占位符：${unresolved.join(', ')}`);
  }

  return template;
}
