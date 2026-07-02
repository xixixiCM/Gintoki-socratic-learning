import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextbookShelf } from '../components/TextbookShelf';
import {
  defaultTextbook as mockDefaultTextbook,
  learningOverview as mockLearningOverview,
  prepareSteps
} from '../mock/defaultTextbook';
import { getDefaultTextbook, getLearningOverview, generateDefaultTextbookPreparation, getLatestPreparationTask } from '../api/textbook';
import type { DefaultTextbook, LearningOverview, PreparationResult, PrepareStatus } from '../types/textbook';

export const Home = (): JSX.Element => {
  const navigate = useNavigate();

  const [textbook, setTextbook] = useState<DefaultTextbook>(mockDefaultTextbook);
  const [learningOverview, setLearningOverview] = useState<LearningOverview>(mockLearningOverview);
  const [prepareStatus, setPrepareStatus] = useState<PrepareStatus>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [prepResult, setPrepResult] = useState<PreparationResult | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const taskSeenRef = useRef(false);
  const taskFinishedRef = useRef(false);
  const startupFailureRef = useRef(false);
  const missingTaskCountRef = useRef(0);
  const pendingResultRef = useRef<PreparationResult | null>(null);

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current !== null) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

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

  useEffect(() => {
    return () => {
      clearPollTimer();
    };
  }, [clearPollTimer]);

  // 后端 current_step → 前端步骤索引映射
  const stepKeyToIndex: Record<string, number> = {
    'reading_textbook': 0,
    'extracting_nodes': 1,
    'extracting_relations': 2,
    'splitting_lessons': 3,
    'generating_scripts': 4,
    'writing_db': 5,
    'done': prepareSteps.length - 1
  };

  const syncPreparationTask = useCallback(async () => {
    try {
      const task = await getLatestPreparationTask();

      if (!task) {
        if (startupFailureRef.current && !taskSeenRef.current) {
          missingTaskCountRef.current += 1;

          if (missingTaskCountRef.current >= 5) {
            clearPollTimer();
            startupFailureRef.current = false;
            missingTaskCountRef.current = 0;
            setPrepareStatus('idle');
            setCurrentStep(0);
            setPrepResult(null);
            setTextbook((prev) => ({ ...prev, status: 'not_prepared' }));
            alert('AI 备课启动失败，请稍后重试。');
          }
        }

        return;
      }

      taskSeenRef.current = true;
      missingTaskCountRef.current = 0;

      const stepKey = task.currentStep;
      if (stepKey && stepKeyToIndex[stepKey] !== undefined) {
        setCurrentStep(stepKeyToIndex[stepKey]);
      }

      if (task.status === 'pending' || task.status === 'running') {
        setPrepareStatus('preparing');
        setTextbook((prev) => ({ ...prev, status: 'preparing' }));
        return;
      }

      if (task.status === 'success') {
        taskFinishedRef.current = true;
        clearPollTimer();
        setPrepareStatus('done');
        setCurrentStep(prepareSteps.length - 1);
        setTextbook((prev) => ({ ...prev, status: 'prepared' }));

        if (pendingResultRef.current !== null) {
          setPrepResult(pendingResultRef.current);
        }

        getDefaultTextbook().then((tb) => setTextbook(tb)).catch(() => {});
        getLearningOverview().then((lo) => setLearningOverview(lo)).catch(() => {});
        return;
      }

      if (task.status === 'failed') {
        clearPollTimer();
        setPrepareStatus('idle');
        setCurrentStep(0);
        setPrepResult(null);
        setTextbook((prev) => ({ ...prev, status: 'not_prepared' }));
        alert('AI 备课失败，请稍后重试。');
      }
    } catch {
      // 轮询失败静默忽略，等待下一次轮询
    }
  }, [clearPollTimer]);

  const handlePrepare = useCallback(async () => {
    if (pollTimerRef.current !== null || prepareStatus === 'preparing') return;

    clearPollTimer();
    setPrepareStatus('preparing');
    setCurrentStep(0);
    setPrepResult(null);
    setTextbook((prev) => ({ ...prev, status: 'preparing' }));
    taskSeenRef.current = false;
    taskFinishedRef.current = false;
    startupFailureRef.current = false;
    missingTaskCountRef.current = 0;
    pendingResultRef.current = null;

    pollTimerRef.current = setInterval(() => {
      void syncPreparationTask();
    }, 1000);

    void syncPreparationTask();

    try {
      const result = await generateDefaultTextbookPreparation();

      if (result.status === 'success') {
        pendingResultRef.current = {
          lessonCount: result.lessonCount,
          nodeCount: result.nodeCount,
          relationCount: result.relationCount,
          scriptCount: result.scriptCount,
          currentLessonName: result.currentLessonName
        };

        if (taskFinishedRef.current) {
          setPrepResult(pendingResultRef.current);
        }
      }
    } catch (err) {
      console.warn('[Home] Backend prepare failed, waiting for task polling.', err);
      startupFailureRef.current = true;
      void syncPreparationTask();
    }
  }, [clearPollTimer, prepareStatus, syncPreparationTask]);

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
