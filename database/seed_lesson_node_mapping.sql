-- ========== 第 1 课：什么是机器学习 ==========
INSERT INTO lesson_node_mapping (lesson_id, node_id, role, display_order)
VALUES
  (1, 5, 'main', 1),    -- 机器学习
  (1, 1, 'review', 2),  -- Python基础
  (1, 6, 'support', 3); -- 监督学习

-- ========== 第 2 课：训练集与测试集 ==========
INSERT INTO lesson_node_mapping (lesson_id, node_id, role, display_order)
VALUES
  (2, 6, 'main', 1),    -- 监督学习
  (2, 5, 'review', 2),  -- 机器学习
  (2, 7, 'support', 3); -- 线性回归

-- ========== 第 3 课：线性回归 ==========
INSERT INTO lesson_node_mapping (lesson_id, node_id, role, display_order)
VALUES
  (3, 7, 'main', 1),    -- 线性回归
  (3, 5, 'review', 2),  -- 机器学习
  (3, 6, 'review', 3),  -- 监督学习
  (3, 8, 'preview', 4); -- 损失函数

-- ========== 第 4 课：损失函数 ==========
INSERT INTO lesson_node_mapping (lesson_id, node_id, role, display_order)
VALUES
  (4, 8, 'main', 1),    -- 损失函数
  (4, 7, 'review', 2),  -- 线性回归
  (4, 9, 'preview', 3), -- 梯度下降
  (4, 2, 'support', 4); -- NumPy

-- ========== 第 5 课：梯度下降 (locked, 仅做映射) ==========
INSERT INTO lesson_node_mapping (lesson_id, node_id, role, display_order)
VALUES
  (5, 9, 'main', 1),    -- 梯度下降
  (5, 8, 'review', 2),  -- 损失函数
  (5, 10, 'support', 3); -- 神经网络
