你是一个知识图谱构建助手。
请从下面的教材正文中抽取机器学习入门课程的核心知识点。

要求：
1. 只返回 JSON；
2. 不要返回 Markdown；
3. 不要返回解释文字；
4. 每个知识点必须有 tempId；
5. tempId 使用 N1、N2、N3 这种格式；
6. difficulty 取 1-5；
7. category 不要过细，使用以下类别之一：核心概念、模型方法、评估指标、优化方法、数据相关；
8. description 用一句话说明；
9. content 用 1-3 句话说明；
10. 知识点数量控制在 15-35 个。

返回格式：

{
  "nodes": [
    {
      "tempId": "N1",
      "name": "机器学习",
      "category": "核心概念",
      "difficulty": 2,
      "description": "机器学习是让计算机从数据中学习规律的方法。",
      "content": "机器学习通过训练数据发现输入与输出之间的关系，并用于预测或决策。"
    }
  ]
}

教材正文：
{{textbookContent}}
