# API.md

## 统一返回格式

所有接口统一返回：

```json
{
	"code": 200,
	"message": "success",
	"data": {}
}
```

## V0.1 接口

### GET /api/health

返回后端健康状态。

响应示例：

```json
{
	"code": 200,
	"message": "ok",
	"data": {
		"status": "running",
		"service": "ai-socratic-learning-backend"
	}
}
```

### GET /api/graph

返回 mock 知识图谱数据。

响应示例：

```json
{
	"code": 200,
	"message": "success",
	"data": {
		"nodes": [],
		"links": []
	}
}
```

## V0.6 新增接口

### POST /api/auth/login

登录接口。请求体：

```json
{
  "username": "student",
  "password": "123456"
}
```

成功返回：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "username": "student",
      "nickname": "普通学生",
      "role": "STUDENT",
      "status": "active",
      "createdAt": "2026-07-01T00:00:00.000Z"
    }
  }
}
```

### GET /api/auth/me

获取当前登录用户信息。需要 `Authorization: Bearer <token>`。

### POST /api/auth/logout

退出登录。需要 `Authorization: Bearer <token>`。

### GET /api/admin/dashboard

管理员后台概览。需要管理员权限。

### GET /api/admin/users

管理员用户列表。支持 query: `keyword`, `role`, `status`。需要管理员权限。

### GET /api/admin/users/:id

管理员查看单个用户详情。需要管理员权限。
