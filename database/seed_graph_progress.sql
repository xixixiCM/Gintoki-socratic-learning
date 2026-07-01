-- 初始化知识点点亮状态
-- 第 1-3 课 main 节点：completed
-- 第 4 课 main 节点：current
-- 第 5 课 main 节点：locked

-- ========== 已点亮节点 (前 3 课 main 节点) ==========
INSERT INTO graph_progress (node_id, status, completed_lesson_id, completed_at)
VALUES
  (5, 'completed', 1, '2026-06-15 10:31:00'),   -- 机器学习 (第1课 main)
  (1, 'completed', 1, '2026-06-15 10:31:00'),   -- Python基础 (第1课 review)
  (6, 'completed', 2, '2026-06-18 14:28:00'),   -- 监督学习 (第2课 main)
  (7, 'completed', 3, '2026-06-22 09:35:00');   -- 线性回归 (第3课 main)

-- ========== 当前节点 (第 4 课 main) ==========
INSERT INTO graph_progress (node_id, status)
VALUES
  (8, 'current');   -- 损失函数 (第4课 main)

-- ========== 锁定节点 ==========
INSERT INTO graph_progress (node_id, status)
VALUES
  (9, 'locked'),    -- 梯度下降 (第5课 main)
  (10, 'locked'),   -- 神经网络
  (2, 'locked'),    -- NumPy
  (3, 'locked'),    -- 线性代数
  (4, 'locked');    -- 概率论
