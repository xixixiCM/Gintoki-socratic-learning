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
5. [database/seed_textbook.sql](database/seed_textbook.sql)
6. [database/seed_lessons.sql](database/seed_lessons.sql)
7. [database/seed_lesson_scripts.sql](database/seed_lesson_scripts.sql)
8. [database/seed_lesson_node_mapping.sql](database/seed_lesson_node_mapping.sql)
9. [database/seed_graph_progress.sql](database/seed_graph_progress.sql)
10. [database/seed_lesson_sessions.sql](database/seed_lesson_sessions.sql)

或使用 `mysql` 命令行导入：

```bash
mysql -u root -p ai_socratic_learning < database/schema.sql
mysql -u root -p ai_socratic_learning < database/seed_users.sql
mysql -u root -p ai_socratic_learning < database/seed_kg_nodes.sql
mysql -u root -p ai_socratic_learning < database/seed_kg_relations.sql
mysql -u root -p ai_socratic_learning < database/seed_textbook.sql
mysql -u root -p ai_socratic_learning < database/seed_lessons.sql
mysql -u root -p ai_socratic_learning < database/seed_lesson_scripts.sql
mysql -u root -p ai_socratic_learning < database/seed_lesson_node_mapping.sql
mysql -u root -p ai_socratic_learning < database/seed_graph_progress.sql
mysql -u root -p ai_socratic_learning < database/seed_lesson_sessions.sql
```

也可一键重置后导入：

```bash
mysql -u root -p ai_socratic_learning < database/reset.sql
mysql -u root -p ai_socratic_learning < database/schema.sql
# 然后依次导入以上所有 seed 文件
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
2. 接入 DeepSeek API 的受控调用
3. 完善学习记录、对话记录和统计功能
4. 实现小测题生成

---

## V0.3 已完成功能

- ✅ 教材书架页 (Home.tsx + TextbookShelf + TextbookCard)
- ✅ AI 备课流程模拟 (PreparationPanel + POST /api/preparation/default-textbook)
- ✅ Classroom.tsx 课堂三栏页面
- ✅ 左侧课时记录列表 (LessonRecordList)
- ✅ 中间课堂对话 (ClassroomChat)
- ✅ 右侧当前课时局部知识图谱 (LessonKnowledgeGraph + /api/lessons/:lessonId/graph)
- ✅ 后端 lesson / textbook / learning / preparation 全套接口骨架
- ✅ 统一返回格式 { code, message, data }

## V0.4 已完成功能

- ✅ 新增 6 张数据库表：textbook、lesson、lesson_script、lesson_node_mapping、graph_progress、lesson_session
- ✅ 新增对应 seed 数据文件
- ✅ 教材信息由 MySQL textbook 表驱动
- ✅ 学习概览由数据库统计生成（completed 课时数、点亮节点数等）
- ✅ 课时记录由 lesson + lesson_session 表驱动
- ✅ 课堂对话由 lesson_script 表驱动
- ✅ 当前课时局部知识图谱由 lesson_node_mapping + kg_node + kg_relation + graph_progress 驱动
- ✅ POST /api/lessons/:lessonId/start — 开始课堂（创建 lesson_session）
- ✅ POST /api/lessons/:lessonId/complete — 完成课堂（transaction: 完成课时 + 点亮节点 + 解锁下一课）
- ✅ 完成本课后自动点亮本课 main 知识点
- ✅ 完成本课后自动解锁下一课
- ✅ 前端优先请求后端，后端失败时 fallback 到本地 mock（保留 frontend/src/mock/defaultTextbook.ts）
- ✅ 6 个新增 repository 文件（textbook / lesson / lessonScript / lessonNodeMapping / graphProgress / lessonSession）
- ✅ GET /api/graph 保持 V0.2 逻辑不变
- ✅ 后端所有 service 从同步改为异步（async/await）

## V0.5 已完成功能

- ✅ 接入 DeepSeek API（deepseek.service.ts）
- ✅ AI 动态课堂对话：POST /api/ai/lesson-explain（AI 继续讲解）
- ✅ AI 苏格拉底式追问：POST /api/ai/socratic-followup
- ✅ AI 课堂总结：POST /api/ai/lesson-summary
- ✅ ClassroomChat 支持动态对话消息（DynamicMessage）
- ✅ AI 调用失败时前端自动展示 fallback 消息
- ✅ 提问禁用态：AI 正在回复时禁止连续点击
- ✅ 返回教材书架按钮在 AI 回复中仍可点击
- ✅ Markdown Workspace 提示词系统（workspace.service.ts + aiPrompt.service.ts）
- ✅ AI 对话记录保存到 ai_chat_record 表

## V0.6 已完成功能

- ✅ 双身份登录：普通用户（STUDENT）/ 管理员（ADMIN）
- ✅ JWT 鉴权（auth.middleware.ts + admin.middleware.ts）
- ✅ 登录页（Login.tsx）
- ✅ 登录后根据 role 跳转不同页面
- ✅ 普通用户登录后进入学习端首页 /home
- ✅ 管理员登录后进入管理员后台 /admin
- ✅ 管理员后台：用户信息概览（AdminDashboard）
- ✅ 管理员后台：用户信息管理（AdminUsers，支持搜索/筛选）
- ✅ 普通用户不能访问 /admin/*
- ✅ 管理员可以访问学生端页面（默认入口为 /admin）
- ✅ 前端自动携带 token、401 自动跳转登录页
- ✅ 后端管理员接口加入角色校验
- ✅ 不影响 V0.5 课堂、AI、图谱、课时完成逻辑

### V0.6 登录说明

新增双身份登录：

| 角色 | 用户名 | 密码 | 登录后默认页面 |
|---|---|---|---|
| 普通用户 | student | 123456 | /home |
| 管理员 | admin | 123456 | /admin |

普通用户进入学习端：`/home`
管理员进入后台：`/admin`

管理员后台当前只包含：
1. 用户信息查看
2. 用户信息搜索 / 筛选

> 注意：管理员后台不查看用户学习状态、不查看 AI 对话记录、不管理教材课时。

### V0.6 新增接口

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| POST | /api/auth/login | 用户登录 | 公开 |
| GET | /api/auth/me | 获取当前用户信息 | 登录 |
| POST | /api/auth/logout | 退出登录 | 登录 |
| GET | /api/admin/dashboard | 管理员后台概览 | 管理员 |
| GET | /api/admin/users | 管理员用户列表 | 管理员 |
| GET | /api/admin/users/:id | 管理员用户详情 | 管理员 |

## V0.6.1 已完成功能

- ✅ 普通用户注册功能（POST /api/auth/register）
- ✅ 注册页（Register.tsx）只需要填写名字和密码
- ✅ 注册用户默认 role = STUDENT、status = active
- ✅ 用户名不能重复
- ✅ 不允许注册管理员账号
- ✅ 不需要邮箱、验证码、手机号
- ✅ 注册成功后自动跳转登录页
- ✅ 登录页新增"去注册"入口
- ✅ 新注册用户可在管理员后台用户列表中查看
- ✅ 不影响 V0.5 / V0.6 已有功能

### V0.6.1 注册说明

注册入口：`/register`

注册规则：
1. 只需要填写名字（即登录用户名）和密码
2. 名字不能重复
3. 注册用户默认是普通用户（STUDENT）
4. 不允许注册管理员
5. 不需要邮箱、验证码和手机号
6. 课程实训演示版暂不做密码加密，正式项目应使用 bcrypt

### V0.6.1 新增接口

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| POST | /api/auth/register | 用户注册 | 公开 |


