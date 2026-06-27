# DATABASE.md

## user

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| username | varchar(50) | 用户名 |
| password | varchar(255) | 密码 |
| role | varchar(20) | STUDENT / ADMIN |
| nickname | varchar(50) | 昵称 |
| create_time | datetime | 创建时间 |

## kg_node

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| name | varchar(100) | 知识点名称 |
| category | varchar(100) | 分类 |
| difficulty | int | 难度 |
| description | text | 简介 |
| content | text | 详细内容 |
| create_time | datetime | 创建时间 |

## kg_relation

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| source_id | bigint | 起点知识点 |
| target_id | bigint | 终点知识点 |
| relation_type | varchar(50) | 前置知识 / 包含 / 相关知识 |
| description | text | 说明 |

## ai_chat_record

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| user_id | bigint | 用户 ID |
| node_id | bigint | 知识点 ID |
| action_type | varchar(50) | explain / socratic / quiz |
| user_message | text | 用户输入 |
| ai_response | text | AI 回复 |
| create_time | datetime | 创建时间 |