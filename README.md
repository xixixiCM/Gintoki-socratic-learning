# AI 虚拟人物苏格拉底式学习系统

基于知识图谱与大模型的课程实训项目 V0.1 基础框架。当前版本先提供本地可运行的前后端骨架、mock 知识图谱接口和 ECharts Graph 可视化，便于后续逐步扩展学习路径、AI 追问与管理功能。

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

1. 运行 [database/reset.sql](database/reset.sql)
2. 运行 [database/schema.sql](database/schema.sql)
3. 运行 [database/seed_users.sql](database/seed_users.sql)
4. 运行 [database/seed_kg_nodes.sql](database/seed_kg_nodes.sql)
5. 运行 [database/seed_kg_relations.sql](database/seed_kg_relations.sql)

## V0.1 已完成功能

- 后端基础 Express + TypeScript 框架
- `GET /api/health` 健康检查接口
- `GET /api/graph` mock 知识图谱接口
- 前端首页与知识图谱页
- ECharts Graph 知识图谱展示
- 基础数据库 schema 和种子数据文件
- Markdown Workspace 基础目录和模板文件

## 下一步开发计划

1. 补充登录与权限控制
2. 接入 MySQL 真实数据查询
3. 补充知识点与关系管理页面
4. 接入 DeepSeek API 的受控调用
5. 完善学习记录、对话记录和统计功能
