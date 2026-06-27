# AI_CONTEXT.md

## 项目名称

基于知识图谱与大模型的 AI 虚拟人物苏格拉底式学习系统

## 技术栈

前端：React + TypeScript + Tailwind CSS + Axios + ECharts
后端：Node.js + Express + TypeScript
数据库：MySQL
AI：DeepSeek API
提示词系统：Markdown Workspace

## 当前版本目标

本项目是课程实训基础版，只做本地运行的 B/S 系统。

必须完成：
1. 登录
2. 知识点管理
3. 知识关系管理
4. 知识图谱展示
5. 学习路径生成
6. AI 讲解
7. AI 苏格拉底追问
8. 小测题生成
9. 对话记录保存
10. 后台统计

暂时不做：
1. PDF 自动导入
2. 自动生成知识图谱
3. Neo4j
4. 多 Workspace 切换
5. 多角色复杂剧情
6. 白板
7. 长期复杂记忆算法
8. 部署上线

## 后端目录

backend/src
├── routes
├── controllers
├── services
├── repositories
├── db
├── middlewares
├── utils
└── types

## 前端目录

frontend/src
├── api
├── components
├── layouts
├── pages
├── router
├── store
├── types
└── utils

## 统一返回格式

所有后端接口统一返回：

{
  code: number,
  message: string,
  data: any
}

成功 code = 200。

## 数据库核心表

user
workspace
kg_node
kg_relation
learning_record
ai_character
ai_chat_record
admin_stat_log

## AI 规则

Prompt 不写死在代码中。

系统规则、角色设定、教学规则、课程大纲、学习进度、模板都放在：

backend/workspaces/ml_gintoki/

ai.service.ts 负责组织 Prompt。
workspace.service.ts 负责读取 Markdown 文件。
deepseek.service.ts 负责调用 DeepSeek API。

## 开发规则

1. 不要引入新的技术栈。
2. 不要随意修改目录结构。
3. 不要一次性生成整个项目。
4. 每次只实现一个模块。
5. 如果修改多个文件，先列出修改计划。
6. 数据库字段必须以 DATABASE.md 为准。
7. 接口路径必须以 API.md 为准。