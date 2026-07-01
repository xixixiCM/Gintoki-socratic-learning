/**
 * 数据库重置脚本 (V0.4)
 *
 * 用法：npm run db:reset  (在 backend 目录下执行)
 *
 * 按顺序执行 database/ 目录下的 SQL 文件：
 *   reset → schema → seed_users → seed_kg_nodes → seed_kg_relations
 *   → seed_textbook → seed_lessons → seed_lesson_scripts
 *   → seed_lesson_node_mapping → seed_graph_progress → seed_lesson_sessions
 *
 * 安全限制：仅在 NODE_ENV=development 时允许执行。
 */

import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// ========== 1. 加载环境变量 ==========

// 优先从 backend/.env 加载
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // fallback: 项目根目录
  dotenv.config();
}

// ========== 2. 环境检查 ==========

const nodeEnv = process.env.NODE_ENV ?? 'development';
if (nodeEnv !== 'development') {
  console.error(
    `[reset-db] ERROR: NODE_ENV is "${nodeEnv}", not "development". ` +
    `Refusing to run database reset in non-development environment.`
  );
  process.exit(1);
}

// ========== 3. 数据库连接配置 ==========

const dbConfig: mysql.ConnectionOptions = {
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'ai_socratic_learning',
  charset: process.env.DB_CHARSET ?? 'utf8mb4',
  multipleStatements: true       // 支持多语句 SQL 文件
};

// ========== 4. SQL 文件列表 ==========

/**
 * database/ 相对于 backend/scripts/ 的路径
 * scripts/reset-db.ts  →  ../../database  →  ../../database/reset.sql
 *
 * 实际上：backend/scripts/ → ../database/
 */
const SQL_DIR = path.resolve(__dirname, '..', '..', 'database');

const SQL_FILES = [
  'reset.sql',
  'schema.sql',
  'seed_users.sql',
  'seed_kg_nodes.sql',
  'seed_kg_relations.sql',
  'seed_textbook.sql',
  'seed_lessons.sql',
  'seed_lesson_scripts.sql',
  'seed_lesson_node_mapping.sql',
  'seed_graph_progress.sql',
  'seed_lesson_sessions.sql'
] as const;

// ========== 5. 主流程 ==========

async function resetDatabase(): Promise<void> {
  console.log(`[reset-db] Environment: ${nodeEnv}`);
  console.log(`[reset-db] Host: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`[reset-db] Database: ${dbConfig.database}`);
  console.log(`[reset-db] SQL directory: ${SQL_DIR}\n`);

  let connection: mysql.Connection | null = null;

  try {
    // 第一步：建立连接（不指定 database），确保数据库存在
    const initConfig: mysql.ConnectionOptions = {
      ...dbConfig,
      database: undefined
    };
    connection = await mysql.createConnection(initConfig);

    // 创建数据库（如果不存在）
    const dbName = dbConfig.database ?? 'ai_socratic_learning';
    console.log(`[reset-db] Ensuring database "${dbName}" exists ...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`[reset-db] ✓ Database "${dbName}" ready.\n`);

    // 切换到目标数据库
    await connection.query(`USE \`${dbName}\``);

    for (const fileName of SQL_FILES) {
      const filePath = path.join(SQL_DIR, fileName);

      console.log(`[reset-db] Executing: ${fileName} ...`);

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        console.error(`[reset-db] ERROR: File not found — ${filePath}`);
        await connection.end();
        process.exit(1);
      }

      // 读取 SQL 文件
      const sql = fs.readFileSync(filePath, 'utf-8');
      if (sql.trim().length === 0) {
        console.warn(`[reset-db] WARNING: ${fileName} is empty, skipped.`);
        continue;
      }

      try {
        // 执行 SQL（支持多语句）
        await connection.query(sql);
        console.log(`[reset-db] ✓ ${fileName} done.\n`);
      } catch (queryError) {
        const err = queryError as Error;
        console.error(`\n[reset-db] FAILED on: ${fileName}`);
        console.error(`[reset-db] Error: ${err.message}`);
        if (connection) await connection.end();
        process.exit(1);
      }
    }

    console.log('[reset-db] ===============================');
    console.log('[reset-db] Database reset completed.');
    console.log('[reset-db] ===============================');
  } catch (error) {
    const err = error as Error;
    console.error(`[reset-db] Connection or execution failed: ${err.message}`);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

// ========== 6. 执行 ==========

resetDatabase();
