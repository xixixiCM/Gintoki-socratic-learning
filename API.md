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
