SET FOREIGN_KEY_CHECKS = 0;

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
