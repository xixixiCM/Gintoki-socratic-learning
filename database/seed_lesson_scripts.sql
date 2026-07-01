-- 第 1 课：什么是机器学习
INSERT INTO lesson_script (lesson_id, script_order, role, speaker, content, message_type)
VALUES
  (1, 1, 'teacher', '银发导师', '你觉得让计算机识别垃圾邮件，是靠我们把所有规则都写死，还是让它从很多邮件样本里自己总结规律？', 'opening'),
  (1, 2, 'student', '学生', '应该是从很多样本里总结规律。', 'answer'),
  (1, 3, 'teacher', '银发导师', '不错。机器学习的核心就是让模型从数据中学习规律，而不是靠人类把所有情况都写进 if-else。', 'explanation'),
  (1, 4, 'teacher', '银发导师', '那你说说看，人类写规则的方式有什么缺点？', 'question'),
  (1, 5, 'student', '学生', '规则太多了，写不完。而且新情况一出现规则就失效了。', 'answer'),
  (1, 6, 'teacher', '银发导师', '总结得不错。机器学习就是从"人来定义规则"转变为"让模型从数据中学会规则"。这就是这一课的核心。', 'summary');

-- 第 2 课：训练集与测试集
INSERT INTO lesson_script (lesson_id, script_order, role, speaker, content, message_type)
VALUES
  (2, 1, 'teacher', '银发导师', '假设你有一个学生，你给他一份题库让他背答案，然后拿同一份题库来考试——这次考试的成绩能说明他真正学会了吗？', 'opening'),
  (2, 2, 'student', '学生', '不能，他只是把答案背下来了。', 'answer'),
  (2, 3, 'teacher', '银发导师', '对。模型也一样。如果拿训练数据来评估自己，就像学生背答案考试。所以我们把数据分成训练集和测试集。', 'explanation'),
  (2, 4, 'teacher', '银发导师', '训练集用来学习，测试集用来检验真正的能力——这就是泛化能力的含义。', 'explanation'),
  (2, 5, 'student', '学生', '那如果模型在训练集上特别准，但在测试集上很差呢？', 'question'),
  (2, 6, 'teacher', '银发导师', '好问题！这就是过拟合——模型把训练数据里的噪声和特例也记住了，反而失去了对新数据的判断力。我们后面会详细说怎么解决。', 'summary');

-- 第 3 课：线性回归
INSERT INTO lesson_script (lesson_id, script_order, role, speaker, content, message_type)
VALUES
  (3, 1, 'teacher', '银发导师', '如果有人让你根据房子的面积估算价格，你会怎么做？', 'opening'),
  (3, 2, 'student', '学生', '可以看附近类似面积的房子卖多少钱。', 'answer'),
  (3, 3, 'teacher', '银发导师', '对，这就是一个"用已知推未知"的过程。如果我们画一个坐标系，横轴是面积，纵轴是价格，你期望看到什么样的关系？', 'question'),
  (3, 4, 'student', '学生', '面积越大，价格越高——大概是一条斜向上的直线。', 'answer'),
  (3, 5, 'teacher', '银发导师', '这就是线性回归的直觉。我们用一条直线来近似面积和价格的关系。面积是"特征"，价格是"预测目标"，直线的斜率和截距就是"参数"。', 'explanation'),
  (3, 6, 'student', '学生', '但实际数据不会完美地落在一条直线上吧？', 'question'),
  (3, 7, 'teacher', '银发导师', '没错。所以我们不追求完美拟合，而是找一条"整体误差最小"的直线。下一课我们就来聊这个误差怎么衡量。', 'summary');

-- 第 4 课：损失函数
INSERT INTO lesson_script (lesson_id, script_order, role, speaker, content, message_type)
VALUES
  (4, 1, 'teacher', '银发导师', '如果模型预测错了，它怎么知道自己错在哪里？', 'opening'),
  (4, 2, 'student', '学生', '看预测值和真实值差多少。', 'answer'),
  (4, 3, 'teacher', '银发导师', '对，差距是关键。那如果一次预测高了 5，一次预测低了 5，直接把误差相加，会不会出问题？', 'question'),
  (4, 4, 'student', '学生', '会抵消，看起来好像没有错误。', 'answer'),
  (4, 5, 'teacher', '银发导师', '这就引出了损失函数。模型不能靠正负误差互相抵消来糊弄过去，所以我们需要一个能稳定衡量整体错误的指标。', 'explanation'),
  (4, 6, 'teacher', '银发导师', '最常见的做法是把每个误差平方后再求平均——这样不管误差是正还是负，平方后都变成正的，而且大误差会被放大。这叫什么？', 'question'),
  (4, 7, 'student', '学生', '均方误差……MSE？', 'answer'),
  (4, 8, 'teacher', '银发导师', '答对了。MSE 就是最经典的损失函数之一。损失函数的值越小，说明模型预测得越好。所以训练的目标就是——最小化损失函数。', 'summary');
