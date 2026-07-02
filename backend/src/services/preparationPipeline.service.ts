import { env } from '../config/env';
import { readDefaultTextbookContent } from './textbookFile.service';
import { generateNodes, generateRelations, generateLessons, generateAllScripts } from './preparationAi.service';
import {
  validateGeneratedNodes,
  validateGeneratedRelations,
  validateGeneratedLessons,
  validateGeneratedScripts,
  validateFinalPreparationResult
} from './preparationValidator.service';
import { persistPreparationResult } from './preparationPersist.service';
import {
  createPreparationTask,
  markPreparationTaskRunning,
  markPreparationTaskSuccess,
  markPreparationTaskFailed,
  updatePreparationTaskCurrentStep
} from '../repositories/preparationTask.repository';
import {
  createPreparationArtifact
} from '../repositories/preparationArtifact.repository';
import type {
  PreparationGeneratedResult,
  PreparationGenerateResponse,
  GeneratedNode,
  GeneratedRelation,
  GeneratedLesson,
  GeneratedLessonScript
} from '../types/preparation.types';

/**
 * V0.7 核心编排：读取默认教材 → AI 生成结构化内容 → 校验 → 入库。
 */
export async function generateDefaultTextbookPreparation(): Promise<PreparationGenerateResponse> {
  // 1. 创建任务
  const task = await createPreparationTask({
    sourceFile: 'default_textbook.md',
    modelName: env.deepseekModel
  });

  const taskId = task.id;

  try {
    // 2. 标记运行中
    await markPreparationTaskRunning(taskId);

    // 3. 读取教材
    console.log('[preparationPipeline] 读取默认教材...');
    await updatePreparationTaskCurrentStep(taskId, 'reading_textbook');
    const textbookContent = readDefaultTextbookContent();

    // 4. AI 生成 nodes
    console.log('[preparationPipeline] 调用 AI 抽取知识点...');
    await updatePreparationTaskCurrentStep(taskId, 'extracting_nodes');
    let rawNodes = '';
    let nodes: GeneratedNode[];
    try {
      rawNodes = JSON.stringify(await generateNodes(textbookContent));
      const parsed = JSON.parse(rawNodes);
      nodes = validateGeneratedNodes(Array.isArray(parsed) ? parsed : parsed.nodes);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await createPreparationArtifact(taskId, 'error', { step: 'extract_nodes', error: errorMsg, raw: rawNodes ?? '' });
      throw new Error(`抽取知识点失败：${errorMsg}`);
    }
    await createPreparationArtifact(taskId, 'nodes', nodes);
    console.log(`[preparationPipeline] 抽取到 ${nodes.length} 个知识点`);

    // 5. AI 生成 relations
    console.log('[preparationPipeline] 调用 AI 抽取知识关系...');
    await updatePreparationTaskCurrentStep(taskId, 'extracting_relations');
    let rawRelations = '';
    let relations: GeneratedRelation[];
    try {
      rawRelations = JSON.stringify(await generateRelations(textbookContent, nodes));
      const parsed = JSON.parse(rawRelations);
      relations = validateGeneratedRelations(Array.isArray(parsed) ? parsed : parsed.relations, nodes);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await createPreparationArtifact(taskId, 'error', { step: 'extract_relations', error: errorMsg, raw: rawRelations ?? '' });
      throw new Error(`抽取知识关系失败：${errorMsg}`);
    }
    await createPreparationArtifact(taskId, 'relations', relations);
    console.log(`[preparationPipeline] 抽取到 ${relations.length} 条关系`);

    // 6. AI 生成 lessons
    console.log('[preparationPipeline] 调用 AI 拆分课时...');
    await updatePreparationTaskCurrentStep(taskId, 'splitting_lessons');
    let rawLessons = '';
    let lessons: GeneratedLesson[];
    try {
      rawLessons = JSON.stringify(await generateLessons(textbookContent, nodes, relations));
      const parsed = JSON.parse(rawLessons);
      lessons = validateGeneratedLessons(Array.isArray(parsed) ? parsed : parsed.lessons, nodes);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await createPreparationArtifact(taskId, 'error', { step: 'split_lessons', error: errorMsg, raw: rawLessons ?? '' });
      throw new Error(`拆分课时失败：${errorMsg}`);
    }
    await createPreparationArtifact(taskId, 'lessons', lessons);
    console.log(`[preparationPipeline] 拆分为 ${lessons.length} 个课时`);

    // 7. AI 生成 scripts（逐个课时）
    console.log('[preparationPipeline] 调用 AI 生成课堂脚本...');
    await updatePreparationTaskCurrentStep(taskId, 'generating_scripts');
    let rawScripts: string;
    let scripts: GeneratedLessonScript[];
    try {
      scripts = await generateAllScripts(textbookContent, lessons, nodes, relations);
      rawScripts = JSON.stringify(scripts);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await createPreparationArtifact(taskId, 'error', { step: 'generate_scripts', error: errorMsg, raw: '' });
      throw new Error(`生成课堂脚本失败：${errorMsg}`);
    }
    validateGeneratedScripts(scripts, lessons);
    await createPreparationArtifact(taskId, 'scripts', scripts);
    console.log(`[preparationPipeline] 生成了 ${scripts.length} 份课堂脚本`);

    // 8. 组装最终结果
    const finalResult: PreparationGeneratedResult = {
      textbook: {
        title: '机器学习入门体验教材',
        courseName: '机器学习入门',
        totalPages: 15,
        status: 'prepared'
      },
      nodes,
      relations,
      lessons,
      scripts
    };

    validateFinalPreparationResult(finalResult);
    await createPreparationArtifact(taskId, 'final_result', finalResult);

    // 9. 事务写入数据库
    console.log('[preparationPipeline] 写入数据库...');
    await updatePreparationTaskCurrentStep(taskId, 'writing_db');
    const summary = await persistPreparationResult(finalResult, taskId);

    // 10. 标记成功
    await updatePreparationTaskCurrentStep(taskId, 'done');
    await markPreparationTaskSuccess(taskId, summary.textbookId);

    console.log(`[preparationPipeline] 备课完成：${summary.lessonCount} 课时, ${summary.nodeCount} 节点, ${summary.relationCount} 关系, ${summary.scriptCount} 脚本`);

    return {
      taskId,
      ...summary,
      status: 'success'
    };
  } catch (error) {
    // 失败处理
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[preparationPipeline] 备课失败：', errorMessage);

    try {
      await markPreparationTaskFailed(taskId, errorMessage);
      await createPreparationArtifact(taskId, 'error', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
    } catch (dbError) {
      console.error('[preparationPipeline] 记录失败状态时出错：', dbError);
    }

    return {
      taskId,
      textbookId: 0,
      lessonCount: 0,
      nodeCount: 0,
      relationCount: 0,
      scriptCount: 0,
      currentLessonName: '',
      status: 'failed'
    };
  }
}
