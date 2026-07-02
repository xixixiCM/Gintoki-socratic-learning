import type { DefaultTextbook, LearningOverview, PreparationResult, PreparationGenerateResponse } from '../types/textbook';
import type { LessonRecord, LessonDetail } from '../types/lesson';
import type { LessonGraphData } from '../types/graph';

// ========== 默认体验教材 ==========

export const defaultTextbook: DefaultTextbook = {
  id: 1,
  title: '机器学习入门体验教材',
  courseName: '机器学习入门',
  currentLessonName: '第 4 课：损失函数',
  illuminatedCount: 8,
  totalKnowledgeCount: 32,
  totalPages: 15,
  status: 'not_prepared'
};

// ========== 学习概览 ==========

export const learningOverview: LearningOverview = {
  courseName: '机器学习入门',
  currentLessonName: '第 4 课：损失函数',
  completedLessonCount: 3,
  totalVisibleLessonCount: 4,
  illuminatedCount: 8,
  totalKnowledgeCount: 32
};

// ========== 备课结果 ==========

export const preparationResult: PreparationResult = {
  lessonCount: 4,
  nodeCount: 18,
  relationCount: 26,
  scriptCount: 4,
  currentLessonName: '第 4 课：损失函数'
};

// ========== V0.7 真实 AI 备课失败 fallback ==========

export const failedPreparationResponse: PreparationGenerateResponse = {
  taskId: 0,
  textbookId: 0,
  lessonCount: 0,
  nodeCount: 0,
  relationCount: 0,
  scriptCount: 0,
  currentLessonName: '',
  status: 'failed'
};

// ========== 备课步骤 ==========

export const prepareSteps: string[] = [
  '正在读取默认教材',
  '正在抽取核心知识点',
  '正在分析知识点关系',
  '正在拆分课时',
  '正在生成课堂脚本',
  '正在写入数据库',
  '备课完成'
];

// ========== 课时记录 ==========

export const lessonRecords: LessonRecord[] = [
  {
    id: 1,
    lessonOrder: 1,
    title: '什么是机器学习',
    status: 'completed',
    usedTime: '31 分钟',
    textbookPages: 'P1-P2',
    summary: '从人工规则转向数据驱动，让学生建立机器学习的整体直觉。'
  },
  {
    id: 2,
    lessonOrder: 2,
    title: '训练集与测试集',
    status: 'completed',
    usedTime: '28 分钟',
    textbookPages: 'P3-P4',
    summary: '通过考试类比说明训练和评估的分离，理解泛化能力。'
  },
  {
    id: 3,
    lessonOrder: 3,
    title: '线性回归',
    status: 'completed',
    usedTime: '35 分钟',
    textbookPages: 'P5-P7',
    summary: '通过房价预测例子说明输入特征、参数和预测值之间的关系。'
  },
  {
    id: 4,
    lessonOrder: 4,
    title: '损失函数',
    status: 'current',
    usedTime: '12:30',
    textbookPages: 'P8-P10',
    summary: '围绕预测值与真实值的差距，建立损失函数的必要性。'
  }
];

// ========== 课时详情 ==========

export const lessonDetails: Record<number, LessonDetail> = {
  1: {
    id: 1,
    courseName: '机器学习入门',
    title: '第 1 课：什么是机器学习',
    objective: '理解机器学习的基本思想，区分人工规则和数据驱动方法。',
    usedTime: '31 分钟',
    maxTime: '40:00',
    textbookPages: 'P1-P2',
    messages: [
      {
        id: 1,
        role: 'teacher',
        speaker: '银发导师',
        content: '你觉得让计算机识别垃圾邮件，是靠我们把所有规则都写死，还是让它从很多邮件样本里自己总结规律？'
      },
      {
        id: 2,
        role: 'student',
        speaker: '学生',
        content: '应该是从很多样本里总结规律。'
      },
      {
        id: 3,
        role: 'teacher',
        speaker: '银发导师',
        content: '不错。机器学习的核心就是让模型从数据中学习规律，而不是靠人类把所有情况都写进 if-else。'
      },
      {
        id: 4,
        role: 'teacher',
        speaker: '银发导师',
        content: '那你说说看，人类写规则的方式有什么缺点？'
      },
      {
        id: 5,
        role: 'student',
        speaker: '学生',
        content: '规则太多了，写不完。而且新情况一出现规则就失效了。'
      },
      {
        id: 6,
        role: 'teacher',
        speaker: '银发导师',
        content: '总结得不错。机器学习就是从"人来定义规则"转变为"让模型从数据中学会规则"。这就是这一课的核心。'
      }
    ]
  },
  2: {
    id: 2,
    courseName: '机器学习入门',
    title: '第 2 课：训练集与测试集',
    objective: '理解训练和评估分离的必要性，建立泛化能力的概念。',
    usedTime: '28 分钟',
    maxTime: '40:00',
    textbookPages: 'P3-P4',
    messages: [
      {
        id: 1,
        role: 'teacher',
        speaker: '银发导师',
        content: '假设你有一个学生，你给他一份题库让他背答案，然后拿同一份题库来考试——这次考试的成绩能说明他真正学会了吗？'
      },
      {
        id: 2,
        role: 'student',
        speaker: '学生',
        content: '不能，他只是把答案背下来了。'
      },
      {
        id: 3,
        role: 'teacher',
        speaker: '银发导师',
        content: '对。模型也一样。如果拿训练数据来评估自己，就像学生背答案考试。所以我们把数据分成训练集和测试集。'
      },
      {
        id: 4,
        role: 'teacher',
        speaker: '银发导师',
        content: '训练集用来学习，测试集用来检验真正的能力——这就是泛化能力的含义。'
      },
      {
        id: 5,
        role: 'student',
        speaker: '学生',
        content: '那如果模型在训练集上特别准，但在测试集上很差呢？'
      },
      {
        id: 6,
        role: 'teacher',
        speaker: '银发导师',
        content: '好问题！这就是过拟合——模型把训练数据里的噪声和特例也记住了，反而失去了对新数据的判断力。我们后面会详细说怎么解决。'
      }
    ]
  },
  3: {
    id: 3,
    courseName: '机器学习入门',
    title: '第 3 课：线性回归',
    objective: '通过房价预测理解输入特征、参数和预测值之间的关系。',
    usedTime: '35 分钟',
    maxTime: '40:00',
    textbookPages: 'P5-P7',
    messages: [
      {
        id: 1,
        role: 'teacher',
        speaker: '银发导师',
        content: '如果有人让你根据房子的面积估算价格，你会怎么做？'
      },
      {
        id: 2,
        role: 'student',
        speaker: '学生',
        content: '可以看附近类似面积的房子卖多少钱。'
      },
      {
        id: 3,
        role: 'teacher',
        speaker: '银发导师',
        content: '对，这就是一个"用已知推未知"的过程。如果我们画一个坐标系，横轴是面积，纵轴是价格，你期望看到什么样的关系？'
      },
      {
        id: 4,
        role: 'student',
        speaker: '学生',
        content: '面积越大，价格越高——大概是一条斜向上的直线。'
      },
      {
        id: 5,
        role: 'teacher',
        speaker: '银发导师',
        content: '这就是线性回归的直觉。我们用一条直线来近似面积和价格的关系。面积是"特征"，价格是"预测目标"，直线的斜率和截距就是"参数"。'
      },
      {
        id: 6,
        role: 'student',
        speaker: '学生',
        content: '但实际数据不会完美地落在一条直线上吧？'
      },
      {
        id: 7,
        role: 'teacher',
        speaker: '银发导师',
        content: '没错。所以我们不追求完美拟合，而是找一条"整体误差最小"的直线。下一课我们就来聊这个误差怎么衡量。'
      }
    ]
  },
  4: {
    id: 4,
    courseName: '机器学习入门',
    title: '第 4 课：损失函数',
    objective: '理解模型如何衡量预测错误，并为后续梯度下降做准备。',
    usedTime: '12:30',
    maxTime: '40:00',
    textbookPages: 'P8-P10',
    messages: [
      {
        id: 1,
        role: 'teacher',
        speaker: '银发导师',
        content: '如果模型预测错了，它怎么知道自己错在哪里？'
      },
      {
        id: 2,
        role: 'student',
        speaker: '学生',
        content: '看预测值和真实值差多少。'
      },
      {
        id: 3,
        role: 'teacher',
        speaker: '银发导师',
        content: '对，差距是关键。那如果一次预测高了 5，一次预测低了 5，直接把误差相加，会不会出问题？'
      },
      {
        id: 4,
        role: 'student',
        speaker: '学生',
        content: '会抵消，看起来好像没有错误。'
      },
      {
        id: 5,
        role: 'teacher',
        speaker: '银发导师',
        content: '这就引出了损失函数。模型不能靠正负误差互相抵消来糊弄过去，所以我们需要一个能稳定衡量整体错误的指标。'
      },
      {
        id: 6,
        role: 'teacher',
        speaker: '银发导师',
        content: '最常见的做法是把每个误差平方后再求平均——这样不管误差是正还是负，平方后都变成正的，而且大误差会被放大。这叫什么？'
      },
      {
        id: 7,
        role: 'student',
        speaker: '学生',
        content: '均方误差……MSE？'
      },
      {
        id: 8,
        role: 'teacher',
        speaker: '银发导师',
        content: '答对了。MSE 就是最经典的损失函数之一。损失函数的值越小，说明模型预测得越好。所以训练的目标就是——最小化损失函数。'
      }
    ]
  }
};

// ========== 课时局部知识图谱 ==========

export const lessonGraphs: Record<number, LessonGraphData> = {
  1: {
    nodes: [
      { id: 1, name: '机器学习', status: 'completed' },
      { id: 2, name: '数据', status: 'completed' },
      { id: 3, name: '模型', status: 'completed' },
      { id: 4, name: '规律学习', status: 'completed' }
    ],
    links: [
      { source: 2, target: 1, relationType: '前置知识' },
      { source: 1, target: 3, relationType: '包含' },
      { source: 3, target: 4, relationType: '应用于' }
    ]
  },
  2: {
    nodes: [
      { id: 5, name: '训练集', status: 'completed' },
      { id: 6, name: '测试集', status: 'completed' },
      { id: 7, name: '泛化能力', status: 'completed' },
      { id: 8, name: '过拟合', status: 'completed' }
    ],
    links: [
      { source: 5, target: 7, relationType: '用于学习' },
      { source: 6, target: 7, relationType: '用于评价' },
      { source: 8, target: 7, relationType: '影响' }
    ]
  },
  3: {
    nodes: [
      { id: 9, name: '线性回归', status: 'completed' },
      { id: 10, name: '特征', status: 'completed' },
      { id: 11, name: '参数', status: 'completed' },
      { id: 12, name: '预测值', status: 'completed' }
    ],
    links: [
      { source: 10, target: 9, relationType: '输入' },
      { source: 11, target: 9, relationType: '构成' },
      { source: 9, target: 12, relationType: '产生' }
    ]
  },
  4: {
    nodes: [
      { id: 9, name: '线性回归', status: 'review' },
      { id: 12, name: '预测值', status: 'review' },
      { id: 13, name: '真实值', status: 'support' },
      { id: 14, name: '预测误差', status: 'current' },
      { id: 15, name: '损失函数', status: 'current' },
      { id: 16, name: '均方误差', status: 'current' }
    ],
    links: [
      { source: 9, target: 12, relationType: '产生' },
      { source: 12, target: 14, relationType: '比较' },
      { source: 13, target: 14, relationType: '比较' },
      { source: 14, target: 15, relationType: '引出' },
      { source: 15, target: 16, relationType: '包含' }
    ]
  }
};
