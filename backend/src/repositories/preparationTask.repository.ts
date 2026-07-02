import { pool } from '../db/pool';
import type { PreparationTaskStatus } from '../types/preparation.types';

export interface PreparationTaskRow {
  id: number;
  textbook_id: number | null;
  status: PreparationTaskStatus;
  current_step: string | null;
  source_file: string;
  model_name: string | null;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePreparationTaskInput {
  textbookId?: number | null;
  sourceFile: string;
  modelName?: string | null;
}

/**
 * 创建备课任务
 */
export async function createPreparationTask(input: CreatePreparationTaskInput): Promise<PreparationTaskRow> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<any>(
      `INSERT INTO preparation_task (textbook_id, source_file, model_name, status)
       VALUES (?, ?, ?, 'pending')`,
      [input.textbookId ?? null, input.sourceFile, input.modelName ?? null]
    );
    const taskId = (result as any).insertId;
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM preparation_task WHERE id = ?',
      [taskId]
    );
    return rows[0] as PreparationTaskRow;
  } finally {
    connection.release();
  }
}

/**
 * 更新任务状态
 */
export async function updatePreparationTaskStatus(
  taskId: number,
  status: PreparationTaskStatus,
  errorMessage?: string | null
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    if (status === 'running') {
      await connection.query(
        'UPDATE preparation_task SET status = ?, started_at = NOW() WHERE id = ?',
        [status, taskId]
      );
    } else if (status === 'success' || status === 'failed') {
      await connection.query(
        'UPDATE preparation_task SET status = ?, finished_at = NOW(), error_message = ? WHERE id = ?',
        [status, errorMessage ?? null, taskId]
      );
    } else {
      await connection.query(
        'UPDATE preparation_task SET status = ?, error_message = ? WHERE id = ?',
        [status, errorMessage ?? null, taskId]
      );
    }
  } finally {
    connection.release();
  }
}

/**
 * 标记任务为运行中
 */
export async function markPreparationTaskRunning(taskId: number): Promise<void> {
  await updatePreparationTaskStatus(taskId, 'running');
}

/**
 * 标记任务为成功
 */
export async function markPreparationTaskSuccess(taskId: number, textbookId: number): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'UPDATE preparation_task SET status = ?, textbook_id = ?, finished_at = NOW() WHERE id = ?',
      ['success', textbookId, taskId]
    );
  } finally {
    connection.release();
  }
}

/**
 * 标记任务为失败
 */
export async function markPreparationTaskFailed(taskId: number, errorMessage: string): Promise<void> {
  await updatePreparationTaskStatus(taskId, 'failed', errorMessage);
}

/**
 * 查询最近一次备课任务
 */
export async function findLatestPreparationTask(): Promise<PreparationTaskRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM preparation_task ORDER BY created_at DESC LIMIT 1'
    );
    return rows.length > 0 ? (rows[0] as PreparationTaskRow) : null;
  } finally {
    connection.release();
  }
}

/**
 * 根据 ID 查询备课任务
 */
export async function findPreparationTaskById(taskId: number): Promise<PreparationTaskRow | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<any[]>(
      'SELECT * FROM preparation_task WHERE id = ?',
      [taskId]
    );
    return rows.length > 0 ? (rows[0] as PreparationTaskRow) : null;
  } finally {
    connection.release();
  }
}

/**
 * 更新任务当前步骤
 */
export async function updatePreparationTaskCurrentStep(
  taskId: number,
  currentStep: string
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'UPDATE preparation_task SET current_step = ? WHERE id = ?',
      [currentStep, taskId]
    );
  } finally {
    connection.release();
  }
}
