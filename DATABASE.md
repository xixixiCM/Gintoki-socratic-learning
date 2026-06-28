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
| update_time | datetime | 更新时间 |

## workspace

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| name | varchar(100) | 工作区名称 |
| description | varchar(255) | 说明 |
| root_path | varchar(255) | 工作区根路径 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

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
| update_time | datetime | 更新时间 |

## kg_relation

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| source_id | bigint | 起点知识点 |
| target_id | bigint | 终点知识点 |
| relation_type | varchar(50) | 前置知识 / 包含 / 相关知识 |
| description | text | 说明 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

## learning_record

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| user_id | bigint | 用户 ID |
| node_id | bigint | 知识点 ID |
| progress_status | varchar(30) | 学习状态 |
| note | text | 备注 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

## ai_character

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| workspace_id | bigint | 工作区 ID |
| name | varchar(100) | 角色名称 |
| role_prompt | text | 角色提示词 |
| avatar | varchar(255) | 头像 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

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
| update_time | datetime | 更新时间 |

## admin_stat_log

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| log_type | varchar(50) | 统计类型 |
| stat_date | date | 统计日期 |
| stat_value | int | 统计值 |
| remark | varchar(255) | 备注 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |