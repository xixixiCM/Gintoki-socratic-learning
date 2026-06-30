# AI 虚拟人物苏格拉底式学习系统

基于知识图谱与大模型的课程实训项目。

**V0.2** 已升级知识图谱数据来源：优先从 MySQL 读取 `kg_node` 和 `kg_relation` 表，数据库不可用时自动回退到 mock 数据。

## 技术栈

- 前端：React + TypeScript + Vite + Tailwind CSS + Axios + ECharts
- 后端：Node.js + Express + TypeScript
- 数据库：MySQL
- AI：DeepSeek API 预留配置
- 提示词系统：Markdown Workspace

## 目录结构

- [backend/](backend/)
- [frontend/](frontend/)
- [database/](database/)
- [docs/](docs/)
- [AI_CONTEXT.md](AI_CONTEXT.md)
- [API.md](API.md)
- [DATABASE.md](DATABASE.md)

## 后端启动

```bash
cd backend
npm install
npm run dev
```

后端默认地址：

- 健康检查：[http://localhost:3001/api/health](http://localhost:3001/api/health)
- 知识图谱：[http://localhost:3001/api/graph](http://localhost:3001/api/graph)

## 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端默认地址：[http://localhost:5173](http://localhost:5173/)

## 数据库初始化

数据库脚本位于 [database/](database/)。建议执行顺序如下：

在 MySQL 命令行执行：

```sql
CREATE DATABASE IF NOT EXISTS ai_socratic_learning
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ai_socratic_learning;
```

然后依次导入以下文件（使用 `source` 命令）：

1. [database/schema.sql](database/schema.sql)
2. [database/seed_users.sql](database/seed_users.sql)
3. [database/seed_kg_nodes.sql](database/seed_kg_nodes.sql)
4. [database/seed_kg_relations.sql](database/seed_kg_relations.sql)

或使用 `mysql` 命令行导入：

```bash
mysql -u root -p ai_socratic_learning < database/schema.sql
mysql -u root -p ai_socratic_learning < database/seed_users.sql
mysql -u root -p ai_socratic_learning < database/seed_kg_nodes.sql
mysql -u root -p ai_socratic_learning < database/seed_kg_relations.sql
```

确保 `backend/.env` 中的 `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME` 与数据库配置一致。

## V0.1 已完成功能

- 后端基础 Express + TypeScript 框架
- `GET /api/health` 健康检查接口
- `GET /api/graph` mock 知识图谱接口
- 前端首页与知识图谱页
- ECharts Graph 知识图谱展示
- 基础数据库 schema 和种子数据文件
- Markdown Workspace 基础目录和模板文件

## V0.2 已完成功能

- ✅ `GET /api/graph` 优先从 MySQL `kg_node` 和 `kg_relation` 表读取真实数据
- ✅ 数据库不可用时自动回退到 mock 图谱数据
- ✅ 前端无需改动即可展示数据库驱动的知识图谱
- ✅ 新增 repository 层分离数据访问逻辑
- ✅ 字段自动映射：`source_id` → `source`、`target_id` → `target`、`relation_type` → `relationType`

## 下一步开发计划

1. 补充登录与权限控制
2. 补充知识点与关系管理页面
3. 接入 DeepSeek API 的受控调用
4. 完善学习记录、对话记录和统计功能

