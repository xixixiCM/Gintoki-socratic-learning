import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextbookShelf } from '../components/TextbookShelf';
import {
  defaultTextbook as mockDefaultTextbook,
  learningOverview as mockLearningOverview,
  prepareSteps
} from '../mock/defaultTextbook';
import { getDefaultTextbook, getLearningOverview, generateDefaultTextbookPreparation, getPreparationTask } from '../api/textbook';
import type { DefaultTextbook, LearningOverview, PreparationResult, PrepareStatus } from '../types/textbook';

export const Home = (): JSX.Element => {
  const navigate = useNavigate();

  const [textbook, setTextbook] = useState<DefaultTextbook>(mockDefaultTextbook);
  const [learningOverview, setLearningOverview] = useState<LearningOverview>(mockLearningOverview);
  const [prepareStatus, setPrepareStatus] = useState<PrepareStatus>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [prepResult, setPrepResult] = useState<PreparationResult | null>(null);

  // 轮询定时器（递归 setTimeout）
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 当前正在追踪的 taskId
  const currentTaskIdRef = useRef<number | null>(null);
  // 组件是否已挂载
  const mountedRef = useRef(true);
  // POST 返回的结果暂存（唯一数据源）
  const pendingResultRef = useRef<PreparationResult | null>(null);

  // 后端 current_step → 前端步骤索引映射
  const stepKeyToIndex: Record<string, number> = {
    'reading_textbook': 0,
    'extracting_nodes': 1,
    'extracting_relations': 2,
    'splitting_lessons': 3,
    'generating_scripts': 4,
    'writing_db': 5,
    'done': 5
  };

  // 清理定时器
  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current !== null) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearPollTimer();
    };
  }, [clearPollTimer]);

  // 初始化：从后端加载数据
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [tb, lo] = await Promise.all([
          getDefaultTextbook(),
          getLearningOverview()
        ]);
        if (!cancelled) {
          setTextbook(tb);
          setLearningOverview(lo);
        }
      } catch (err) {
        console.warn('[Home] Failed to load from backend, fallback to mock.', err);
        if (!cancelled) {
          setTextbook(mockDefaultTextbook);
          setLearningOverview(mockLearningOverview);
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  /**
   * 递归轮询任务状态（上一次请求完成后再发下一次，避免并发乱序）
   */
  const pollTask = useCallback(async (taskId: number) => {
    // 组件已卸载或 taskId 已过期，停止轮询
    if (!mountedRef.current || currentTaskIdRef.current !== taskId) return;

    try {
      const data = await getPreparationTask(taskId);

      // 请求返回时再次校验：组件可能已卸载或 taskId 已变更
      if (!mountedRef.current || currentTaskIdRef.current !== taskId) return;

      const { task } = data;
      const stepKey = task.currentStep;

      // 更新步骤进度
      if (stepKey && stepKeyToIndex[stepKey] !== undefined) {
        setCurrentStep(stepKeyToIndex[stepKey]);
      }

      // 处理 running / pending：继续轮询
      if (task.status === 'pending' || task.status === 'running') {
        setPrepareStatus('preparing');
        setTextbook((prev) => ({ ...prev, status: 'preparing' }));

        pollTimerRef.current = setTimeout(() => {
          void pollTask(taskId);
        }, 1000);
        return;
      }

      // 处理 success
      if (task.status === 'success') {
        clearPollTimer();
        currentTaskIdRef.current = null;

        setPrepareStatus('done');
        setCurrentStep(prepareSteps.length - 1);
        setTextbook((prev) => ({ ...prev, status: 'prepared' }));

        // 以 POST 返回的结果为准
        if (pendingResultRef.current !== null) {
          setPrepResult(pendingResultRef.current);
        }

        // 刷新数据
        getDefaultTextbook().then((tb) => { if (mountedRef.current) setTextbook(tb); }).catch(() => {});
        getLearningOverview().then((lo) => { if (mountedRef.current) setLearningOverview(lo); }).catch(() => {});
        return;
      }

      // 处理 failed
      if (task.status === 'failed') {
        clearPollTimer();
        currentTaskIdRef.current = null;

        setPrepareStatus('failed');
        setCurrentStep(0);
        setPrepResult(null);
        setTextbook((prev) => ({ ...prev, status: 'not_prepared' }));

        const errMsg = task.errorMessage || '未知错误';
        console.error('[Home] 备课任务失败:', errMsg);
        return;
      }

    } catch (_err) {
      // 网络错误：延迟 2 秒后重试
      if (!mountedRef.current || currentTaskIdRef.current !== taskId) return;

      pollTimerRef.current = setTimeout(() => {
        void pollTask(taskId);
      }, 2000);
    }
  }, [clearPollTimer]);

  /**
   * 点击「AI 备课」
   */
  const handlePrepare = useCallback(async () => {
    // 防止重复点击
    if (prepareStatus === 'preparing') return;

    // 清理旧轮询
    clearPollTimer();
    currentTaskIdRef.current = null;
    pendingResultRef.current = null;

    // 进入准备中状态
    setPrepareStatus('preparing');
    setCurrentStep(0);
    setPrepResult(null);
    setTextbook((prev) => ({ ...prev, status: 'preparing' }));

    try {
      const result = await generateDefaultTextbookPreparation();

      if (!mountedRef.current) return;

      if (result.status === 'success') {
        // 暂存结果（唯一数据源）
        pendingResultRef.current = {
          lessonCount: result.lessonCount,
          nodeCount: result.nodeCount,
          relationCount: result.relationCount,
          scriptCount: result.scriptCount,
          currentLessonName: result.currentLessonName
        };

        if (result.taskId > 0) {
          // 用返回的 taskId 追踪本次任务
          currentTaskIdRef.current = result.taskId;
          void pollTask(result.taskId);
        } else {
          // 兜底：没有 taskId 直接标记完成
          setPrepareStatus('done');
          setCurrentStep(prepareSteps.length - 1);
          setPrepResult(pendingResultRef.current);
          setTextbook((prev) => ({ ...prev, status: 'prepared' }));

          getDefaultTextbook().then((tb) => { if (mountedRef.current) setTextbook(tb); }).catch(() => {});
          getLearningOverview().then((lo) => { if (mountedRef.current) setLearningOverview(lo); }).catch(() => {});
        }
      } else {
        // POST 返回失败
        setPrepareStatus('failed');
        setCurrentStep(0);
        setTextbook((prev) => ({ ...prev, status: 'not_prepared' }));
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('[Home] 备课请求失败:', err);
      setPrepareStatus('failed');
      setCurrentStep(0);
      setTextbook((prev) => ({ ...prev, status: 'not_prepared' }));
    }
  }, [clearPollTimer, pollTask, prepareStatus]);

  const handleEnterClassroom = useCallback(() => {
    navigate('/course/classroom');
  }, [navigate]);

  return (
    <TextbookShelf
      textbook={textbook}
      prepareStatus={prepareStatus}
      currentStep={currentStep}
      preparationResult={prepResult}
      learningOverview={learningOverview}
      onPrepare={handlePrepare}
      onEnterClassroom={handleEnterClassroom}
    />
  );
};
