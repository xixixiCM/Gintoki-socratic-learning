import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextbookShelf } from '../components/TextbookShelf';
import {
  defaultTextbook as mockDefaultTextbook,
  learningOverview as mockLearningOverview,
  preparationResult as mockPreparationResult,
  prepareSteps
} from '../mock/defaultTextbook';
import { getDefaultTextbook, getLearningOverview, prepareDefaultTextbook } from '../api/textbook';
import type { DefaultTextbook, LearningOverview, PreparationResult, PrepareStatus } from '../types/textbook';

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [textbook, setTextbook] = useState<DefaultTextbook>(mockDefaultTextbook);
  const [learningOverview, setLearningOverview] = useState<LearningOverview>(mockLearningOverview);
  const [prepareStatus, setPrepareStatus] = useState<PrepareStatus>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [prepResult, setPrepResult] = useState<PreparationResult | null>(null);
  const [loaded, setLoaded] = useState(false);

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
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const runPrepareStep = useCallback((stepIndex: number) => {
    if (stepIndex >= prepareSteps.length) {
      setPrepareStatus('done');
      setCurrentStep(prepareSteps.length - 1);
      setPrepResult(mockPreparationResult);
      setTextbook((prev) => ({ ...prev, status: 'prepared' }));
      return;
    }

    setCurrentStep(stepIndex);

    const delay = 600 + Math.random() * 300;
    timerRef.current = setTimeout(() => {
      runPrepareStep(stepIndex + 1);
    }, delay);
  }, []);

  const handlePrepare = useCallback(async () => {
    if (prepareStatus === 'preparing') return;

    setPrepareStatus('preparing');
    setCurrentStep(0);
    setPrepResult(null);
    setTextbook((prev) => ({ ...prev, status: 'preparing' }));

    // 调用后端备课接口
    try {
      const result = await prepareDefaultTextbook();
      setPrepResult(result);
      // 快速完成动画并显示结果
      timerRef.current = setTimeout(() => {
        setPrepareStatus('done');
        setCurrentStep(prepareSteps.length - 1);
        setTextbook((prev) => ({ ...prev, status: 'prepared' }));
        // 刷新首页数据
        getDefaultTextbook().then(tb => setTextbook(tb)).catch(() => {});
        getLearningOverview().then(lo => setLearningOverview(lo)).catch(() => {});
      }, 1200);
    } catch (err) {
      console.warn('[Home] Backend prepare failed, fallback to local mock.', err);
      // fallback: 本地模拟动画
      timerRef.current = setTimeout(() => {
        runPrepareStep(0);
      }, 300);
    }
  }, [prepareStatus, runPrepareStep]);

  const handleEnterClassroom = useCallback(() => {
    navigate('/classroom');
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
