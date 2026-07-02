SET FOREIGN_KEY_CHECKS = 0;

-- V0.7 新表（先删依赖表）
DROP TABLE IF EXISTS preparation_artifact;
DROP TABLE IF EXISTS preparation_task;

-- V0.4 新表（先删依赖表）
DROP TABLE IF EXISTS lesson_session;
DROP TABLE IF EXISTS lesson_node_mapping;
DROP TABLE IF EXISTS lesson_script;
DROP TABLE IF EXISTS graph_progress;
DROP TABLE IF EXISTS lesson;
DROP TABLE IF EXISTS textbook;

-- 原有表
DROP TABLE IF EXISTS ai_chat_record;
DROP TABLE IF EXISTS ai_character;
DROP TABLE IF EXISTS admin_stat_log;
DROP TABLE IF EXISTS learning_record;
DROP TABLE IF EXISTS kg_relation;
DROP TABLE IF EXISTS kg_node;
DROP TABLE IF EXISTS workspace;
DROP TABLE IF EXISTS user;

SET FOREIGN_KEY_CHECKS = 1;

-- 执行顺序建议：
-- 1. 运行 reset.sql
-- 2. 运行 schema.sql
-- 3. 运行 seed_users.sql
-- 4. 运行 seed_kg_nodes.sql
-- 5. 运行 seed_kg_relations.sql
-- 6. 运行 seed_textbook.sql
-- 7. 运行 seed_lessons.sql
-- 8. 运行 seed_lesson_scripts.sql
-- 9. 运行 seed_lesson_node_mapping.sql
-- 10. 运行 seed_graph_progress.sql
-- 11. 运行 seed_lesson_sessions.sql
