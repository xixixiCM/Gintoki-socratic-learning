import type { LessonRecord, LessonDetail, LessonMessage, LessonStartResult, LessonCompleteResult } from '../types/lesson.types';
import type { LessonGraphData, LessonGraphNode, LessonGraphLink } from '../types/graph';
import { pool } from '../db/pool';

// repositories
import { findDefaultTextbook } from '../repositories/textbook.repository';
import {
  findVisibleLessons,
  findLessonById,
  findCurrentLesson,
  findNextLesson,
  updateLessonStatus
} from '../repositories/lesson.repository';
import { findScriptsByLessonId } from '../repositories/lessonScript.repository';
import {
  findMappingsByLessonId,
  findMainNodeIdsByLessonId,
  findNodeIdsByLessonId
} from '../repositories/lessonNodeMapping.repository';
import { findProgressByNodeIds, markNodesCompleted } from '../repositories/graphProgress.repository';
import {
  createLessonSession,
  findLatestSessionByLessonId,
  findSessionById,
  completeLessonSession,
  findCompletedSessionByLessonId
} from '../repositories/lessonSession.repository';
import { findAllKgRelations } from '../repositories/relation.repository';
import { findAllKgNodes } from '../repositories/node.repository';

// ========== mock fallback (保留 V0.3 原样) ==========

const mockLessonRecords: LessonRecord[] = [
  { id: 1, lessonOrder: 1, title: '什么是机器学习', status: 'completed', usedTime: '31 分钟', textbookPages: 'P1-P2', summary: '从人工规则转向数据驱动，让学生建立机器学习的整体直觉。' },
  { id: 2, lessonOrder: 2, title: '训练集与测试集', status: 'completed', usedTime: '28 分钟', textbookPages: 'P3-P4', summary: '通过考试类比说明训练和评估的分离，理解泛化能力。' },
  { id: 3, lessonOrder: 3, title: '线性回归', status: 'completed', usedTime: '35 分钟', textbookPages: 'P5-P7', summary: '通过房价预测例子说明输入特征、参数和预测值之间的关系。' },
  { id: 4, lessonOrder: 4, title: '损失函数', status: 'current', usedTime: '12:30', textbookPages: 'P8-P10', summary: '围绕预测值与真实值的差距，建立损失函数的必要性。' }
];

const mockLessonDetailsMap: Record<number, LessonDetail> = {
  1: { id: 1, courseName: '机器学习入门', title: '第 1 课：什么是机器学习', objective: '理解机器学习的基本思想，区分人工规则和数据驱动方法。', usedTime: '31 分钟', maxTime: '40:00', textbookPages: 'P1-P2', messages: [
    { id: 1, role: 'teacher', speaker: '银发导师', content: '你觉得让计算机识别垃圾邮件，是靠我们把所有规则都写死，还是让它从很多邮件样本里自己总结规律？' },
    { id: 2, role: 'student', speaker: '学生', content: '应该是从很多样本里总结规律。' },
    { id: 3, role: 'teacher', speaker: '银发导师', content: '不错。机器学习的核心就是让模型从数据中学习规律，而不是靠人类把所有情况都写进 if-else。' },
    { id: 4, role: 'teacher', speaker: '银发导师', content: '那你说说看，人类写规则的方式有什么缺点？' },
    { id: 5, role: 'student', speaker: '学生', content: '规则太多了，写不完。而且新情况一出现规则就失效了。' },
    { id: 6, role: 'teacher', speaker: '银发导师', content: '总结得不错。机器学习就是从"人来定义规则"转变为"让模型从数据中学会规则"。这就是这一课的核心。' }
  ]},
  2: { id: 2, courseName: '机器学习入门', title: '第 2 课：训练集与测试集', objective: '理解训练和评估分离的必要性，建立泛化能力的概念。', usedTime: '28 分钟', maxTime: '40:00', textbookPages: 'P3-P4', messages: [
    { id: 1, role: 'teacher', speaker: '银发导师', content: '假设你有一个学生，你给他一份题库让他背答案，然后拿同一份题库来考试——这次考试的成绩能说明他真正学会了吗？' },
    { id: 2, role: 'student', speaker: '学生', content: '不能，他只是把答案背下来了。' },
    { id: 3, role: 'teacher', speaker: '银发导师', content: '对。模型也一样。如果拿训练数据来评估自己，就像学生背答案考试。所以我们把数据分成训练集和测试集。' },
    { id: 4, role: 'teacher', speaker: '银发导师', content: '训练集用来学习，测试集用来检验真正的能力——这就是泛化能力的含义。' },
    { id: 5, role: 'student', speaker: '学生', content: '那如果模型在训练集上特别准，但在测试集上很差呢？' },
    { id: 6, role: 'teacher', speaker: '银发导师', content: '好问题！这就是过拟合——模型把训练数据里的噪声和特例也记住了，反而失去了对新数据的判断力。我们后面会详细说怎么解决。' }
  ]},
  3: { id: 3, courseName: '机器学习入门', title: '第 3 课：线性回归', objective: '通过房价预测理解输入特征、参数和预测值之间的关系。', usedTime: '35 分钟', maxTime: '40:00', textbookPages: 'P5-P7', messages: [
    { id: 1, role: 'teacher', speaker: '银发导师', content: '如果有人让你根据房子的面积估算价格，你会怎么做？' },
    { id: 2, role: 'student', speaker: '学生', content: '可以看附近类似面积的房子卖多少钱。' },
    { id: 3, role: 'teacher', speaker: '银发导师', content: '对，这就是一个"用已知推未知"的过程。如果我们画一个坐标系，横轴是面积，纵轴是价格，你期望看到什么样的关系？' },
    { id: 4, role: 'student', speaker: '学生', content: '面积越大，价格越高——大概是一条斜向上的直线。' },
    { id: 5, role: 'teacher', speaker: '银发导师', content: '这就是线性回归的直觉。我们用一条直线来近似面积和价格的关系。面积是"特征"，价格是"预测目标"，直线的斜率和截距就是"参数"。' },
    { id: 6, role: 'student', speaker: '学生', content: '但实际数据不会完美地落在一条直线上吧？' },
    { id: 7, role: 'teacher', speaker: '银发导师', content: '没错。所以我们不追求完美拟合，而是找一条"整体误差最小"的直线。下一课我们就来聊这个误差怎么衡量。' }
  ]},
  4: { id: 4, courseName: '机器学习入门', title: '第 4 课：损失函数', objective: '理解模型如何衡量预测错误，并为后续梯度下降做准备。', usedTime: '12:30', maxTime: '40:00', textbookPages: 'P8-P10', messages: [
    { id: 1, role: 'teacher', speaker: '银发导师', content: '如果模型预测错了，它怎么知道自己错在哪里？' },
    { id: 2, role: 'student', speaker: '学生', content: '看预测值和真实值差多少。' },
    { id: 3, role: 'teacher', speaker: '银发导师', content: '对，差距是关键。那如果一次预测高了 5，一次预测低了 5，直接把误差相加，会不会出问题？' },
    { id: 4, role: 'student', speaker: '学生', content: '会抵消，看起来好像没有错误。' },
    { id: 5, role: 'teacher', speaker: '银发导师', content: '这就引出了损失函数。模型不能靠正负误差互相抵消来糊弄过去，所以我们需要一个能稳定衡量整体错误的指标。' },
    { id: 6, role: 'teacher', speaker: '银发导师', content: '最常见的做法是把每个误差平方后再求平均——这样不管误差是正还是负，平方后都变成正的，而且大误差会被放大。这叫什么？' },
    { id: 7, role: 'student', speaker: '学生', content: '均方误差……MSE？' },
    { id: 8, role: 'teacher', speaker: '银发导师', content: '答对了。MSE 就是最经典的损失函数之一。损失函数的值越小，说明模型预测得越好。所以训练的目标就是——最小化损失函数。' }
  ]}
};

const mockLessonGraphsMap: Record<number, LessonGraphData> = {
  1: { nodes: [{ id: 1, name: '机器学习', status: 'completed' }, { id: 2, name: '数据', status: 'completed' }, { id: 3, name: '模型', status: 'completed' }, { id: 4, name: '规律学习', status: 'completed' }], links: [{ source: 2, target: 1, relationType: '前置知识' }, { source: 1, target: 3, relationType: '包含' }, { source: 3, target: 4, relationType: '应用于' }] },
  2: { nodes: [{ id: 5, name: '训练集', status: 'completed' }, { id: 6, name: '测试集', status: 'completed' }, { id: 7, name: '泛化能力', status: 'completed' }, { id: 8, name: '过拟合', status: 'completed' }], links: [{ source: 5, target: 7, relationType: '用于学习' }, { source: 6, target: 7, relationType: '用于评价' }, { source: 8, target: 7, relationType: '影响' }] },
  3: { nodes: [{ id: 9, name: '线性回归', status: 'completed' }, { id: 10, name: '特征', status: 'completed' }, { id: 11, name: '参数', status: 'completed' }, { id: 12, name: '预测值', status: 'completed' }], links: [{ source: 10, target: 9, relationType: '输入' }, { source: 11, target: 9, relationType: '构成' }, { source: 9, target: 12, relationType: '产生' }] },
  4: { nodes: [{ id: 9, name: '线性回归', status: 'review' }, { id: 12, name: '预测值', status: 'review' }, { id: 13, name: '真实值', status: 'support' }, { id: 14, name: '预测误差', status: 'current' }, { id: 15, name: '损失函数', status: 'current' }, { id: 16, name: '均方误差', status: 'current' }], links: [{ source: 9, target: 12, relationType: '产生' }, { source: 12, target: 14, relationType: '比较' }, { source: 13, target: 14, relationType: '比较' }, { source: 14, target: 15, relationType: '引出' }, { source: 15, target: 16, relationType: '包含' }] }
};

// ========== helper ==========

function secondsToTimeStr(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} 分钟`;
}

// ========== V0.4: getLessonRecords (MySQL + fallback) ==========

export async function getLessonRecords(): Promise<LessonRecord[]> {
  try {
    const lessons = await findVisibleLessons();
    if (!lessons.length) {
      console.warn('[lesson.service] No visible lessons in DB, fallback to mock.');
      return mockLessonRecords;
    }

    const records: LessonRecord[] = [];
    for (const l of lessons) {
      let usedTime = '00:00';
      if (l.status === 'completed') {
        const session = await findCompletedSessionByLessonId(l.id);
        usedTime = session ? secondsToTimeStr(session.duration_seconds) : (l.estimated_duration_minutes ? `${l.estimated_duration_minutes} 分钟` : '00:00');
      } else {
        const latestSession = await findLatestSessionByLessonId(l.id);
        if (latestSession && latestSession.status === 'in_progress') {
          usedTime = `${Math.floor((Date.now() - new Date(latestSession.started_at!).getTime()) / 60000)} 分钟`;
        } else {
          usedTime = '00:00';
        }
      }

      records.push({
        id: l.id,
        lessonOrder: l.lesson_order,
        title: l.title,
        status: l.status === 'completed' ? 'completed' : 'current',
        usedTime,
        textbookPages: l.textbook_pages ?? '',
        summary: l.summary ?? ''
      });
    }
    return records;
  } catch (error) {
    console.warn('[lesson.service] getLessonRecords failed, fallback to mock.', error);
    return mockLessonRecords;
  }
}

// ========== V0.4: getLessonDetail (MySQL + fallback) ==========

export async function getLessonDetail(lessonId: number): Promise<LessonDetail | null> {
  try {
    const lesson = await findLessonById(lessonId);
    if (!lesson) {
      console.warn('[lesson.service] Lesson not found in DB, fallback to mock.');
      return mockLessonDetailsMap[lessonId] ?? null;
    }

    const textbook = await findDefaultTextbook();
    const scripts = await findScriptsByLessonId(lessonId);

    let usedTime = '00:00';
    if (lesson.status === 'completed') {
      const session = await findCompletedSessionByLessonId(lessonId);
      usedTime = session ? secondsToTimeStr(session.duration_seconds) : (lesson.estimated_duration_minutes ? `${lesson.estimated_duration_minutes} 分钟` : '00:00');
    } else {
      const session = await findLatestSessionByLessonId(lessonId);
      if (session && session.started_at) {
        const elapsed = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);
        usedTime = secondsToTimeStr(elapsed);
      }
    }

    const messages: LessonMessage[] = scripts.map(s => ({
      id: s.id,
      role: s.role as 'teacher' | 'student',
      speaker: s.speaker,
      content: s.content
    }));

    return {
      id: lesson.id,
      courseName: textbook?.course_name ?? '机器学习入门',
      title: `第 ${lesson.lesson_order} 课：${lesson.title}`,
      objective: lesson.objective ?? '',
      usedTime,
      maxTime: `${lesson.max_duration_minutes}:00`,
      textbookPages: lesson.textbook_pages ?? '',
      messages: messages.length > 0 ? messages : (mockLessonDetailsMap[lessonId]?.messages ?? [])
    };
  } catch (error) {
    console.warn('[lesson.service] getLessonDetail failed, fallback to mock.', error);
    return mockLessonDetailsMap[lessonId] ?? null;
  }
}

// ========== V0.4: getLessonGraph (MySQL + fallback) ==========

export async function getLessonGraph(lessonId: number): Promise<LessonGraphData | null> {
  try {
    const mappings = await findMappingsByLessonId(lessonId);
    if (!mappings.length) {
      console.warn('[lesson.service] No mappings for lesson, fallback to mock.');
      return mockLessonGraphsMap[lessonId] ?? null;
    }

    const nodeIds = mappings.map(m => m.node_id);
    const [allNodes, allRelations, progressRows] = await Promise.all([
      findAllKgNodes(),
      findAllKgRelations(),
      findProgressByNodeIds(nodeIds)
    ]);

    const progressMap = new Map(progressRows.map(p => [p.node_id, p]));

    // build nodes
    const nodes: LessonGraphNode[] = mappings.map(m => {
      const kgNode = allNodes.find(n => n.id === m.node_id);
      const progress = progressMap.get(m.node_id);

      let status: LessonGraphNode['status'];
      if (m.role === 'review') {
        status = 'review';
      } else if (m.role === 'support') {
        status = 'support';
      } else if (progress?.status === 'completed') {
        status = 'completed';
      } else if (m.role === 'main') {
        status = 'current';
      } else {
        status = 'support';
      }

      return {
        id: m.node_id,
        name: kgNode?.name ?? `节点${m.node_id}`,
        status
      };
    });

    // build links: only edges where both source and target are in nodeIds
    const nodeIdSet = new Set(nodeIds);
    const links: LessonGraphLink[] = allRelations
      .filter(r => nodeIdSet.has(r.source_id) && nodeIdSet.has(r.target_id))
      .map(r => ({
        source: r.source_id,
        target: r.target_id,
        relationType: r.relation_type
      }));

    return { nodes, links };
  } catch (error) {
    console.warn('[lesson.service] getLessonGraph failed, fallback to mock.', error);
    return mockLessonGraphsMap[lessonId] ?? null;
  }
}

// ========== V0.4 新增: startLesson ==========

export async function startLesson(lessonId: number): Promise<LessonStartResult | null> {
  const lesson = await findLessonById(lessonId);
  if (!lesson) return null;

  if (lesson.status === 'locked') {
    return null; // controller returns 403
  }

  const session = await createLessonSession(lessonId);

  return {
    sessionId: session.id,
    lessonId: lesson.id,
    startedAt: session.started_at ?? new Date().toISOString(),
    maxDurationMinutes: lesson.max_duration_minutes
  };
}

// ========== V0.4 新增: completeLesson (transaction) ==========

export async function completeLesson(
  lessonId: number,
  sessionId: number,
  endType: string
): Promise<LessonCompleteResult | null> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. 查询 lesson & session
    const [lessonRows] = await connection.query<any[]>('SELECT * FROM lesson WHERE id = ? FOR UPDATE', [lessonId]);
    if (!lessonRows.length) { await connection.rollback(); return null; }
    const lesson = lessonRows[0];

    const [sessionRows] = await connection.query<any[]>('SELECT * FROM lesson_session WHERE id = ? AND lesson_id = ? FOR UPDATE', [sessionId, lessonId]);
    if (!sessionRows.length) { await connection.rollback(); return null; }
    const session = sessionRows[0];

    // 2. 计算 duration_seconds
    const startedAt = session.started_at ? new Date(session.started_at).getTime() : Date.now();
    const durationSeconds = Math.floor((Date.now() - startedAt) / 1000);

    // 3. 更新 lesson_session
    await connection.query(
      'UPDATE lesson_session SET status = ?, end_type = ?, ended_at = NOW(), duration_seconds = ? WHERE id = ?',
      ['completed', endType, durationSeconds, sessionId]
    );

    // 4. 更新 lesson
    await connection.query('UPDATE lesson SET status = ? WHERE id = ?', ['completed', lessonId]);

    // 5. 查询 main 节点
    const [mappingRows] = await connection.query<any[]>('SELECT node_id FROM lesson_node_mapping WHERE lesson_id = ? AND role = ?', [lessonId, 'main']);
    const mainNodeIds = mappingRows.map((r: any) => r.node_id);

    // 6. 更新 graph_progress (main 节点点亮)
    if (mainNodeIds.length > 0) {
      const placeholders = mainNodeIds.map(() => '?').join(', ');
      await connection.query(
        `UPDATE graph_progress SET status = ?, completed_lesson_id = ?, completed_at = NOW() WHERE node_id IN (${placeholders})`,
        ['completed', lessonId, ...mainNodeIds]
      );
    }

    // 7. 查询下一课
    const [nextRows] = await connection.query<any[]>('SELECT * FROM lesson WHERE lesson_order > ? ORDER BY lesson_order ASC LIMIT 1', [lesson.lesson_order]);

    // 8. 解锁下一课
    let nextLesson: LessonCompleteResult['nextLesson'] = null;
    if (nextRows.length > 0) {
      const next = nextRows[0];
      await connection.query('UPDATE lesson SET status = ? WHERE id = ?', ['current', next.id]);
      nextLesson = {
        id: next.id,
        lessonOrder: next.lesson_order,
        title: next.title,
        status: 'current'
      };
    }

    // 9. 查询已亮节点名
    const completedNodes: Array<{ id: number; name: string }> = [];
    if (mainNodeIds.length > 0) {
      const nodePlaceholders = mainNodeIds.map(() => '?').join(', ');
      const [nodeNameRows] = await connection.query<any[]>(`SELECT id, name FROM kg_node WHERE id IN (${nodePlaceholders})`, mainNodeIds);
      completedNodes.push(...nodeNameRows.map((r: any) => ({ id: r.id, name: r.name })));
    }

    await connection.commit();

    return {
      lessonId: lesson.id,
      title: lesson.title,
      summary: lesson.summary ?? '',
      completedNodes,
      nextLesson
    };
  } catch (error) {
    await connection.rollback();
    console.error('[lesson.service] completeLesson transaction failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}
